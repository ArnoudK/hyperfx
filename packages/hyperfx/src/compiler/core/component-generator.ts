/**
 * Component Call Generator
 * Generates function call code for component elements (uppercase JSX)
 */

import * as t from '@babel/types';
import type { CodeContext } from './types.js';

export class ComponentGenerator {
  constructor(
    private readonly generateChildren: (children: Array<t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXElement | t.JSXFragment>) => string,
    private readonly codeFromNode: (node: t.Node, context?: CodeContext) => string
  ) {}

  /**
   * Check if a JSX element is a component (vs HTML element)
   * Components start with uppercase letter
   */
  isComponentElement(node: t.JSXElement): boolean {
    if (t.isJSXIdentifier(node.openingElement.name)) {
      const tagName = node.openingElement.name.name;
      return /^[A-Z]/.test(tagName);
    }
    // Member expressions (e.g., Foo.Bar) and namespaced names are also components
    return true;
  }

  /**
   * Generate code for a component call (not a template)
   */
  generateComponentCall(node: t.JSXElement): string {
    const componentName = this.getComponentName(node);
    const isShow = this.isShowComponent(node);
    const hasSpread = this.hasSpreadAttributes(node);

    if (hasSpread) {
      return this.generateComponentCallWithSpread(node, componentName, isShow);
    }

    return this.generateSimpleComponentCall(node, componentName, isShow);
  }

  /**
   * Get the component name from JSX element
   */
  private getComponentName(node: t.JSXElement): string {
    if (t.isJSXIdentifier(node.openingElement.name)) {
      return node.openingElement.name.name;
    }
    return this.codeFromNode(node.openingElement.name);
  }

  /**
   * Check if element has spread attributes
   */
  private hasSpreadAttributes(node: t.JSXElement): boolean {
    return node.openingElement.attributes.some(attr => t.isJSXSpreadAttribute(attr));
  }

  /**
   * Generate component call with spread attributes
   */
  private generateComponentCallWithSpread(
    node: t.JSXElement,
    componentName: string,
    isShow: boolean
  ): string {
    const parts: string[] = [];

    for (const attr of node.openingElement.attributes) {
      if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
        const key = attr.name.name;
        const value = isShow && key === 'when'
          ? this.getShowWhenValue(attr)
          : this.getAttributeValue(attr);
        parts.push(`{ ${key}: ${value} }`);
      } else if (t.isJSXSpreadAttribute(attr)) {
        parts.push(this.codeFromNode(attr.argument));
      }
    }

    // Add children if present
    if (node.children.length > 0) {
      const childrenCode = this.generateChildren(node.children);
      parts.push(`{ children: ${childrenCode} }`);
    }

    const mergedProps = parts.length > 1
      ? `Object.assign({}, ${parts.join(', ')})`
      : parts[0] || '{}';

    return `_$unwrapComponent(${componentName}(_$unwrapProps(${mergedProps})))`;
  }

  /**
   * Generate simple component call without spread
   */
  private generateSimpleComponentCall(
    node: t.JSXElement,
    componentName: string,
    isShow: boolean
  ): string {
    const props: string[] = [];

    // Add attributes
    for (const attr of node.openingElement.attributes) {
      if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
        const key = attr.name.name;
        const value = isShow && key === 'when'
          ? this.getShowWhenValue(attr)
          : this.getAttributeValue(attr);
        props.push(`${key}: ${value}`);
      }
    }

    // Add children if present
    if (node.children.length > 0) {
      const childrenCode = this.generateChildren(node.children);
      props.push(`children: ${childrenCode}`);
    }

    const propsObj = props.length > 0 ? `{ ${props.join(', ')} }` : '{}';
    return `_$unwrapComponent(${componentName}(_$unwrapProps(${propsObj})))`;
  }

  /**
   * Get the value code for an attribute
   */
  public getAttributeValue(attr: t.JSXAttribute): string {
    if (!attr.value) {
      return 'true';
    }

    if (t.isJSXExpressionContainer(attr.value)) {
      return this.codeFromNode(attr.value.expression);
    }

    if (t.isStringLiteral(attr.value)) {
      return `"${attr.value.value}"`;
    }

    return this.codeFromNode(attr.value);
  }

  private isShowComponent(node: t.JSXElement): boolean {
    if (t.isJSXIdentifier(node.openingElement.name)) {
      return node.openingElement.name.name === 'Show';
    }

    if (t.isJSXMemberExpression(node.openingElement.name)) {
      return node.openingElement.name.property.name === 'Show';
    }

    return false;
  }

  private getShowWhenValue(attr: t.JSXAttribute): string {
    if (!attr.value) {
      return 'true';
    }

    if (t.isJSXExpressionContainer(attr.value)) {
      const expr = attr.value.expression;
      if (t.isJSXEmptyExpression(expr)) {
        return 'undefined';
      }

      if (
        t.isArrowFunctionExpression(expr) ||
        t.isFunctionExpression(expr) ||
        t.isIdentifier(expr) ||
        t.isMemberExpression(expr) ||
        t.isOptionalMemberExpression(expr)
      ) {
        return this.codeFromNode(expr);
      }

      return `() => (${this.codeFromNode(expr)})`;
    }

    if (t.isStringLiteral(attr.value)) {
      return `"${attr.value.value}"`;
    }

    return this.codeFromNode(attr.value);
  }
}
