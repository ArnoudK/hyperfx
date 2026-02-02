/**
 * Component Call Generator
 * Generates function call code for component elements (uppercase JSX)
 */
import * as t from '@babel/types';
export class ComponentGenerator {
    constructor(generateChildren, codeFromNode) {
        this.generateChildren = generateChildren;
        this.codeFromNode = codeFromNode;
    }
    /**
     * Check if a JSX element is a component (vs HTML element)
     * Components start with uppercase letter
     */
    isComponentElement(node) {
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
    generateComponentCall(node) {
        const componentName = this.getComponentName(node);
        const hasSpread = this.hasSpreadAttributes(node);
        if (hasSpread) {
            return this.generateComponentCallWithSpread(node, componentName);
        }
        return this.generateSimpleComponentCall(node, componentName);
    }
    /**
     * Get the component name from JSX element
     */
    getComponentName(node) {
        if (t.isJSXIdentifier(node.openingElement.name)) {
            return node.openingElement.name.name;
        }
        return this.codeFromNode(node.openingElement.name);
    }
    /**
     * Check if element has spread attributes
     */
    hasSpreadAttributes(node) {
        return node.openingElement.attributes.some(attr => t.isJSXSpreadAttribute(attr));
    }
    /**
     * Generate component call with spread attributes
     */
    generateComponentCallWithSpread(node, componentName) {
        const parts = [];
        for (const attr of node.openingElement.attributes) {
            if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
                const key = attr.name.name;
                const value = this.getAttributeValue(attr);
                parts.push(`{ ${key}: ${value} }`);
            }
            else if (t.isJSXSpreadAttribute(attr)) {
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
        return `${componentName}(${mergedProps})`;
    }
    /**
     * Generate simple component call without spread
     */
    generateSimpleComponentCall(node, componentName) {
        const props = [];
        // Add attributes
        for (const attr of node.openingElement.attributes) {
            if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
                const key = attr.name.name;
                const value = this.getAttributeValue(attr);
                props.push(`${key}: ${value}`);
            }
        }
        // Add children if present
        if (node.children.length > 0) {
            const childrenCode = this.generateChildren(node.children);
            props.push(`children: ${childrenCode}`);
        }
        const propsObj = props.length > 0 ? `{ ${props.join(', ')} }` : '{}';
        return `${componentName}(${propsObj})`;
    }
    /**
     * Get the value code for an attribute
     */
    getAttributeValue(attr) {
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
}
//# sourceMappingURL=component-generator.js.map