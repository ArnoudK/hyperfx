import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import MagicString from 'magic-string';
import type { HyperFXPluginOptions, TransformResult, DynamicPart } from './types.js';

// @babel/traverse is CJS with poor ESM/TypeScript support
// @ts-ignore - traverseModule.default exists at runtime
const traverse = traverseModule.default ?? traverseModule;

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
  private templateCounter = 0;
  private templates: Map<string, string> = new Map();
  private templatesByHTML: Map<string, string> = new Map(); // HTML -> templateId for deduplication
  private currentContext: 'reactive' | 'static' | 'effect' | 'event' = 'static';

  constructor(options: HyperFXPluginOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Get or create a template (with deduplication)
   * If a template with the same HTML already exists, return its ID
   */
  private getOrCreateTemplate(html: string): string {
    // Check if template already exists
    const existing = this.templatesByHTML.get(html);
    if (existing) {
      return existing; // Reuse existing template
    }
    
    // Create new template
    const templateId = `_tmpl$${this.templateCounter++}`;
    this.templates.set(templateId, html);
    this.templatesByHTML.set(html, templateId);
    return templateId;
  }

  /**
   * Check if an identifier is a known global that shouldn't be optimized
   */
  private isKnownGlobal(name: string): boolean {
    const globals = new Set([
      // Constructors
      'Date', 'Array', 'Object', 'String', 'Number', 'Boolean', 'RegExp',
      'Map', 'Set', 'WeakMap', 'WeakSet', 'Promise', 'Error',
      
      // Global functions
      'parseInt', 'parseFloat', 'isNaN', 'isFinite',
      'encodeURI', 'decodeURI', 'encodeURIComponent', 'decodeURIComponent',
    ]);
    
    return globals.has(name);
  }

  /**
   * Check if a member expression is a known non-signal pattern
   */
  private isKnownNonSignal(memberCode: string): boolean {
    const patterns = [
      'Math.random', 'Math.floor', 'Math.ceil', 'Math.round',
      'console.log', 'console.error', 'console.warn',
      'crypto.randomUUID',
      'performance.now',
      'Date.now',
    ];
    
    return patterns.some(pattern => memberCode.startsWith(pattern));
  }

  /**
   * Transform JSX code to optimized HyperFX runtime calls
   */
  transform(code: string, id: string): TransformResult | null {
    // Skip if no JSX found
    if (!this.hasJSX(code)) {
      return null;
    }

    try {
      const ast = this.parseCode(code, id);
      const s = new MagicString(code);
      
      // Reset state for this file
      this.templateCounter = 0;
      this.templates.clear();
      this.templatesByHTML.clear();

      // Track if we need to add imports
      let needsRuntimeImports = false;

      // Traverse and transform JSX
      traverse(ast, {
        JSXElement: (path: NodePath<t.JSXElement>) => {
          // Skip if this element is inside another JSX element we're already processing
          // Walk up the tree to check if any ancestor is a JSX element
          let parent: NodePath | null = path.parentPath;
          while (parent) {
            if (parent.isJSXElement()) {
              // This JSX element is nested inside another JSX element
              // Skip it - it will be handled as part of the parent
              return;
            }
            parent = parent.parentPath;
          }
          
          needsRuntimeImports = true;
          this.transformJSXElement(path, s);
        },
        JSXFragment: (path: NodePath<t.JSXFragment>) => {
          needsRuntimeImports = true;
          this.transformJSXFragment(path, s);
        },
      });

      // Add runtime imports if needed
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
  private transformJSXFragment(path: any, s: MagicString): void {
    // TODO: Implement fragment transformation
  }

  /**
   * Check if a JSX element is completely static (no dynamic content at all)
   */
  private isStaticElement(node: t.JSXElement): boolean {
    // Check if element has any dynamic attributes or children
    const hasDynamicAttrs = node.openingElement.attributes.some((attr) => {
      if (t.isJSXAttribute(attr)) {
        return attr.value && t.isJSXExpressionContainer(attr.value);
      }
      return true; // JSXSpreadAttribute is dynamic
    });

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
  private transformStaticElement(node: t.JSXElement, path: any, s: MagicString): void {
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
    const tagName = this.getTagName(node.openingElement);
    const attrs = this.getAttributesHTML(node.openingElement.attributes);
    const children = this.getChildrenHTML(node.children);

    if (node.openingElement.selfClosing) {
      return `<${tagName}${attrs} />`;
    }

    return `<${tagName}${attrs}>${children}</${tagName}>`;
  }

  /**
   * Get tag name from JSX opening element
   */
  private getTagName(opening: t.JSXOpeningElement): string {
    if (t.isJSXIdentifier(opening.name)) {
      return opening.name.name;
    }
    // Handle namespaced names, member expressions, etc.
    return 'div'; // Fallback
  }

  /**
   * Get HTML attributes string
   */
  private getAttributesHTML(attributes: Array<t.JSXAttribute | t.JSXSpreadAttribute>): string {
    const attrs: string[] = [];

    for (const attr of attributes) {
      if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
        const name = attr.name.name;
        
        if (!attr.value) {
          attrs.push(name);
        } else if (t.isStringLiteral(attr.value)) {
          attrs.push(`${name}="${attr.value.value}"`);
        }
      }
    }

    return attrs.length > 0 ? ' ' + attrs.join(' ') : '';
  }

  /**
   * Get HTML children string
   */
  private getChildrenHTML(children: Array<t.JSXText | t.JSXElement | t.JSXExpressionContainer | t.JSXFragment | t.JSXSpreadChild>): string {
    return children
      .map((child) => {
        if (t.isJSXText(child)) {
          return child.value.trim();
        } else if (t.isJSXElement(child)) {
          return this.generateTemplateHTML(child);
        }
        return '';
      })
      .filter(Boolean)
      .join('');
  }

  /**
   * Transform a dynamic element with reactive content
   */
  private transformDynamicElement(node: t.JSXElement, path: any, s: MagicString): void {
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
    const dynamics: DynamicPart[] = [];
    const markerCounter = { value: 0 };

    // Build template HTML with markers for dynamic content
    const templateHTML = this.buildTemplateWithMarkers(node, dynamics, markerCounter);

    return { templateHTML, dynamics };
  }

  /**
   * Build template HTML with comment markers for dynamic insertions
   */
  private buildTemplateWithMarkers(
    node: t.JSXElement,
    dynamics: DynamicPart[],
    markerCounter: { value: number }
  ): string {
    const tagName = this.getTagName(node.openingElement);
    
    // Separate static and dynamic attributes
    const { staticAttrs, dynamicAttrs } = this.separateAttributes(node.openingElement.attributes);
    
    // Add dynamic attributes to dynamics array
    for (const dynAttr of dynamicAttrs) {
      dynamics.push({
        type: 'attribute',
        markerId: -1, // Not using marker for attributes
        expression: dynAttr.value,
        path: [],
        attributeName: dynAttr.name,
      });
    }
    
    // Process children
    const childrenHTML = this.buildChildrenWithMarkers(node.children, dynamics, markerCounter);

    if (node.openingElement.selfClosing) {
      return `<${tagName}${staticAttrs} />`;
    }

    return `<${tagName}${staticAttrs}>${childrenHTML}</${tagName}>`;
  }

  /**
   * Separate static and dynamic attributes
   */
  private separateAttributes(attributes: Array<t.JSXAttribute | t.JSXSpreadAttribute>): {
    staticAttrs: string;
    dynamicAttrs: Array<{ name: string; value: any }>;
  } {
    const staticAttrsList: string[] = [];
    const dynamicAttrs: Array<{ name: string; value: any }> = [];

    for (const attr of attributes) {
      if (t.isJSXSpreadAttribute(attr)) {
        // Spread attributes are always dynamic
        dynamicAttrs.push({
          name: '...spread',
          value: attr.argument,
        });
      } else if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
        const name = attr.name.name;
        
        // Skip the key attribute - it's only used for diffing, not rendered to DOM
        if (name === 'key') {
          continue;
        }
        
        if (!attr.value) {
          // Boolean attribute (e.g., disabled)
          staticAttrsList.push(name);
        } else if (t.isStringLiteral(attr.value)) {
          // Static string value
          staticAttrsList.push(`${name}="${attr.value.value}"`);
        } else if (t.isJSXExpressionContainer(attr.value)) {
          const expr = attr.value.expression;
          
          // Try to evaluate constant expressions
          if (this.options.optimize.constants) {
            const constantValue = this.tryEvaluateConstant(expr);
            if (constantValue !== null) {
              // Constant expression - make it static
              // Escape quotes in the value for HTML
              const escapedValue = constantValue.replace(/"/g, '&quot;');
              staticAttrsList.push(`${name}="${escapedValue}"`);
              continue;
            }
          }
          
          // Dynamic expression
          dynamicAttrs.push({
            name,
            value: expr,
          });
        }
      }
    }

    const staticAttrs = staticAttrsList.length > 0 ? ' ' + staticAttrsList.join(' ') : '';
    return { staticAttrs, dynamicAttrs };
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
   * Build children HTML with markers for dynamic content
   */
  private buildChildrenWithMarkers(
    children: Array<t.JSXText | t.JSXElement | t.JSXExpressionContainer | t.JSXFragment | t.JSXSpreadChild>,
    dynamics: DynamicPart[],
    markerCounter: { value: number }
  ): string {
    const parts: string[] = [];

    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      if (t.isJSXText(child)) {
        const text = child.value.trim();
        if (text) {
          parts.push(text);
        }
      } else if (t.isJSXExpressionContainer(child)) {
        // Dynamic content - insert marker
        const markerId = markerCounter.value++;
        const marker = `<!--#${markerId}-->`;
        parts.push(marker);
        
        dynamics.push({
          type: 'child',
          markerId,
          expression: child.expression,
          path: [],
        });
      } else if (t.isJSXElement(child)) {
        // Check if child element is static or dynamic
        if (this.isStaticElement(child)) {
          parts.push(this.generateTemplateHTML(child));
        } else {
          // Nested dynamic element - for now, use marker (will improve in later phases)
          const markerId = markerCounter.value++;
          const marker = `<!--#${markerId}-->`;
          parts.push(marker);
          
          dynamics.push({
            type: 'element',
            markerId,
            expression: child,
            path: [],
          });
        }
      }
    }

    return parts.join('');
  }

  /**
   * Generate code for a dynamic element
   */
  private generateDynamicCode(templateId: string, dynamics: DynamicPart[], node: t.JSXElement): string {
    const lines: string[] = [];
    
    // Clone the template
    lines.push(`(() => {`);
    lines.push(`  const _el$ = ${templateId}.cloneNode(true);`);

    // Handle dynamic attributes first
    const attributeDynamics = dynamics.filter(d => d.type === 'attribute');
    const childDynamics = dynamics.filter(d => d.type === 'child' || d.type === 'element');

    // Generate code for dynamic attributes
    for (const dynamic of attributeDynamics) {
      if (dynamic.attributeName === '...spread') {
        // Spread attributes - inside lambda, keep calls
        const code = this.codeFromNode(dynamic.expression, 'effect');
        lines.push(`  _$spread(_el$, () => (${code}));`);
      } else {
        // Regular dynamic attribute
        const attrName = dynamic.attributeName!;
        
        // Check if it's an event handler
        if (attrName.startsWith('on')) {
          const eventName = attrName.slice(2).toLowerCase();
          const code = this.codeFromNode(dynamic.expression, 'event');
          lines.push(`  _$delegate(_el$, "${eventName}", ${code});`);
        } else {
          // Reactive attribute - inside effect, keep calls
          const code = this.codeFromNode(dynamic.expression, 'effect');
          lines.push(`  _$effect(() => _$setProp(_el$, "${attrName}", ${code}));`);
        }
      }
    }

    // Generate code for dynamic children
    if (childDynamics.length > 0) {
      for (let i = 0; i < childDynamics.length; i++) {
        const dynamic = childDynamics[i];
        
        if (dynamic.type === 'child') {
          // Check if this is a .map() call that can be optimized
          const mapOptimization = this.tryOptimizeMapCall(dynamic.expression);
          
          if (mapOptimization) {
            // Use optimized mapArray helper
            lines.push(`  const _marker${i}$ = Array.from(_el$.childNodes).find(n => n.nodeType === 8 && n.textContent === '#${dynamic.markerId}');`);
            lines.push(`  if (_marker${i}$) {`);
            
            if (mapOptimization.keyFn) {
              // Use keyed version for efficient diffing
              lines.push(`    _$mapArrayKeyed(_el$, () => ${mapOptimization.arrayExpr}, ${mapOptimization.mapFn}, ${mapOptimization.keyFn}, _marker${i}$);`);
            } else {
              // Use non-keyed version
              lines.push(`    _$mapArray(_el$, () => ${mapOptimization.arrayExpr}, ${mapOptimization.mapFn}, _marker${i}$);`);
            }
            
            lines.push(`    _marker${i}$.remove();`);
            lines.push(`  }`);
          } else {
            // Regular dynamic content - pass as reactive!
            const code = this.codeFromNode(dynamic.expression, 'reactive');
            lines.push(`  const _marker${i}$ = Array.from(_el$.childNodes).find(n => n.nodeType === 8 && n.textContent === '#${dynamic.markerId}');`);
            lines.push(`  if (_marker${i}$) {`);
            lines.push(`    _$insert(_el$, ${code}, _marker${i}$);`);
            lines.push(`    _marker${i}$.remove();`);
            lines.push(`  }`);
          }
        } else if (dynamic.type === 'element') {
          const elementNode = dynamic.expression as t.JSXElement;
          const code = this.generateElementCode(elementNode);
          lines.push(`  const _marker${i}$ = Array.from(_el$.childNodes).find(n => n.nodeType === 8 && n.textContent === '#${dynamic.markerId}');`);
          lines.push(`  if (_marker${i}$) {`);
          lines.push(`    _$insert(_el$, ${code}, _marker${i}$);`);
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
  private generateElementCodeInline(templateId: string, dynamics: DynamicPart[], node: t.JSXElement): string {
    const lines: string[] = [];
    
    // Clone the template
    lines.push(`const _el$ = ${templateId}.cloneNode(true);`);

    // Handle dynamic attributes first
    const attributeDynamics = dynamics.filter(d => d.type === 'attribute');
    const childDynamics = dynamics.filter(d => d.type === 'child' || d.type === 'element');

    // Generate code for dynamic attributes
    for (const dynamic of attributeDynamics) {
      if (dynamic.attributeName === '...spread') {
        // Spread attributes - inside lambda, keep calls
        const code = this.codeFromNode(dynamic.expression, 'effect');
        lines.push(`_$spread(_el$, () => (${code}));`);
      } else {
        const attrName = dynamic.attributeName!;
        
        // Check if this is an event handler (starts with 'on')
        if (attrName.startsWith('on')) {
          const eventName = attrName.slice(2).toLowerCase();
          const code = this.codeFromNode(dynamic.expression, 'event');
          lines.push(`_$delegate(_el$, "${eventName}", ${code});`);
        } else if (attrName === 'class' || attrName === 'className') {
          // Check if the class value is constant
          const constantValue = this.tryEvaluateConstant(dynamic.expression);
          if (constantValue !== null) {
            // Constant class - skip, it's already in the template
          } else {
            // Reactive class - inside effect, keep calls
            const code = this.codeFromNode(dynamic.expression, 'effect');
            lines.push(`_$effect(() => _$setProp(_el$, "class", ${code}));`);
          }
        } else {
          // Reactive attribute - inside effect, keep calls
          const code = this.codeFromNode(dynamic.expression, 'effect');
          lines.push(`_$effect(() => _$setProp(_el$, "${attrName}", ${code}));`);
        }
      }
    }

    // Generate code for dynamic children
    if (childDynamics.length > 0) {
      for (let i = 0; i < childDynamics.length; i++) {
        const dynamic = childDynamics[i];
        
        if (dynamic.type === 'child') {
          // Check if this is a .map() call that can be optimized
          const mapOptimization = this.tryOptimizeMapCall(dynamic.expression);
          
          if (mapOptimization) {
            // Use optimized mapArray helper
            lines.push(`const _marker${i}$ = Array.from(_el$.childNodes).find(n => n.nodeType === 8 && n.textContent === '#${dynamic.markerId}');`);
            lines.push(`if (_marker${i}$) {`);
            
            if (mapOptimization.keyFn) {
              // Use keyed version for efficient diffing
              lines.push(`  _$mapArrayKeyed(_el$, () => ${mapOptimization.arrayExpr}, ${mapOptimization.mapFn}, ${mapOptimization.keyFn}, _marker${i}$);`);
            } else {
              // Use non-keyed version
              lines.push(`  _$mapArray(_el$, () => ${mapOptimization.arrayExpr}, ${mapOptimization.mapFn}, _marker${i}$);`);
            }
            
            lines.push(`  _marker${i}$.remove();`);
            lines.push(`}`);
          } else {
            // Regular dynamic content - pass as reactive!
            const code = this.codeFromNode(dynamic.expression, 'reactive');
            lines.push(`const _marker${i}$ = Array.from(_el$.childNodes).find(n => n.nodeType === 8 && n.textContent === '#${dynamic.markerId}');`);
            lines.push(`if (_marker${i}$) {`);
            lines.push(`  _$insert(_el$, ${code}, _marker${i}$);`);
            lines.push(`  _marker${i}$.remove();`);
            lines.push(`}`);
          }
        } else if (dynamic.type === 'element') {
          const elementNode = dynamic.expression as t.JSXElement;
          const code = this.generateElementCode(elementNode);
          lines.push(`const _marker${i}$ = Array.from(_el$.childNodes).find(n => n.nodeType === 8 && n.textContent === '#${dynamic.markerId}');`);
          lines.push(`if (_marker${i}$) {`);
          lines.push(`  _$insert(_el$, ${code}, _marker${i}$);`);
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
      const params = mapFn.params.map((p: any) => this.codeFromNode(p)).join(', ');
      
      let body: string;
      if (t.isBlockStatement(mapFn.body)) {
        // Complex function body - leave as is for now
        body = '{ /* complex body */ }';
        mapFnCode = `(${params}) => ${body}`;
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
              mapFnCode = `(${params}) => {\n  ${inlineCode.split('\n').join('\n  ')}\n}`;
            } else {
              body = 'null';
              mapFnCode = `(${params}) => ${body}`;
            }
          }
        } else {
          // Other expression
          body = this.codeFromNode(mapFn.body);
          mapFnCode = `(${params}) => ${body}`;
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
   * Generate code for a JSX element (recursive helper)
   */
  private generateElementCode(node: t.JSXElement): string {
    if (this.isStaticElement(node)) {
      const html = this.generateTemplateHTML(node);
      const templateId = this.getOrCreateTemplate(html);
      return `${templateId}.cloneNode(true)`;
    } else {
      // Recursive dynamic element
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
  private codeFromNode(node: any, context?: 'reactive' | 'static' | 'effect' | 'event'): string {
    const prevContext = this.currentContext;
    if (context) this.currentContext = context;
    
    try {
      // For JSXEmptyExpression, return null
      if (t.isJSXEmptyExpression(node)) {
        return 'null';
      }

      // For simple cases, generate code directly
      if (t.isIdentifier(node)) {
        return node.name;
      }
    
    if (t.isCallExpression(node)) {
      // Check if this is a zero-argument call that could be a signal
      if (node.arguments.length === 0 && this.currentContext === 'reactive') {
        
        // Handle simple identifier: count()
        if (t.isIdentifier(node.callee)) {
          const name = node.callee.name;
          
          // Don't optimize known global constructors/functions
          if (this.isKnownGlobal(name)) {
            return `${name}()`;
          }
          
          // Optimize: count() → count
          return name;
        }
        
        // Handle member expression: props.count(), store.items(), user.name()
        if (t.isMemberExpression(node.callee) && !node.callee.computed) {
          // Only optimize non-computed member expressions
          // props.count() → props.count ✓
          // obj[key]() → obj[key]() ✗ (keep as call)
          
          const memberCode = this.codeFromNode(node.callee);
          
          // Don't optimize known non-signals
          if (this.isKnownNonSignal(memberCode)) {
            return `${memberCode}()`;
          }
          
          // Optimize: props.count() → props.count
          return memberCode;
        }
      }
      
      // Default: keep as call expression
      const callee = this.codeFromNode(node.callee);
      const args = node.arguments.map((arg: any) => this.codeFromNode(arg)).join(', ');
      return `${callee}(${args})`;
    }

    if (t.isOptionalCallExpression(node)) {
      // Check if this is a zero-argument call that could be a signal
      if (node.arguments.length === 0 && this.currentContext === 'reactive') {
        
        // Handle simple identifier: count?.()
        if (t.isIdentifier(node.callee)) {
          const name = node.callee.name;
          
          // Don't optimize known global constructors/functions
          if (this.isKnownGlobal(name)) {
            return `${name}?.()`;
          }
          
          // Optimize: count?.() → count
          return name;
        }
        
        // Handle optional member expression: props.user?.name()
        if (t.isOptionalMemberExpression(node.callee)) {
          const memberCode = this.codeFromNode(node.callee);
          
          // Don't optimize known non-signals
          if (this.isKnownNonSignal(memberCode)) {
            return `${memberCode}?.()`;
          }
          
          // Optimize: props.user?.name() → props.user?.name
          return memberCode;
        }
        
        // Handle regular member expression with optional call: props.user?.name()
        if (t.isMemberExpression(node.callee) && !node.callee.computed) {
          const memberCode = this.codeFromNode(node.callee);
          
          // Don't optimize known non-signals
          if (this.isKnownNonSignal(memberCode)) {
            return `${memberCode}?.()`;
          }
          
          // Optimize: props.user?.name() → props.user?.name
          return memberCode;
        }
      }
      
      // Default: keep as optional call expression
      const callee = this.codeFromNode(node.callee);
      const args = node.arguments.map((arg: any) => this.codeFromNode(arg)).join(', ');
      return `${callee}?.(${args})`;
    }

    if (t.isMemberExpression(node)) {
      const object = this.codeFromNode(node.object);
      const property = t.isIdentifier(node.property) ? node.property.name : this.codeFromNode(node.property);
      return node.computed ? `${object}[${property}]` : `${object}.${property}`;
    }

    if (t.isOptionalMemberExpression(node)) {
      const object = this.codeFromNode(node.object);
      const property = t.isIdentifier(node.property) ? node.property.name : this.codeFromNode(node.property);
      return node.computed ? `${object}?.[${property}]` : `${object}?.${property}`;
    }

    if (t.isStringLiteral(node)) {
      return `"${node.value}"`;
    }

    if (t.isNumericLiteral(node)) {
      return String(node.value);
    }

    if (t.isBooleanLiteral(node)) {
      return String(node.value);
    }

    if (t.isNullLiteral(node)) {
      return 'null';
    }

    if (t.isConditionalExpression(node)) {
      const test = this.codeFromNode(node.test);
      const consequent = this.codeFromNode(node.consequent);
      const alternate = this.codeFromNode(node.alternate);
      return `${test} ? ${consequent} : ${alternate}`;
    }

    if (t.isBinaryExpression(node)) {
      const left = this.codeFromNode(node.left);
      const right = this.codeFromNode(node.right);
      return `${left} ${node.operator} ${right}`;
    }

    if (t.isArrowFunctionExpression(node)) {
      const params = node.params.map((p) => this.codeFromNode(p)).join(', ');
      const body = t.isBlockStatement(node.body) 
        ? `{ /* complex body */ }` 
        : this.codeFromNode(node.body);
      return `(${params}) => ${body}`;
    }

    if (t.isLogicalExpression(node)) {
      const left = this.codeFromNode(node.left);
      const right = this.codeFromNode(node.right);
      return `${left} ${node.operator} ${right}`;
    }

    if (t.isUnaryExpression(node)) {
      const arg = this.codeFromNode(node.argument);
      return `${node.operator}${arg}`;
    }

    // Array expressions
    if (t.isArrayExpression(node)) {
      const elements = node.elements.map((elem) => {
        if (elem === null) return '';
        if (t.isSpreadElement(elem)) {
          return `...${this.codeFromNode(elem.argument)}`;
        }
        return this.codeFromNode(elem);
      });
      return `[${elements.join(', ')}]`;
    }

    // Object expressions
    if (t.isObjectExpression(node)) {
      const props = node.properties.map((prop) => {
        if (t.isSpreadElement(prop)) {
          return `...${this.codeFromNode(prop.argument)}`;
        }
        if (t.isObjectProperty(prop)) {
          let key: string;
          if (t.isIdentifier(prop.key) && !prop.computed) {
            key = prop.key.name;
          } else if (t.isStringLiteral(prop.key)) {
            key = `"${prop.key.value}"`;
          } else {
            key = `[${this.codeFromNode(prop.key)}]`;
          }
          const value = this.codeFromNode(prop.value);
          return prop.computed ? `[${key}]: ${value}` : `${key}: ${value}`;
        }
        return '/* object method */';
      });
      return `{${props.join(', ')}}`;
    }

    // Template literals
    if (t.isTemplateLiteral(node)) {
      const parts: string[] = [];
      for (let i = 0; i < node.quasis.length; i++) {
        parts.push(node.quasis[i]!.value.raw || '');
        if (i < node.expressions.length) {
          parts.push(`\${${this.codeFromNode(node.expressions[i]!)}}`);
        }
      }
      return `\`${parts.join('')}\``;
    }

    // For JSX elements within expressions
    if (t.isJSXElement(node)) {
      return this.generateElementCode(node);
    }

    // For complex expressions, return a placeholder wrapped in function
    // This ensures it's valid code but indicates it needs better handling
    return '(() => { /* complex expression */ })()';
    } finally {
      this.currentContext = prevContext;
    }
  }

  /**
   * Add runtime imports to the code
   */
  private addRuntimeImports(s: MagicString): void {
    const imports: string[] = [];
    const helpers: string[] = [];
    const usedHelpers = new Set<string>();

    // Check if we have templates (means we need template helper)
    if (this.templates.size > 0) {
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

    // Add import statement first
    if (usedHelpers.size > 0) {
      const helperNames = Array.from(usedHelpers).map(h => {
        return `${h} as _$${h}`;
      }).join(', ');
      imports.push(`import { ${helperNames} } from 'hyperfx/runtime-dom';`);
    }

    // Add template declarations after imports
    for (const [id, html] of this.templates) {
      helpers.push(`const ${id} = _$template(\`${html}\`);`);
    }

    if (imports.length > 0 || helpers.length > 0) {
      const importBlock = [...imports, ...helpers].join('\n') + '\n\n';
      s.prepend(importBlock);
    }
  }
}
