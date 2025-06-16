/**
 * Type guard to check if a value is a VNode
 */
export function isVNode(value) {
    return typeof value === 'object' &&
        value !== null &&
        'tag' in value &&
        'props' in value &&
        'children' in value;
}
/**
 * Type guard to check if a value is valid JSX children
 */
export function isValidJSXChild(value) {
    if (value === null ||
        value === undefined ||
        typeof value === 'boolean') {
        return true;
    }
    if (typeof value === 'string' ||
        typeof value === 'number') {
        return true;
    }
    if (isVNode(value)) {
        return true;
    }
    if (typeof value === 'function') {
        // Assume it's a reactive signal
        return true;
    }
    if (Array.isArray(value)) {
        return value.every(isValidJSXChild);
    }
    return false;
}
/**
 * Check if children contain any reactive signals
 */
export function hasReactiveChildren(children) {
    if (!children)
        return false;
    if (Array.isArray(children)) {
        return children.some(child => typeof child === 'function' || hasReactiveChildren(child));
    }
    return typeof children === 'function';
}
/**
 * Utility to create a strongly typed component
 */
export function defineComponent(component) {
    return component;
}
//# sourceMappingURL=types.js.map