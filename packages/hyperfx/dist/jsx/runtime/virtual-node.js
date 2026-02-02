/**
 * Virtual representation of DOM nodes for server-side rendering
 * These implement DOM-like interfaces so they're type-compatible with real DOM nodes
 * No actual DOM objects - just data structures that can be converted to HTML strings
 */
// Internal marker to identify virtual nodes
const VIRTUAL_NODE_MARKER = Symbol.for('hyperfx.virtual');
/**
 * Type guard to check if a node is a virtual node (only works at runtime on server)
 */
export function isVirtualNode(node) {
    return node && typeof node === 'object' && VIRTUAL_NODE_MARKER in node;
}
/**
 * Helper to get mutable children array from a virtual parent node
 * @internal
 */
export function getMutableChildren(node) {
    return node.childNodes;
}
/**
 * Create a virtual element node
 */
export function createVirtualElement(tag, props, children) {
    const tagUpper = tag.toUpperCase();
    const element = {
        [VIRTUAL_NODE_MARKER]: true,
        nodeType: 1,
        nodeName: tagUpper,
        tagName: tagUpper,
        childNodes: children,
        _props: props || {},
        get textContent() {
            return this.childNodes.map(child => {
                if (!child)
                    return '';
                if ('textContent' in child)
                    return child.textContent || '';
                return '';
            }).join('');
        },
        set textContent(_value) {
            // Readonly for virtual nodes
        }
    };
    return element;
}
/**
 * Create a virtual text node
 */
export function createVirtualText(content) {
    return {
        [VIRTUAL_NODE_MARKER]: true,
        nodeType: 3,
        nodeName: '#text',
        textContent: content,
        data: content
    };
}
/**
 * Create a virtual fragment
 */
export function createVirtualFragment(children) {
    const fragment = {
        [VIRTUAL_NODE_MARKER]: true,
        nodeType: 11,
        nodeName: '#document-fragment',
        childNodes: children,
        get textContent() {
            return this.childNodes.map(child => {
                if (!child)
                    return '';
                if ('textContent' in child)
                    return child.textContent || '';
                return '';
            }).join('');
        },
        set textContent(_value) {
            // Readonly for virtual nodes
        }
    };
    return fragment;
}
/**
 * Create a virtual comment node
 */
export function createVirtualComment(content) {
    return {
        [VIRTUAL_NODE_MARKER]: true,
        nodeType: 8,
        nodeName: '#comment',
        textContent: content,
        data: content
    };
}
//# sourceMappingURL=virtual-node.js.map