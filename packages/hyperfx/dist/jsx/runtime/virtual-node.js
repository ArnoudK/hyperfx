/**
 * Virtual representation of DOM nodes for server-side rendering
 * No actual DOM objects - just data structures that can be converted to HTML strings
 */
/**
 * Create a virtual element node
 */
export function createVirtualElement(tag, props, children) {
    return {
        type: 'element',
        tag,
        props: props || {},
        children
    };
}
/**
 * Create a virtual text node
 */
export function createVirtualText(content) {
    return {
        type: 'text',
        content
    };
}
/**
 * Create a virtual fragment
 */
export function createVirtualFragment(children) {
    return {
        type: 'fragment',
        children
    };
}
/**
 * Create a virtual comment node
 */
export function createVirtualComment(content) {
    return {
        type: 'comment',
        content
    };
}
//# sourceMappingURL=virtual-node.js.map