import { parse } from '@babel/parser';
import type { NodePath } from '@babel/traverse';
import traverseFn from '@babel/traverse';
import * as t from '@babel/types';
import MagicString from 'magic-string';
import type { HyperFXPluginOptions, TransformResult, DynamicPart } from './types.js';
import { ComponentGenerator } from './component-generator.js';
import { TemplateGenerator } from './template-generator.js';
import { CodeGenerator } from './code-generator.js';
import { SSRGenerator } from './ssr-generator.js';
import { HyperFXCompilerError, toCompilerError } from './errors.js';
import { addRuntimeImports } from './transform/runtime-imports.js';
import { generateChildrenCode as buildChildrenCode } from './transform/child-code.js';
import { isStaticElement } from './transform/static-analysis.js';
import { tryEvaluateConstant } from './transform/constant-eval.js';
import { generateDynamicCode, generateElementCodeInline } from './transform/dynamic-element.js';
import type { MapOptimizationOptions } from './transform/map-optimization.js';

// @babel/traverse is CJS with poor ESM/TypeScript support
// @ts-expect-error - CJS/ESM interop
const traverse = (traverseFn.default || traverseFn) as typeof traverseFn;



const DEFAULT_OPTIONS: Required<HyperFXPluginOptions> = {
  optimize: {
    templates: true,
    events: true,
    constants: true,
    ssr: true,
    hydrationMarkers: true,
  },
  advanced: {
    controlFlow: false,
    hoisting: false,
  },
  dev: {
    warnings: true,
    sourceMap: true,
  },
  ssr: false,
  pragma: 'jsx',
  pragmaFrag: 'Fragment',
};

export class HyperFXTransformer {
  private options: Required<HyperFXPluginOptions>;
  private currentContext: 'reactive' | 'static' | 'effect' | 'event' | 'function' = 'static';

  // Generator instances
  private componentGen: ComponentGenerator;
  private templateGen: TemplateGenerator;
  private codeGen: CodeGenerator;
  private ssrGen: SSRGenerator;

  constructor(options: HyperFXPluginOptions = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
      optimize: { ...DEFAULT_OPTIONS.optimize, ...options.optimize },
      advanced: { ...DEFAULT_OPTIONS.advanced, ...options.advanced },
      dev: { ...DEFAULT_OPTIONS.dev, ...options.dev },
    };

    // Initialize generators with dependency injection
    // We use arrow functions to preserve 'this' context
    // Note: Order matters due to circular dependencies

    // ComponentGenerator is independent
    this.componentGen = new ComponentGenerator(
      (children: Array<t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXElement | t.JSXFragment>) => this.generateChildrenCode(children),
      (node: t.Node, context?: 'reactive' | 'static' | 'effect' | 'event' | 'function') => this.codeFromNode(node, context)
    );

    // TemplateGenerator depends on ComponentGenerator
    this.templateGen = new TemplateGenerator(

    );

    // CodeGenerator depends on generateElementCode and generateSSRJSXCode
    this.codeGen = new CodeGenerator(
      () => this.options.ssr,
      (node: t.JSXElement) => this.generateElementCode(node),
      (node: t.JSXElement | t.JSXFragment) => this.generateSSRJSXCode(node),
      (children: Array<t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXElement | t.JSXFragment>) => this.generateChildrenCode(children)
    );

    // SSRGenerator depends on CodeGenerator
    this.ssrGen = new SSRGenerator(
      (node: t.Node, context?: 'reactive' | 'static' | 'effect' | 'event' | 'function') => this.codeGen.codeFromNode(node, context),
      () => this.options.optimize.hydrationMarkers || false 
    );
  }

  public setSSR(ssr: boolean): void {
    this.options.ssr = ssr;
  }

  public isSSR(): boolean {
    return this.options.ssr;
  }

  /**
   * Get or create a template (with deduplication)
   * If a template with the same HTML already exists, return its ID
   */
  private getOrCreateTemplate(html: string): string {
    return this.templateGen.getOrCreateTemplate(html);
  }



  /**
   * Transform JSX code to optimized HyperFX runtime calls
   */
  transform(code: string, id: string, ssr?: boolean): TransformResult | null {
    // Override SSR mode for this specific transformation if provided
    const originalSSR = this.options.ssr;
    if (ssr !== undefined) {
      this.options.ssr = ssr;
    }

    try {
      return this._transform(code, id);
    } finally {
      // Restore original SSR mode
      this.options.ssr = originalSSR;
    }
  }

  private _transform(code: string, id: string): TransformResult | null {
    // Skip if no JSX found
    if (!this.hasJSX(code)) {
      return null;
    }

    try {
      const ast = this.parseCode(code, id);
      const s = new MagicString(code);

      // Reset state for this file
      this.templateGen.resetCounter();

      // Track if we need to add imports
      let needsRuntimeImports = false;

      // Traverse and transform JSX
      traverse(ast, {
        JSXElement: (path: NodePath<t.JSXElement>) => {
          // Only transform top-level JSX (nested JSX will be handled recursively)
          let parent: NodePath | null = path.parentPath;
          while (parent) {
            if (parent.isJSXElement() || parent.isJSXFragment()) {
              return;
            }
            parent = parent.parentPath;
          }

          needsRuntimeImports = true;

          if (this.options.ssr) {
            this.transformJSXToRuntime(path, s);
          } else {
            this.transformJSXElement(path, s);
          }
        },
        JSXFragment: (path: NodePath<t.JSXFragment>) => {
          // Only transform top-level JSX (nested JSX will be handled recursively)
          let parent: NodePath | null = path.parentPath;
          while (parent) {
            if (parent.isJSXElement() || parent.isJSXFragment()) {
              return;
            }
            parent = parent.parentPath;
          }

          needsRuntimeImports = true;

          if (this.options.ssr) {
            this.transformJSXToRuntime(path, s);
          } else {
            this.transformJSXFragment(path, s);
          }
        },
      });


      // Add runtime imports
      if (needsRuntimeImports) {
        this.addRuntimeImports(s);
      }

      return {
        code: s.toString(),
        map: this.options.dev.sourceMap ? s.generateMap({ hires: true }) : undefined,
      };
    } catch (error) {
      throw toCompilerError(error, id);
    }
  }

  /**
   * Check if code contains JSX
   */
  private hasJSX(code: string): boolean {
    return /<[A-Z]/.test(code) || /<[a-z]/.test(code);
  }

  /**
   * Parse code to AST
   */
  private parseCode(code: string, id: string) {
    const isTypeScript = id.endsWith('.tsx') || id.endsWith('.ts');

    try {
      return parse(code, {
        sourceType: 'module',
        plugins: [
          'jsx',
          ...(isTypeScript ? ['typescript' as const] : []),
          'decorators-legacy',
          'classProperties',
          'dynamicImport',
        ],
      });
    } catch (error) {
      throw toCompilerError(error, id);
    }
  }

  private getTransformId(path: NodePath, fallback?: string): string {
    const filename = (path.hub as { file?: { opts?: { filename?: string } } } | undefined)?.file?.opts?.filename;
    return filename || fallback || 'unknown';
  }

  /**
   * Transform a JSX element
   */
  private transformJSXElement(path: NodePath<t.JSXElement>, s: MagicString): void {
    const node = path.node;

    // Check if this is a component
    if (this.componentGen.isComponentElement(node)) {
      const code = this.componentGen.generateComponentCall(node);
      const start = node.start;
      const end = node.end;
      if (typeof start !== 'number' || typeof end !== 'number') {
        throw new HyperFXCompilerError({
          id: this.getTransformId(path),
          code: 'HFX_COMPONENT_POSITION',
          message: 'Unable to transform component without source locations.',
        });
      }
      s.overwrite(start, end, code);
      return;
    }

    // Check if this is a simple static element
    if (isStaticElement(node)) {
      this.transformStaticElement(node, path, s);
    } else {
      // Dynamic element - transform with runtime helpers
      this.transformDynamicElement(node, path, s);
    }
  }

  /**
   * Transform a JSX fragment
   */
  private transformJSXFragment(path: NodePath<t.JSXFragment>, s: MagicString): void {
    const node = path.node;
    const start = node.start;
    const end = node.end;

    if (typeof start !== 'number' || typeof end !== 'number') {
      throw new HyperFXCompilerError({
          id: this.getTransformId(path),
        code: 'HFX_FRAGMENT_POSITION',
        message: 'Unable to transform fragment without source locations.',
      });
    }

    const childrenCode = this.generateChildrenCode(node.children);
    const code = `(() => {\n  const _frag$ = document.createDocumentFragment();\n  _$insert(_frag$, ${childrenCode});\n  return _frag$;\n})()`;
    s.overwrite(start, end, code);
  }

  /**
   * Transform a static element into a template
   */
  private transformStaticElement(node: t.JSXElement, path: NodePath<t.JSXElement>, s: MagicString): void {
    // Generate template HTML
    const html = this.generateTemplateHTML(node);
    const templateId = this.getOrCreateTemplate(html);

    // Replace JSX with template clone
    const start = node.start;
    const end = node.end;
    if (typeof start !== 'number' || typeof end !== 'number') {
      throw new HyperFXCompilerError({
          id: this.getTransformId(path),
        code: 'HFX_STATIC_POSITION',
        message: 'Unable to transform static element without source locations.',
      });
    }
    s.overwrite(start, end, `${templateId}.cloneNode(true)`);
  }

  /**
   * Generate HTML string from JSX element
   */
  private generateTemplateHTML(node: t.JSXElement): string {
    return this.templateGen.generateTemplateHTML(node);
  }


  /**
   * Transform a dynamic element with reactive content
   */
  private transformDynamicElement(node: t.JSXElement, path: NodePath<t.JSXElement>, s: MagicString): void {
    // Analyze the element to extract static template and dynamic parts
    const analysis = this.analyzeDynamicElement(node);

    if (!analysis) {
      // Couldn't optimize, leave as-is
      return;
    }

    const { templateHTML, dynamics } = analysis;
    const templateId = this.getOrCreateTemplate(templateHTML);

    // Generate code for the dynamic element
    const code = this.generateDynamicCode(templateId, dynamics, node);

    const start = node.start;
    const end = node.end;
    if (typeof start !== 'number' || typeof end !== 'number') {
      throw new HyperFXCompilerError({
          id: this.getTransformId(path),
        code: 'HFX_DYNAMIC_POSITION',
        message: 'Unable to transform dynamic element without source locations.',
      });
    }
    s.overwrite(start, end, code);
  }

  /**
   * Analyze a dynamic element to extract template and dynamic parts
   */
  private analyzeDynamicElement(node: t.JSXElement): { templateHTML: string; dynamics: DynamicPart[] } | null {
    return this.templateGen.analyzeDynamicElement(node);
  }

  /**
   * Try to evaluate a constant expression at compile time
   * Returns the string value if constant, null otherwise
   */
  private tryEvaluateConstant(node: t.Node): string | null {
    return tryEvaluateConstant(node, { optimizeConstants: !!this.options.optimize.constants });
  }


  /**
   * Check if an expression is reactive (function that returns content)
   * Reactive expressions require the marker to remain for updates
   */
  private isReactiveExpression(node: t.Node): boolean {
    // Arrow functions and function expressions are reactive
    if (t.isArrowFunctionExpression(node) || t.isFunctionExpression(node)) {
      return true;
    }
    // Identifiers could be functions called reactively
    if (t.isIdentifier(node)) {
      return true; // Conservative: assume identifiers might be reactive
    }
    // Call expressions with arguments are likely to return reactive content
    if (t.isCallExpression(node)) {
      // If callee is a member expression (like foo.bar()), it might return reactive content
      if (t.isMemberExpression(node.callee)) {
        return true;
      }
    }
    // Logical expressions can contain reactive parts
    if (t.isLogicalExpression(node)) {
      return this.isReactiveExpression(node.left) || this.isReactiveExpression(node.right);
    }
    // Conditional expressions can contain reactive parts
    if (t.isConditionalExpression(node)) {
      return this.isReactiveExpression(node.consequent) || this.isReactiveExpression(node.alternate);
    }
    return false;
  }

  /**
   * Generate code to access an element given its path
   * Path format: ['div[0]', 'span[1]'] means root.children[0].children[1]
   * Empty path means the root element itself
   */
   private generateElementAccess(rootVar: string, path: string[]): string {
     if (path.length === 0) {
       return rootVar;
     }

     let code = rootVar;
     for (const segment of path) {
       const match = segment.match(/\[(\d+)\]$/);
       if (match) {
         const index = match[1];
         code = `${code}.children[${index}]`;
       }
     }
     return code;
   }

  /**
   * Generate code for a dynamic element
   */
  private generateDynamicCode(templateId: string, dynamics: DynamicPart[], _node: t.JSXElement): string {
    return generateDynamicCode(templateId, dynamics, this.getDynamicElementOptions());
  }

  /**
   * Generate element creation code without IIFE wrapper (for use in map functions)
   */
  private generateElementCodeInline(templateId: string, dynamics: DynamicPart[], _node: t.JSXElement): string {
    return generateElementCodeInline(templateId, dynamics, this.getDynamicElementOptions());
  }

  private getDynamicElementOptions(): {
    codeFromNode: (node: t.Node, context?: 'reactive' | 'static' | 'effect' | 'event' | 'function') => string;
    generateElementCode: (node: t.JSXElement) => string;
    generateElementAccess: (rootVar: string, path: string[]) => string;
    isReactiveExpression: (node: t.Node) => boolean;
    tryEvaluateConstant: (node: t.Node) => string | null;
    mapOptimization: MapOptimizationOptions;
  } {
    const mapOptimization: MapOptimizationOptions = {
      codeFromNode: (node, context) => this.codeFromNode(node, context),
      generateTemplateHTML: (node) => this.generateTemplateHTML(node),
      getOrCreateTemplate: (html) => this.getOrCreateTemplate(html),
      isStaticElement: (node) => isStaticElement(node),
      analyzeDynamicElement: (node) => this.analyzeDynamicElement(node),
      generateElementCodeInline: (templateId, dynamics, node) => this.generateElementCodeInline(templateId, dynamics, node),
    };

    return {
      codeFromNode: (node, context) => this.codeFromNode(node, context),
      generateElementCode: (node) => this.generateElementCode(node),
      generateElementAccess: (rootVar, path) => this.generateElementAccess(rootVar, path),
      isReactiveExpression: (node) => this.isReactiveExpression(node),
      tryEvaluateConstant: (node) => this.tryEvaluateConstant(node),
      mapOptimization,
    };
  }
  /**
   * Check if a JSX element is a component (vs HTML element)
   * Components start with uppercase letter
   */
  private isComponentElement(node: t.JSXElement): boolean {
    return this.componentGen.isComponentElement(node);
  }

  /**
   * Generate code for children array
   */
  private generateChildrenCode(children: Array<t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXElement | t.JSXFragment>): string {
    return buildChildrenCode(children, {
      codeFromNode: (node, context) => this.codeFromNode(node, context),
      generateElementCode: (node) => this.generateElementCode(node),
    });
  }

  /**
   * Generate code for a component call (not a template)
   */
  private generateComponentCall(node: t.JSXElement): string {
    return this.componentGen.generateComponentCall(node);
  }

  /**
   * Generate code for a JSX element (recursive helper)
   */
  private generateElementCode(node: t.JSXElement): string {
    // Components must be called as functions, never converted to templates
    if (this.isComponentElement(node)) {
      return this.generateComponentCall(node);
    }

    if (isStaticElement(node)) {
      const html = this.generateTemplateHTML(node);
      const templateId = this.getOrCreateTemplate(html);
      return `${templateId}.cloneNode(true)`;
    } else {
      // Recursive dynamic element (HTML only, not components)
      const analysis = this.analyzeDynamicElement(node);
      if (analysis) {
        const templateId = this.getOrCreateTemplate(analysis.templateHTML);
        return this.generateDynamicCode(templateId, analysis.dynamics, node);
      }
      return 'null';
    }
  }

  /**
   * Convert a Babel node to code string
   */
  private codeFromNode(node: t.Node, context?: 'reactive' | 'static' | 'effect' | 'event' | 'function'): string {
    const prevContext = this.currentContext;
    if (context) this.currentContext = context;

    try {
      return this.codeGen.codeFromNode(node, context);
    } finally {
      this.currentContext = prevContext;
    }
  }

  /**
   * Add runtime imports to the code
   */
  private addRuntimeImports(s: MagicString): void {
    addRuntimeImports(s, this.templateGen, { ssr: this.options.ssr });
  }

  // --- SSR Transformation Methods ---

  /**
   * Top-level entry point for transforming a JSX element/fragment to runtime calls (SSR)
   */
  private transformJSXToRuntime(path: NodePath<t.JSXElement | t.JSXFragment>, s: MagicString): void {
    const node = path.node;
    const code = this.generateSSRJSXCode(node);

    // Replace the entire JSX element with the generated function call
    if (typeof node.start === 'number' && typeof node.end === 'number') {
      s.overwrite(node.start, node.end, code);
    }
  }

  /**
   * Recursive generator for standard JSX calls
   */
  private generateSSRJSXCode(node: t.JSXElement | t.JSXFragment | t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild): string {
    return this.ssrGen.generateSSRJSXCode(node);
  }



}
