/**
 * Code Generator
 * Converts Babel AST nodes to code strings
 */

import * as t from '@babel/types';
import type { CodeContext } from './types.js';

// Known global functions that shouldn't be optimized
const KNOWN_GLOBALS = new Set([
  'Date', 'Array', 'Object', 'String', 'Number', 'Boolean', 'RegExp',
  'Map', 'Set', 'WeakMap', 'WeakSet', 'Promise', 'Error',
  'parseInt', 'parseFloat', 'isNaN', 'isFinite',
  'encodeURI', 'decodeURI', 'encodeURIComponent', 'decodeURIComponent',
]);

// Known non-signal patterns
const KNOWN_NON_SIGNAL_PATTERNS = [
  'Math.random', 'Math.floor', 'Math.ceil', 'Math.round',
  'console.log', 'console.error', 'console.warn',
  'crypto.randomUUID',
  'performance.now',
  'Date.now',
] as const;

export class CodeGenerator {
  private currentContext: CodeContext = 'static';

  constructor(
    private readonly isSSR: () => boolean,
    private readonly generateElementCode: (node: t.JSXElement) => string,
    private readonly generateSSRJSXCode: (node: t.JSXElement | t.JSXFragment) => string,
    private readonly generateChildrenCode: (children: Array<t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXElement | t.JSXFragment>) => string
  ) {}

  /**
   * Convert a Babel node to code string
   */
  codeFromNode(node: t.Node, context?: CodeContext): string {
    const prevContext = this.currentContext;
    if (context) this.currentContext = context;

    try {
      // Handle JSX nodes when in SSR mode
      if (this.isSSR() && (t.isJSXElement(node) || t.isJSXFragment(node))) {
        return this.generateSSRJSXCode(node);
      }

      // For JSXEmptyExpression, return null
      if (t.isJSXEmptyExpression(node)) {
        return 'null';
      }

      // For simple cases, generate code directly
      if (t.isIdentifier(node)) {
        return node.name;
      }

      if (t.isCallExpression(node)) {
        return this.generateCallExpression(node);
      }

      if (t.isOptionalCallExpression(node)) {
        return this.generateOptionalCallExpression(node);
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
        return this.generateArrowFunction(node);
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

      if (t.isArrayExpression(node)) {
        const elements: string[] = [];
        for (const elem of node.elements) {
          if (elem === null) {
            elements.push('');
          } else if (t.isSpreadElement(elem)) {
            elements.push(`...${this.codeFromNode(elem.argument)}`);
          } else {
            elements.push(this.codeFromNode(elem));
          }
        }
        return `[${elements.join(', ')}]`;
      }

      if (t.isObjectExpression(node)) {
        return this.generateObjectExpression(node);
      }

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

      // For JSX fragments within expressions (client-side)
      if (t.isJSXFragment(node)) {
        const childrenCode = this.generateChildrenCode(node.children);
        // Ensure fragments always return arrays
        return childrenCode.startsWith('[') ? childrenCode : `[${childrenCode}]`;
      }

      // For complex expressions, return a placeholder
      return '(() => { /* complex expression */ })()';
    } finally {
      this.currentContext = prevContext;
    }
  }

  /**
   * Generate arrow function code
   */
  private generateArrowFunction(node: t.ArrowFunctionExpression): string {
    const params: string[] = [];
    for (const p of node.params) {
      params.push(this.codeFromNode(p));
    }
    const paramsStr = params.join(', ');
    
    if (t.isBlockStatement(node.body)) {
      // Generate the full block statement body
      const statements: string[] = [];
      for (const stmt of node.body.body) {
        if (t.isReturnStatement(stmt) && stmt.argument) {
          const returnValue = this.codeFromNode(stmt.argument);
          statements.push(`return ${returnValue};`);
          continue;
        }
        
        if (t.isVariableDeclaration(stmt)) {
          const declarations: string[] = [];
          for (const decl of stmt.declarations) {
            const id = t.isIdentifier(decl.id) ? decl.id.name : this.codeFromNode(decl.id);
            const init = decl.init ? this.codeFromNode(decl.init) : 'undefined';
            declarations.push(`${id} = ${init}`);
          }
          statements.push(`${stmt.kind} ${declarations.join(', ')};`);
          continue;
        }
        
        if (t.isExpressionStatement(stmt)) {
          statements.push(`${this.codeFromNode(stmt.expression)};`);
          continue;
        }
        
        statements.push('/* statement */');
      }
      return `(${paramsStr}) => { ${statements.join(' ')} }`;
    }
    
    const body = this.codeFromNode(node.body);
    return `(${paramsStr}) => ${body}`;
  }

  /**
   * Generate call expression code
   */
  private generateCallExpression(node: t.CallExpression): string {
    // Check if this is a zero-argument call that could be a signal
    if (node.arguments.length === 0 && this.currentContext === 'reactive') {
      if (t.isIdentifier(node.callee)) {
        const name = node.callee.name;
        if (!this.isKnownGlobal(name)) {
          return name; // Optimize: count() → count
        }
      }

      if (t.isMemberExpression(node.callee) && !node.callee.computed) {
        const memberCode = this.codeFromNode(node.callee);
        if (!this.isKnownNonSignal(memberCode)) {
          return memberCode; // Optimize: props.count() → props.count
        }
      }
    }

    const callee = this.codeFromNode(node.callee);
    const args: string[] = [];
    for (const arg of node.arguments) {
      if (t.isSpreadElement(arg)) {
        args.push(`...${this.codeFromNode(arg.argument)}`);
      } else {
        args.push(this.codeFromNode(arg));
      }
    }
    
    return `${callee}(${args.join(', ')})`;
  }

  /**
   * Generate optional call expression code
   */
  private generateOptionalCallExpression(node: t.OptionalCallExpression): string {
    if (node.arguments.length === 0 && this.currentContext === 'reactive') {
      if (t.isIdentifier(node.callee)) {
        const name = node.callee.name;
        if (!this.isKnownGlobal(name)) {
          return name;
        }
      }

      if (t.isOptionalMemberExpression(node.callee) || 
          (t.isMemberExpression(node.callee) && !node.callee.computed)) {
        const memberCode = this.codeFromNode(node.callee);
        if (!this.isKnownNonSignal(memberCode)) {
          return memberCode;
        }
      }
    }

    const callee = this.codeFromNode(node.callee);
    const args: string[] = [];
    for (const arg of node.arguments) {
      if (t.isSpreadElement(arg)) {
        args.push(`...${this.codeFromNode(arg.argument)}`);
      } else {
        args.push(this.codeFromNode(arg));
      }
    }
    
    return `${callee}?.(${args.join(', ')})`;
  }

  /**
   * Generate object expression code
   */
  private generateObjectExpression(node: t.ObjectExpression): string {
    const props: string[] = [];
    for (const prop of node.properties) {
      if (t.isSpreadElement(prop)) {
        props.push(`...${this.codeFromNode(prop.argument)}`);
        continue;
      }

      if (t.isObjectProperty(prop)) {
        const key = t.isIdentifier(prop.key) && !prop.computed
          ? prop.key.name
          : `[${this.codeFromNode(prop.key)}]`;
        const value = this.codeFromNode(prop.value);
        
        const quotedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        
        props.push(prop.shorthand ? key : `${quotedKey}: ${value}`);
        continue;
      }

      if (t.isObjectMethod(prop)) {
        const key = t.isIdentifier(prop.key) ? prop.key.name : this.codeFromNode(prop.key);
        props.push(`${key}() { /* method */ }`);
        continue;
      }

      props.push('');
    }

    return `{ ${props.join(', ')} }`;
  }

  /**
   * Check if an identifier is a known global that shouldn't be optimized
   */
  public isKnownGlobal(name: string): boolean {
    return KNOWN_GLOBALS.has(name);
  }

  /**
   * Check if a member expression is a known non-signal pattern
   */
  public isKnownNonSignal(memberCode: string): boolean {
    for (const pattern of KNOWN_NON_SIGNAL_PATTERNS) {
      if (memberCode.startsWith(pattern)) {
        return true;
      }
    }
    return false;
  }
}
