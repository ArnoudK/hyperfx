/**
 * SSR Code Generator
 * Generates _$jsx() runtime calls for server-side rendering
 */

import * as t from '@babel/types';

export class SSRGenerator {
  constructor(
    private readonly codeFromNode: (node: t.Node) => string
  ) {}

  /**
   * Generate SSR JSX code for elements and fragments
   */
  generateSSRJSXCode(node: t.JSXElement | t.JSXFragment | t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild): string {
    if (t.isJSXFragment(node)) {
      const childrenCode = this.generateChildrenArray(node.children);
      return `_$jsx(_$Fragment, { children: ${childrenCode} })`;
    }

    if (t.isJSXElement(node)) {
      const tagName = this.getTagNameOrExpr(node.openingElement);
      const propsObj = this.generatePropsObject(node.openingElement.attributes, node.children);
      return `_$jsx(${tagName}, ${propsObj})`;
    }

    if (t.isJSXText(node)) {
      const text = node.value.trim();
      if (!text) return '""';
      // Properly escape all special characters in text content
      const escaped = text
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
      return `"${escaped}"`;
    }

    if (t.isJSXExpressionContainer(node)) {
      if (t.isJSXEmptyExpression(node.expression)) {
        return 'null';
      }
      return this.codeFromNode(node.expression);
    }

    return 'null';
  }

  /**
   * Get tag name or expression for JSX element
   */
  public getTagNameOrExpr(opening: t.JSXOpeningElement): string {
    if (t.isJSXIdentifier(opening.name)) {
      const name = opening.name.name;
      // Lowercase = HTML tag string, Uppercase = Component identifier
      if (/^[a-z]/.test(name)) {
        return `"${name}"`;
      }
      return name;
    }

    // Member expressions (Foo.Bar) or namespaced names
    if (t.isJSXMemberExpression(opening.name)) {
      return this.getJSXMemberExpression(opening.name);
    }

    return '"div"'; // Fallback
  }

  /**
   * Convert JSX member expression to code
   */
  private getJSXMemberExpression(node: t.JSXMemberExpression): string {
    const object = t.isJSXIdentifier(node.object)
      ? node.object.name
      : this.getJSXMemberExpression(node.object as t.JSXMemberExpression);
    const property = node.property.name;
    return `${object}.${property}`;
  }

  /**
   * Generate props object for SSR
   */
  public generatePropsObject(
    attributes: Array<t.JSXAttribute | t.JSXSpreadAttribute>,
    children: Array<t.JSXElement | t.JSXFragment | t.JSXExpressionContainer | t.JSXText | t.JSXSpreadChild>
  ): string {
    const props: string[] = [];

    // Add attributes
    for (const attr of attributes) {
      if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
        const key = attr.name.name;
        const value = this.getAttributeValue(attr);
        // Quote keys that contain hyphens or other special characters
        const quotedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        props.push(`${quotedKey}: ${value}`);
      } else if (t.isJSXSpreadAttribute(attr)) {
        // Handle spread: {...props}
        const spreadCode = this.codeFromNode(attr.argument);
        return `{...${spreadCode}}`;
      }
    }

    // Add children if present
    if (children.length > 0) {
      const childrenCode = this.generateChildrenArray(children);
      props.push(`children: ${childrenCode}`);
    }

    return props.length > 0 ? `{ ${props.join(', ')} }` : '{}';
  }

  /**
   * Generate children array code
   */
  public generateChildrenArray(children: Array<t.JSXElement | t.JSXFragment | t.JSXExpressionContainer | t.JSXText | t.JSXSpreadChild>): string {
    if (children.length === 0) return '[]';

    const childCodes: string[] = [];
    for (const child of children) {
      const code = this.generateSSRJSXCode(child as t.JSXElement | t.JSXFragment | t.JSXText | t.JSXExpressionContainer);
      if (code !== '""' && code !== 'null') {
        childCodes.push(code);
      }
    }

    if (childCodes.length === 0) return '[]';
    if (childCodes.length === 1) return childCodes[0]!;
    return `[${childCodes.join(', ')}]`;
  }

  /**
   * Get attribute value code
   */
  private getAttributeValue(attr: t.JSXAttribute): string {
    if (!attr.value) {
      return 'true';
    }

    if (t.isJSXExpressionContainer(attr.value)) {
      if (t.isJSXEmptyExpression(attr.value.expression)) {
        return 'true';
      }
      return this.codeFromNode(attr.value.expression);
    }

    if (t.isStringLiteral(attr.value)) {
      // Properly escape the string value
      const escaped = attr.value.value
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
      return `"${escaped}"`;
    }

    if (t.isJSXElement(attr.value)) {
      return this.generateSSRJSXCode(attr.value);
    }

    if (t.isJSXFragment(attr.value)) {
      return this.generateSSRJSXCode(attr.value);
    }

    return 'undefined';
  }
}
