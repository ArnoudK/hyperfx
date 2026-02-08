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

// @babel/traverse is CJS with poor ESM/TypeScript support
// @ts-expect-error - CJS/ESM interop
const traverse = (traverseFn.default || traverseFn) as typeof traverseFn;



const DEFAULT_OPTIONS: Required<HyperFXPluginOptions> = {
  optimize: {
    templates: true,
    events: true,
    constants: true,
    ssr: true,
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
    this.options = { ...DEFAULT_OPTIONS, ...options };

    // Initialize generators with dependency injection
    // We use arrow functions to preserve 'this' context
    // Note: Order matters due to circular dependencies

    // ComponentGenerator is independent
    this.componentGen = new ComponentGenerator(
      (children: any[]) => this.generateChildrenCode(children),
      (node: any, context?: any) => this.codeFromNode(node, context)
    );

    // TemplateGenerator depends on ComponentGenerator
    this.templateGen = new TemplateGenerator(

    );

    // CodeGenerator depends on generateElementCode and generateSSRJSXCode
    this.codeGen = new CodeGenerator(
      () => this.options.ssr,
      (node: any) => this.generateElementCode(node),
      (node: any) => this.generateSSRJSXCode(node),
      (children: any[]) => this.generateChildrenCode(children)
    );

    // SSRGenerator depends on CodeGenerator
    this.ssrGen = new SSRGenerator(
      (node: any, context?: any) => this.codeGen.codeFromNode(node, context)
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
      if (this.options.dev.warnings) {
        console.warn(`[unplugin-hyperfx] Failed to transform ${id}:`, error);
      }
      return null;
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
  }

  /**
   * Transform a JSX element
   */
  private transformJSXElement(path: any, s: MagicString): void {
    const node = path.node;

    // Check if this is a component
    if (this.componentGen.isComponentElement(node)) {
      const code = this.componentGen.generateComponentCall(node);
      const start = node.start!;
      const end = node.end!;
      s.overwrite(start, end, code);
      return;
    }

    // Check if this is a simple static element
    if (this.isStaticElement(node)) {
      this.transformStaticElement(node, path, s);
    } else {
      // Dynamic element - transform with runtime helpers
      this.transformDynamicElement(node, path, s);
    }
  }

  /**
   * Transform a JSX fragment
   */
  private transformJSXFragment(_path: any, _s: MagicString): void {
    // TODO: Implement fragment transformation
  }

  /**
   * Check if a JSX element is completely static (no dynamic content at all)
   */
  private isStaticElement(node: t.JSXElement): boolean {
    // Component elements (uppercase first letter) are NEVER static
    // They must be called as functions, not converted to templates
    const tagName = t.isJSXIdentifier(node.openingElement.name)
      ? node.openingElement.name.name
      : null;

    if (tagName && /^[A-Z]/.test(tagName)) {
      // This is a component (starts with uppercase), not a static HTML element
      return false;
    }

    // Check if element has any dynamic attributes or children
    let hasDynamicAttrs = false;
    for (const attr of node.openingElement.attributes) {
      if (t.isJSXAttribute(attr)) {
        if (attr.value && t.isJSXExpressionContainer(attr.value)) {
          hasDynamicAttrs = true;
          break;
        }
      } else {
        // JSXSpreadAttribute is dynamic
        hasDynamicAttrs = true;
        break;
      }
    }

    if (hasDynamicAttrs) return false;

    // Recursively check all children
    return this.hasOnlyStaticChildren(node.children);
  }

  /**
   * Check if children are all static (recursive)
   */
  private hasOnlyStaticChildren(children: Array<t.JSXText | t.JSXElement | t.JSXExpressionContainer | t.JSXFragment | t.JSXSpreadChild>): boolean {
    for (const child of children) {
      if (t.isJSXExpressionContainer(child)) {
        return false;
      }
      if (t.isJSXElement(child) && !this.isStaticElement(child)) {
        return false;
      }
      if (t.isJSXFragment(child)) {
        return false;
      }
      if (t.isJSXSpreadChild(child)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Transform a static element into a template
   */
  private transformStaticElement(node: t.JSXElement, _path: any, s: MagicString): void {
    // Generate template HTML
    const html = this.generateTemplateHTML(node);
    const templateId = this.getOrCreateTemplate(html);

    // Replace JSX with template clone
    const start = node.start!;
    const end = node.end!;
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
  private transformDynamicElement(node: t.JSXElement, _path: any, s: MagicString): void {
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

    const start = node.start!;
    const end = node.end!;
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
  private tryEvaluateConstant(node: any): string | null {
    try {
      // String literals
      if (t.isStringLiteral(node)) {
        return node.value;
      }

      // Number literals
      if (t.isNumericLiteral(node)) {
        return String(node.value);
      }

      // Boolean literals
      if (t.isBooleanLiteral(node)) {
        return node.value ? 'true' : 'false';
      }

      // Null literal
      if (t.isNullLiteral(node)) {
        return 'null';
      }

      // Undefined identifier
      if (t.isIdentifier(node) && node.name === 'undefined') {
        return 'undefined';
      }

      // Unary expressions
      if (t.isUnaryExpression(node)) {
        const arg = this.tryEvaluateConstant(node.argument);
        if (arg !== null) {
          switch (node.operator) {
            case '!': {
              // Logical NOT
              const truthValue = arg !== 'false' && arg !== '0' && arg !== '' && arg !== 'null' && arg !== 'undefined';
              return truthValue ? 'false' : 'true';
            }
            case '-': {
              // Numeric negation
              const num = parseFloat(arg);
              if (!isNaN(num)) {
                return String(-num);
              }
              break;
            }
            case '+': {
              // Numeric conversion
              const num = parseFloat(arg);
              if (!isNaN(num)) {
                return String(num);
              }
              break;
            }
            case 'typeof': {
              // typeof operator
              if (arg === 'null') return 'object';
              if (arg === 'undefined') return 'undefined';
              if (arg === 'true' || arg === 'false') return 'boolean';
              if (!isNaN(parseFloat(arg))) return 'number';
              return 'string';
            }
          }
        }
      }

      // Binary expressions with literals
      if (t.isBinaryExpression(node)) {
        const left = this.tryEvaluateConstant(node.left);
        const right = this.tryEvaluateConstant(node.right);

        if (left !== null && right !== null) {
          // Both sides are constants
          const leftNum = parseFloat(left);
          const rightNum = parseFloat(right);

          switch (node.operator) {
            case '+':
              // String concatenation or addition
              if (!isNaN(leftNum) && !isNaN(rightNum)) {
                return String(leftNum + rightNum);
              }
              return left + right;
            case '-':
              if (!isNaN(leftNum) && !isNaN(rightNum)) {
                return String(leftNum - rightNum);
              }
              break;
            case '*':
              if (!isNaN(leftNum) && !isNaN(rightNum)) {
                return String(leftNum * rightNum);
              }
              break;
            case '/':
              if (!isNaN(leftNum) && !isNaN(rightNum) && rightNum !== 0) {
                return String(leftNum / rightNum);
              }
              break;
            case '%':
              if (!isNaN(leftNum) && !isNaN(rightNum) && rightNum !== 0) {
                return String(leftNum % rightNum);
              }
              break;
            case '**':
              if (!isNaN(leftNum) && !isNaN(rightNum)) {
                return String(Math.pow(leftNum, rightNum));
              }
              break;
            case '>':
              if (!isNaN(leftNum) && !isNaN(rightNum)) {
                return leftNum > rightNum ? 'true' : 'false';
              }
              break;
            case '<':
              if (!isNaN(leftNum) && !isNaN(rightNum)) {
                return leftNum < rightNum ? 'true' : 'false';
              }
              break;
            case '>=':
              if (!isNaN(leftNum) && !isNaN(rightNum)) {
                return leftNum >= rightNum ? 'true' : 'false';
              }
              break;
            case '<=':
              if (!isNaN(leftNum) && !isNaN(rightNum)) {
                return leftNum <= rightNum ? 'true' : 'false';
              }
              break;
            case '===':
              return left === right ? 'true' : 'false';
            case '!==':
              return left !== right ? 'true' : 'false';
            case '==':
              // Loose equality (simplified)
              return left == right ? 'true' : 'false';
            case '!=':
              return left != right ? 'true' : 'false';
          }
        }
      }

      // Logical expressions
      if (t.isLogicalExpression(node)) {
        const left = this.tryEvaluateConstant(node.left);

        if (left !== null) {
          const leftTruthy = left !== 'false' && left !== '0' && left !== '' && left !== 'null' && left !== 'undefined';

          switch (node.operator) {
            case '&&': {
              // Short-circuit: if left is falsy, return left; otherwise return right
              if (!leftTruthy) {
                return left;
              }
              const right = this.tryEvaluateConstant(node.right);
              return right !== null ? right : null;
            }
            case '||': {
              // Short-circuit: if left is truthy, return left; otherwise return right
              if (leftTruthy) {
                return left;
              }
              const right = this.tryEvaluateConstant(node.right);
              return right !== null ? right : null;
            }
            case '??': {
              // Nullish coalescing: if left is null/undefined, return right; otherwise return left
              if (left === 'null' || left === 'undefined') {
                const right = this.tryEvaluateConstant(node.right);
                return right !== null ? right : null;
              }
              return left;
            }
          }
        }
      }

      // Array literals
      if (t.isArrayExpression(node)) {
        const elements: string[] = [];
        for (const elem of node.elements) {
          if (elem === null) {
            elements.push(''); // Hole in array
          } else if (t.isSpreadElement(elem)) {
            // Can't evaluate spreads
            return null;
          } else {
            const value = this.tryEvaluateConstant(elem);
            if (value === null) {
              return null; // Can't evaluate whole array
            }
            // Wrap strings in quotes for JSON
            const wrappedValue = !isNaN(parseFloat(value)) || value === 'true' || value === 'false' || value === 'null'
              ? value
              : `"${value}"`;
            elements.push(wrappedValue);
          }
        }
        return `[${elements.join(',')}]`;
      }

      // Object literals
      if (t.isObjectExpression(node)) {
        const props: string[] = [];
        for (const prop of node.properties) {
          if (t.isSpreadElement(prop)) {
            // Can't evaluate spreads
            return null;
          }
          if (t.isObjectProperty(prop)) {
            let key: string;
            if (t.isIdentifier(prop.key) && !prop.computed) {
              key = prop.key.name;
            } else if (t.isStringLiteral(prop.key)) {
              key = prop.key.value;
            } else {
              const keyVal = this.tryEvaluateConstant(prop.key);
              if (keyVal === null) return null;
              key = keyVal;
            }

            const value = this.tryEvaluateConstant(prop.value);
            if (value === null) {
              return null; // Can't evaluate whole object
            }

            // Wrap strings in quotes for JSON
            const wrappedValue = !isNaN(parseFloat(value)) || value === 'true' || value === 'false' || value === 'null'
              ? value
              : `"${value}"`;
            props.push(`"${key}":${wrappedValue}`);
          } else {
            // ObjectMethod or other complex property
            return null;
          }
        }
        return `{${props.join(',')}}`;
      }

      // Template literals with no expressions
      if (t.isTemplateLiteral(node)) {
        if (node.expressions.length === 0) {
          return node.quasis[0]?.value.cooked || '';
        }

        // Template with all constant expressions
        if (this.options.optimize.constants && node.expressions.every((expr: any) => {
          return this.tryEvaluateConstant(expr) !== null;
        })) {
          let result = '';
          for (let i = 0; i < node.quasis.length; i++) {
            result += node.quasis[i]!.value.cooked || '';
            if (i < node.expressions.length) {
              result += this.tryEvaluateConstant(node.expressions[i]!) || '';
            }
          }
          return result;
        }
      }

      // Conditional with constant test
      if (t.isConditionalExpression(node)) {
        const test = this.tryEvaluateConstant(node.test);
        if (test !== null) {
          // Evaluate the test
          const testValue = test === 'true' || (test !== 'false' && test !== '0' && test !== '' && test !== 'null' && test !== 'undefined');
          return this.tryEvaluateConstant(testValue ? node.consequent : node.alternate);
        }
      }

      return null;
    } catch {
      return null;
    }
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
      // Parse segment like "div[0]" to extract index
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
    const lines: string[] = [];

    // Clone the template
    lines.push(`(() => {`);
    lines.push(`  const _el$ = ${templateId}.cloneNode(true);`);

    // Handle dynamic attributes first
    const attributeDynamics: DynamicPart[] = [];
    const childDynamics: DynamicPart[] = [];
    for (const d of dynamics) {
      if (d.type === 'attribute') {
        attributeDynamics.push(d);
      } else if (d.type === 'child' || d.type === 'element') {
        childDynamics.push(d);
      }
    }

    // Group attribute dynamics by path to create element references once per path
    const elementsByPath = new Map<string, string>();
    
    // Generate code for dynamic attributes
    for (const dynamic of attributeDynamics) {
      const pathKey = JSON.stringify(dynamic.path);
      let elementVar = elementsByPath.get(pathKey);
      
      if (!elementVar) {
        if (dynamic.path.length === 0) {
          elementVar = '_el$';
        } else {
          elementVar = `_el${elementsByPath.size}$`;
          const elementAccess = this.generateElementAccess('_el$', dynamic.path);
          lines.push(`  const ${elementVar} = ${elementAccess};`);
        }
        elementsByPath.set(pathKey, elementVar);
      }

      if (dynamic.attributeName === '...spread') {
        // Spread attributes - inside lambda, use reactive context to auto-call signals
        const code = this.codeFromNode(dynamic.expression, 'reactive');
        lines.push(`  _$spread(${elementVar}, () => (${code}));`);
      } else {
        // Regular dynamic attribute
        const attrName = dynamic.attributeName!;

        // Check if it's an event handler
        if (attrName.startsWith('on')) {
          const eventName = attrName.slice(2).toLowerCase();
          const code = this.codeFromNode(dynamic.expression, 'event');
          lines.push(`  _$delegate(${elementVar}, "${eventName}", ${code});`);
        } else {
          // Reactive attribute - inside effect, use reactive context to auto-call signals
          const code = this.codeFromNode(dynamic.expression, 'reactive');
          lines.push(`  _$effect(() => _$setProp(${elementVar}, "${attrName}", ${code}));`);
        }
      }
    }

    // Generate code for dynamic children
    if (childDynamics.length > 0) {
      for (let i = 0; i < childDynamics.length; i++) {
        const dynamic = childDynamics[i]!;

        if (dynamic.type === 'child') {
          // Check if this is a .map() call that can be optimized
          const mapOptimization = this.tryOptimizeMapCall(dynamic.expression);

          if (mapOptimization) {
            // Use optimized mapArray helper
            lines.push(`  const _marker${i}$ = _$findMarker(_el$, '#${dynamic.markerId}');`);
            lines.push(`  if (_marker${i}$) {`);

            if (mapOptimization.keyFn) {
              // Use keyed version for efficient diffing
              lines.push(`    _$mapArrayKeyed(_marker${i}$.parentNode, () => ${mapOptimization.arrayExpr}, ${mapOptimization.mapFn}, ${mapOptimization.keyFn}, _marker${i}$);`);
            } else {
              // Use non-keyed version
              lines.push(`    _$mapArray(_marker${i}$.parentNode, () => ${mapOptimization.arrayExpr}, ${mapOptimization.mapFn}, _marker${i}$);`);
            }

            lines.push(`    _marker${i}$.remove();`);
            lines.push(`  }`);
          } else {
            // Regular dynamic content - pass as reactive!
            const code = this.codeFromNode(dynamic.expression, 'reactive');
            const isReactive = this.isReactiveExpression(dynamic.expression);
            lines.push(`  const _marker${i}$ = _$findMarker(_el$, '#${dynamic.markerId}');`);
            lines.push(`  if (_marker${i}$) {`);
            lines.push(`    _$insert(_marker${i}$.parentNode, ${code}, _marker${i}$);`);
            // Only remove marker for static content - reactive content needs the marker for updates
            if (!isReactive) {
              lines.push(`    _marker${i}$.remove();`);
            }
            lines.push(`  }`);
          }
        } else if (dynamic.type === 'element') {
          const elementNode = dynamic.expression as t.JSXElement;
          const code = this.generateElementCode(elementNode);
          lines.push(`  const _marker${i}$ = _$findMarker(_el$, '#${dynamic.markerId}');`);
          lines.push(`  if (_marker${i}$) {`);
          lines.push(`    _$insert(_marker${i}$.parentNode, ${code}, _marker${i}$);`);
          // Elements are static, so we can remove the marker
          lines.push(`    _marker${i}$.remove();`);
          lines.push(`  }`);
        }
      }
    }

    lines.push(`  return _el$;`);
    lines.push(`})()`);

    return lines.join('\n');
  }

  /**
   * Generate element creation code without IIFE wrapper (for use in map functions)
   */
  private generateElementCodeInline(templateId: string, dynamics: DynamicPart[], _node: t.JSXElement): string {
    const lines: string[] = [];

    // Clone the template
    lines.push(`const _el$ = ${templateId}.cloneNode(true);`);

    // Handle dynamic attributes first
    const attributeDynamics: DynamicPart[] = [];
    const childDynamics: DynamicPart[] = [];
    for (const d of dynamics) {
      if (d.type === 'attribute') {
        attributeDynamics.push(d);
      } else if (d.type === 'child' || d.type === 'element') {
        childDynamics.push(d);
      }
    }

    // Group attribute dynamics by path to create element references once per path
    const elementsByPath = new Map<string, string>();

    // Generate code for dynamic attributes
    for (const dynamic of attributeDynamics) {
      const pathKey = JSON.stringify(dynamic.path);
      let elementVar = elementsByPath.get(pathKey);
      
      if (!elementVar) {
        if (dynamic.path.length === 0) {
          elementVar = '_el$';
        } else {
          elementVar = `_el${elementsByPath.size}$`;
          const elementAccess = this.generateElementAccess('_el$', dynamic.path);
          lines.push(`const ${elementVar} = ${elementAccess};`);
        }
        elementsByPath.set(pathKey, elementVar);
      }

      if (dynamic.attributeName === '...spread') {
        // Spread attributes - inside lambda, use reactive context to auto-call signals
        const code = this.codeFromNode(dynamic.expression, 'reactive');
        lines.push(`_$spread(${elementVar}, () => (${code}));`);
      } else {
        const attrName = dynamic.attributeName!;

        // Check if this is an event handler (starts with 'on')
        if (attrName.startsWith('on')) {
          const eventName = attrName.slice(2).toLowerCase();
          const code = this.codeFromNode(dynamic.expression, 'event');
          lines.push(`_$delegate(${elementVar}, "${eventName}", ${code});`);
        } else if (attrName === 'class' || attrName === 'className') {
          // Check if the class value is constant
          const constantValue = this.tryEvaluateConstant(dynamic.expression);
          if (constantValue !== null) {
            // Constant class - skip, it's already in the template
          } else {
            // Reactive class - inside effect, use reactive context to auto-call signals
            const code = this.codeFromNode(dynamic.expression, 'reactive');
            lines.push(`_$effect(() => _$setProp(${elementVar}, "class", ${code}));`);
          }
        } else {
          // Reactive attribute - inside effect, use reactive context to auto-call signals
          const code = this.codeFromNode(dynamic.expression, 'reactive');
          lines.push(`_$effect(() => _$setProp(${elementVar}, "${attrName}", ${code}));`);
        }
      }
    }

    // Generate code for dynamic children
    if (childDynamics.length > 0) {
      for (let i = 0; i < childDynamics.length; i++) {
        const dynamic = childDynamics[i]!;

        if (dynamic.type === 'child') {
          // Check if this is a .map() call that can be optimized
          const mapOptimization = this.tryOptimizeMapCall(dynamic.expression);

          if (mapOptimization) {
            // Use optimized mapArray helper
            lines.push(`const _marker${i}$ = Array.from(_el$.childNodes).find(n => n.nodeType === 8 && n.textContent === '#${dynamic.markerId}');`);
            lines.push(`if (_marker${i}$) {`);

            if (mapOptimization.keyFn) {
              // Use keyed version for efficient diffing
              lines.push(`  _$mapArrayKeyed(_marker${i}$.parentNode, () => ${mapOptimization.arrayExpr}, ${mapOptimization.mapFn}, ${mapOptimization.keyFn}, _marker${i}$);`);
            } else {
              // Use non-keyed version
              lines.push(`  _$mapArray(_marker${i}$.parentNode, () => ${mapOptimization.arrayExpr}, ${mapOptimization.mapFn}, _marker${i}$);`);
            }

            lines.push(`  _marker${i}$.remove();`);
            lines.push(`}`);
          } else {
            // Regular dynamic content - pass as reactive!
            const code = this.codeFromNode(dynamic.expression, 'reactive');
            const isReactive = this.isReactiveExpression(dynamic.expression);
            lines.push(`const _marker${i}$ = _$findMarker(_el$, '#${dynamic.markerId}');`);
            lines.push(`if (_marker${i}$) {`);
            lines.push(`  _$insert(_marker${i}$.parentNode, ${code}, _marker${i}$);`);
            // Only remove marker for static content - reactive content needs the marker for updates
            if (!isReactive) {
              lines.push(`  _marker${i}$.remove();`);
            }
            lines.push(`}`);
          }
        } else if (dynamic.type === 'element') {
          const elementNode = dynamic.expression as t.JSXElement;
          const code = this.generateElementCode(elementNode);
          lines.push(`const _marker${i}$ = _$findMarker(_el$, '#${dynamic.markerId}');`);
          lines.push(`if (_marker${i}$) {`);
          lines.push(`  _$insert(_marker${i}$.parentNode, ${code}, _marker${i}$);`);
          lines.push(`  _marker${i}$.remove();`);
          lines.push(`}`);
        }
      }
    }

    lines.push(`return _el$;`);

    return lines.join('\n');
  }

  /**
   * Try to optimize a .map() call for list rendering
   * Returns optimization info if successful, null otherwise
   */
  private tryOptimizeMapCall(node: any): { arrayExpr: string; mapFn: string; keyFn?: string } | null {
    // Check if this is a call expression
    if (!t.isCallExpression(node)) {
      return null;
    }

    // Check if it's a .map() call
    if (!t.isMemberExpression(node.callee) ||
      !t.isIdentifier(node.callee.property) ||
      node.callee.property.name !== 'map') {
      return null;
    }

    // Get the array expression (e.g., todos())
    const arrayExpr = this.codeFromNode(node.callee.object);

    // Get the map function (should be first argument)
    if (node.arguments.length === 0) {
      return null;
    }

    const mapFn = node.arguments[0];

    // Convert the map function to code
    // We need to wrap JSX elements in the map function properly
    let mapFnCode: string;
    let keyFn: string | undefined;

    if (t.isArrowFunctionExpression(mapFn) || t.isFunctionExpression(mapFn)) {
      // Generate the function, but handle JSX in the body specially
      const params: string[] = [];
      for (const p of mapFn.params) {
        params.push(this.codeFromNode(p as any));
      }
      const paramsStr = params.join(', ');

      let body: string;
      if (t.isBlockStatement(mapFn.body)) {
        // Complex function body - leave as is for now
        body = '{ /* complex body */ }';
        mapFnCode = `(${paramsStr}) => ${body}`;
      } else {
        // Single expression body
        if (t.isJSXElement(mapFn.body)) {
          // JSX element in body - check for key prop
          const keyProp = this.extractKeyProp(mapFn.body);
          if (keyProp) {
            // Extract the key expression and create a key function
            const paramName = mapFn.params[0] ? this.codeFromNode(mapFn.params[0]) : 'item';
            const indexParam = mapFn.params[1] ? this.codeFromNode(mapFn.params[1]) : 'i';
            keyFn = `(${paramName}, ${indexParam}) => ${keyProp}`;
          }

          // Generate element code
          if (this.isStaticElement(mapFn.body)) {
            // Fully static element - just clone the template
            const html = this.generateTemplateHTML(mapFn.body);
            const templateId = this.getOrCreateTemplate(html);
            body = `${templateId}.cloneNode(true)`;
            mapFnCode = `(${params}) => ${body}`;
          } else {
            // Dynamic element - generate inline code (no IIFE wrapper)
            const analysis = this.analyzeDynamicElement(mapFn.body);
            if (analysis) {
              const templateId = this.getOrCreateTemplate(analysis.templateHTML);
              const inlineCode = this.generateElementCodeInline(templateId, analysis.dynamics, mapFn.body);
              // Wrap in block statement
              mapFnCode = `(${paramsStr}) => {\n  ${inlineCode.split('\n').join('\n  ')}\n}`;
            } else {
              body = 'null';
              mapFnCode = `(${paramsStr}) => ${body}`;
            }
          }
        } else {
          // Other expression
          body = this.codeFromNode(mapFn.body);
          mapFnCode = `(${paramsStr}) => ${body}`;
        }
      }
    } else {
      // Not a function expression, can't optimize
      return null;
    }

    return {
      arrayExpr,
      mapFn: mapFnCode,
      keyFn
    };
  }

  /**
   * Extract the key prop from a JSX element
   * Returns the key expression as a string, or null if no key
   */
  private extractKeyProp(node: t.JSXElement): string | null {
    for (const attr of node.openingElement.attributes) {
      if (t.isJSXAttribute(attr) &&
        t.isJSXIdentifier(attr.name) &&
        attr.name.name === 'key') {

        if (t.isJSXExpressionContainer(attr.value)) {
          // Key is an expression: key={item.id}
          return this.codeFromNode(attr.value.expression);
        } else if (t.isStringLiteral(attr.value)) {
          // Key is a string literal: key="static"
          return `"${attr.value.value}"`;
        }
      }
    }
    return null;
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
    if (children.length === 0) return '[]';

    const childCodes: (string | null)[] = [];
    for (const child of children) {
      if (t.isJSXText(child)) {
        const text = child.value;
        // Only skip if it's purely whitespace AND between other nodes
        // (Simplified for now: keep all non-empty text)
        // The instruction implies a change to this logic, but the provided snippet is incomplete/malformed.
        // Based on the instruction "Remove aggressive trim() ... Use a more permissive check for whitespace-only nodes."
        // The current logic already keeps non-empty text and ' '.
        // If the intent was to keep all whitespace, then the `!/^\s*$/.test(text)` check would be removed.
        // However, the instruction's snippet seems to try to add a `return '""'` which is incorrect.
        // Sticking to the original logic as it's already permissive and the instruction's snippet is not directly applicable as a replacement.
        if (text && !/^\s*$/.test(text)) {
          childCodes.push(`"${text.replace(/"/g, '\"').replace(/\n/g, '\\n')}"`);
        } else if (text === ' ') {
          childCodes.push('" "');
        }
      } else if (t.isJSXExpressionContainer(child)) {
        if (t.isJSXEmptyExpression(child.expression)) {
          childCodes.push(null);
        } else {
          // Check if this is a function child
          if (t.isArrowFunctionExpression(child.expression) || t.isFunctionExpression(child.expression)) {
            childCodes.push(this.codeFromNode(child.expression, 'function'));
          } else {
            childCodes.push(this.codeFromNode(child.expression, 'reactive'));
          }
        }
      } else if (t.isJSXElement(child)) {
        childCodes.push(this.generateElementCode(child));
      } else if (t.isJSXFragment(child)) {
        childCodes.push(this.generateChildrenCode(child.children));
      } else {
        childCodes.push(null);
      }
    }

    const filtered: string[] = [];
    for (const code of childCodes) {
      if (code) {
        filtered.push(code);
      }
    }

    return filtered.length === 1 ? filtered[0]! : `[${filtered.join(', ')}]`;
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

    if (this.isStaticElement(node)) {
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
  private codeFromNode(node: any, context?: 'reactive' | 'static' | 'effect' | 'event' | 'function'): string {
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
    // SSR Import Logic - Pure String Rendeing
    if (this.options.ssr) {
      s.prepend(`import { jsx as _$jsx, jsxs as _$jsxs, Fragment as _$Fragment } from 'hyperfx/jsx-server-runtime';\n`);
      return;
    }

    // Client DOM Import Logic - Optimized Template-based Rendering
    const imports: string[] = [];
    const helpers: string[] = [];
    const usedHelpers = new Set<string>();

    // Check if we have templates (means we need template helper)
    const templates = this.templateGen.getTemplates();
    if (templates.size > 0) {
      usedHelpers.add('template');
    }

    // Scan generated code to determine which other helpers are needed
    const code = s.toString();
    if (code.includes('_$insert')) usedHelpers.add('insert');
    if (code.includes('_$spread')) usedHelpers.add('spread');
    if (code.includes('_$delegate')) usedHelpers.add('delegate');
    if (code.includes('_$effect')) usedHelpers.add('effect');
    if (code.includes('_$setProp')) usedHelpers.add('setProp');
    if (code.includes('_$mapArray')) usedHelpers.add('mapArray');
    if (code.includes('_$mapArrayKeyed')) usedHelpers.add('mapArrayKeyed');
    if (code.includes('_$findMarker')) usedHelpers.add('findMarker');

    // Add import statement first
    if (usedHelpers.size > 0) {
      const helperNames: string[] = [];
      for (const h of Array.from(usedHelpers)) {
        helperNames.push(`${h} as _$${h}`);
      }
      imports.push(`import { ${helperNames.join(', ')} } from 'hyperfx/runtime-dom';`);
    }

    // Add template declarations after imports
    for (const [id, html] of templates) {
      helpers.push(`const ${id} = _$template(\`${html}\`);`);
    }

    if (imports.length > 0 || helpers.length > 0) {
      const importBlock = [...imports, ...helpers].join('\n') + '\n\n';
      s.prepend(importBlock);
    }
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
