/**
 * Template Generator
 * Manages template creation, deduplication, and HTML generation
 */
import * as t from '@babel/types';
// HTML void elements that should not have closing tags
const VOID_ELEMENTS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
]);
// HTML boolean attributes
const BOOLEAN_ATTRIBUTES = new Set([
    'autofocus', 'autoplay', 'async', 'checked', 'controls', 'defer',
    'disabled', 'hidden', 'loop', 'multiple', 'muted', 'open',
    'readonly', 'required', 'reversed', 'selected'
]);
export class TemplateGenerator {
    constructor() {
        this.templateCounter = 0;
        this.templates = new Map();
        this.templatesByHTML = new Map();
    }
    /**
     * Get or create a template (with deduplication)
     */
    getOrCreateTemplate(html) {
        const existing = this.templatesByHTML.get(html);
        if (existing) {
            return existing;
        }
        const templateId = `_tmpl$${this.templateCounter++}`;
        this.templates.set(templateId, html);
        this.templatesByHTML.set(html, templateId);
        return templateId;
    }
    /**
     * Get all templates
     */
    getTemplates() {
        return this.templates;
    }
    /**
     * Reset counter (used for testing and per-file transformations)
     */
    resetCounter() {
        this.templateCounter = 0;
        this.templates.clear();
        this.templatesByHTML.clear();
    }
    /**
     * Generate static HTML template from JSX element
     */
    generateTemplateHTML(node) {
        const tagName = this.getTagName(node.openingElement);
        const attrs = this.getAttributesHTML(node.openingElement.attributes);
        const children = this.getChildrenHTML(node.children);
        if (node.openingElement.selfClosing) {
            return `<${tagName}${attrs} />`;
        }
        return `<${tagName}${attrs}>${children}</${tagName}>`;
    }
    /**
     * Analyze dynamic element and build template with markers
     */
    analyzeDynamicElement(node) {
        const dynamics = [];
        const markerCounter = { value: 0 };
        const templateHTML = this.buildTemplateWithMarkers(node, dynamics, markerCounter, []);
        return { templateHTML, dynamics };
    }
    /**
     * Build template HTML with comment markers for dynamic insertions
     */
    buildTemplateWithMarkers(node, dynamics, markerCounter, currentPath) {
        const tagName = this.getTagName(node.openingElement);
        const { staticAttrs, dynamicAttrs } = this.separateAttributes(node.openingElement.attributes);
        // Add dynamic attributes to dynamics array with current path
        for (const dynAttr of dynamicAttrs) {
            dynamics.push({
                type: 'attribute',
                markerId: -1,
                expression: dynAttr.value,
                path: [...currentPath],
                attributeName: dynAttr.name,
            });
        }
        // Process children
        const childrenHTML = this.buildChildrenWithMarkers(node.children, dynamics, markerCounter, currentPath, tagName);
        if (node.openingElement.selfClosing) {
            return `<${tagName}${staticAttrs} />`;
        }
        return `<${tagName}${staticAttrs}>${childrenHTML}</${tagName}>`;
    }
    /**
     * Build children HTML with markers for dynamic content
     */
    buildChildrenWithMarkers(children, dynamics, markerCounter, parentPath, parentTag) {
        const parts = [];
        let childIndex = 0;
        for (const child of children) {
            if (t.isJSXText(child)) {
                parts.push(child.value);
                continue;
            }
            if (t.isJSXExpressionContainer(child)) {
                if (t.isJSXEmptyExpression(child.expression)) {
                    parts.push('');
                    continue;
                }
                const markerId = markerCounter.value++;
                dynamics.push({
                    type: 'child',
                    markerId,
                    expression: child.expression,
                    path: [...parentPath],
                });
                parts.push(`<!--#${markerId}-->`);
                continue;
            }
            if (t.isJSXElement(child)) {
                if (this.isComponentElement(child)) {
                    const markerId = markerCounter.value++;
                    dynamics.push({
                        type: 'element',
                        markerId,
                        expression: child,
                        path: [...parentPath],
                    });
                    parts.push(`<!--#${markerId}-->`);
                    continue;
                }
                // Build path for this child element
                const childPath = [...parentPath, `${parentTag}[${childIndex}]`];
                parts.push(this.buildTemplateWithMarkers(child, dynamics, markerCounter, childPath));
                childIndex++;
                continue;
            }
            if (t.isJSXFragment(child)) {
                parts.push(this.buildChildrenWithMarkers(child.children, dynamics, markerCounter, parentPath, parentTag));
                continue;
            }
            parts.push('');
        }
        return parts.join('');
    }
    /**
     * Check if a JSX element is a component (vs HTML element)
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
     * Separate static and dynamic attributes
     */
    separateAttributes(attributes) {
        const staticAttrsList = [];
        const dynamicAttrs = [];
        for (const attr of attributes) {
            if (t.isJSXSpreadAttribute(attr)) {
                dynamicAttrs.push({
                    name: '...spread',
                    value: attr.argument,
                });
                continue;
            }
            if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
                const name = attr.name.name;
                // Check if attribute is dynamic
                if (attr.value && t.isJSXExpressionContainer(attr.value)) {
                    dynamicAttrs.push({
                        name,
                        value: attr.value.expression,
                    });
                }
                else {
                    // Static attribute - need to format as "name=value" not just value
                    let attrValue;
                    if (!attr.value) {
                        attrValue = 'true';
                    }
                    else if (t.isStringLiteral(attr.value)) {
                        attrValue = attr.value.value; // Raw string value without quotes
                    }
                    else {
                        // Skip non-static attributes
                        continue;
                    }
                    // Format as HTML attribute
                    if (attrValue === 'true' && this.isBooleanAttribute(name)) {
                        staticAttrsList.push(name);
                    }
                    else {
                        // Escape the value for HTML
                        const escapedValue = attrValue
                            .replace(/&/g, '&amp;')
                            .replace(/"/g, '&quot;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;');
                        staticAttrsList.push(`${name}="${escapedValue}"`);
                    }
                }
            }
        }
        const staticAttrs = staticAttrsList.length > 0
            ? ' ' + staticAttrsList.join(' ')
            : '';
        return { staticAttrs, dynamicAttrs };
    }
    /**
     * Get tag name from JSX opening element
     */
    getTagName(opening) {
        if (t.isJSXIdentifier(opening.name)) {
            return opening.name.name;
        }
        return 'div'; // Fallback
    }
    /**
     * Get static attributes as HTML string
     */
    getAttributesHTML(attributes) {
        const attrs = [];
        for (const attr of attributes) {
            if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
                const attrName = attr.name.name;
                // Get the raw value (not JavaScript code)
                let value;
                if (!attr.value) {
                    value = 'true';
                }
                else if (t.isStringLiteral(attr.value)) {
                    value = attr.value.value; // Raw string value without quotes
                }
                else {
                    // For expressions, skip them (templates only support static values)
                    continue;
                }
                if (value !== null) {
                    // Check if it's a boolean attribute
                    if (value === 'true' && this.isBooleanAttribute(attrName)) {
                        attrs.push(attrName);
                    }
                    else {
                        // Escape the value for HTML
                        const escapedValue = value
                            .replace(/&/g, '&amp;')
                            .replace(/"/g, '&quot;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;');
                        attrs.push(`${attrName}="${escapedValue}"`);
                    }
                }
            }
        }
        return attrs.length > 0 ? ' ' + attrs.join(' ') : '';
    }
    /**
     * Get HTML children string (static only)
     */
    getChildrenHTML(children) {
        const parts = [];
        for (const child of children) {
            if (t.isJSXText(child)) {
                parts.push(child.value);
            }
            else if (t.isJSXElement(child)) {
                parts.push(this.generateTemplateHTML(child));
            }
            else {
                parts.push('');
            }
        }
        return parts.join('');
    }
    /**
     * Check if an attribute is a boolean attribute
     */
    isBooleanAttribute(name) {
        return BOOLEAN_ATTRIBUTES.has(name);
    }
    /**
     * Check if a tag is a void element
     */
    isVoidElement(tag) {
        return VOID_ELEMENTS.has(tag.toLowerCase());
    }
}
//# sourceMappingURL=template-generator.js.map