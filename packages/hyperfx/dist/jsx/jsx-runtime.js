import { isSignal, createComputed as signal_createComputed } from "../reactive/signal";
/**
 * Direct DOM JSX Runtime for HyperFX
 */
// Global node counter for generating unique node IDs (client-side)
let clientNodeCounter = 0;
/**
 * Check if we're in an SSR environment
 */
function isSSREnvironment() {
    return typeof window === 'undefined' || typeof document === 'undefined';
}
/**
 * Generate a unique node ID for client-side elements
 */
function createClientId() {
    return String(++clientNodeCounter).padStart(6, '0');
}
// Type guard for reactive signals
function isReactiveSignal(fn) {
    if (typeof fn !== 'function')
        return false;
    // Check for our custom signal implementation
    return typeof fn === 'function' && 'get' in fn && 'set' in fn && 'subscribe' in fn;
}
// Hydration State
let hydrationEnabled = false;
let hydrationMap = null;
/**
 * Start hydration mode with a map of existing nodes
 */
export function startHydration(map) {
    hydrationEnabled = true;
    hydrationMap = map;
    // Reset counter to match server-side generation sequence
    clientNodeCounter = 0;
}
/**
 * End hydration mode
 */
export function endHydration() {
    hydrationEnabled = false;
    hydrationMap = null;
}
// Fragment symbol
export const FRAGMENT_TAG = Symbol("HyperFX.Fragment");
// Create a DOM element with reactive attributes
function createElement(tag, props) {
    let element;
    let claimed = false;
    // Hydration Logic: Try to claim existing node
    if (hydrationEnabled && !isSSREnvironment()) {
        const id = createClientId();
        const existing = hydrationMap?.get(id);
        // Check if existing node matches the requested tag
        if (existing && existing.tagName.toLowerCase() === tag.toLowerCase()) {
            element = existing;
            claimed = true;
        }
        else {
            // Mismatch or not found - create new
            element = document.createElement(tag);
            element.setAttribute('data-hfxh', id);
        }
    }
    else {
        // Normal Creation
        element = document.createElement(tag);
        // Add unique node ID for client-side elements (only if not in SSR)
        if (!isSSREnvironment()) {
            element.setAttribute('data-hfxh', createClientId());
        }
    }
    if (props) {
        for (const [key, value] of Object.entries(props)) {
            if (key === 'children')
                continue; // Handle children separately
            if (key === 'key')
                continue; // Ignore React-style keys
            // Handle special properties like innerHTML and textContent
            if (key === 'innerHTML' || key === 'textContent') {
                const updateProp = () => {
                    const val = isSignal(value) ? value() : value;
                    element[key] = val;
                };
                if (isSignal(value)) {
                    value.subscribe(updateProp);
                }
                updateProp();
            }
            // Handle event handlers
            else if (key.startsWith('on') && typeof value === 'function') {
                const eventName = key.slice(2).toLowerCase();
                element.addEventListener(eventName, value);
            }
            // Handle reactive attributes
            else if (isSignal(value)) {
                // Reactive attribute - subscribe to changes
                const updateAttribute = () => {
                    const currentValue = value();
                    if (currentValue == null) {
                        if (key === 'value' && element instanceof HTMLInputElement) {
                            element.value = '';
                        }
                        else if (key === 'checked' && element instanceof HTMLInputElement) {
                            element.checked = false;
                        }
                        else {
                            element.removeAttribute(key);
                        }
                    }
                    else {
                        if (key === 'value' && element instanceof HTMLInputElement) {
                            element.value = String(currentValue);
                        }
                        else if (key === 'checked' && element instanceof HTMLInputElement) {
                            element.checked = Boolean(currentValue);
                        }
                        else if (key === 'disabled' && typeof currentValue === 'boolean') {
                            // Handle disabled as a boolean attribute
                            if (currentValue) {
                                element.setAttribute('disabled', '');
                                element.disabled = true;
                            }
                            else {
                                element.removeAttribute('disabled');
                                element.disabled = false;
                            }
                        }
                        else if (key === 'class' || key === 'className') {
                            element.className = String(currentValue);
                        }
                        else {
                            element.setAttribute(key, String(currentValue));
                        }
                    }
                };
                updateAttribute(); // Set initial value
                value.subscribe(updateAttribute);
            }
            // Handle regular attributes
            else if (value != null) {
                if (key === 'value' && element instanceof HTMLInputElement) {
                    element.value = String(value);
                }
                else if (key === 'checked' && element instanceof HTMLInputElement) {
                    element.checked = Boolean(value);
                }
                else if (key === 'disabled' && typeof value === 'boolean') {
                    // Handle disabled as a boolean attribute
                    if (value) {
                        element.setAttribute('disabled', '');
                        element.disabled = true;
                    }
                    else {
                        element.removeAttribute('disabled');
                        element.disabled = false;
                    }
                }
                else {
                    element.setAttribute(key, String(value));
                }
            }
        }
    }
    return element;
}
// Create a text node with optional reactive content
function createTextNode(content) {
    const textNode = document.createTextNode('');
    const updateText = () => {
        let text = '';
        if (isSignal(content)) {
            text = String(content());
        }
        else {
            text = String(content);
        }
        textNode.textContent = text;
    };
    updateText(); // Set initial content
    if (isSignal(content)) {
        content.subscribe(updateText);
    }
    return textNode;
}
// Render children to a parent element - implementation using flattening to support hydration cleanup
// Improved renderChildren that handles recursion by flattening
function renderChildrenFlattened(parent, children, appendedSet) {
    const childArray = Array.isArray(children) ? children : [children];
    for (const child of childArray) {
        if (child == null || child === false || child === true)
            continue;
        if (isSignal(child)) {
            const value = child();
            if (value instanceof Node) {
                parent.appendChild(value);
                appendedSet?.add(value);
            }
            else {
                const textNode = createTextNode(child);
                parent.appendChild(textNode);
                appendedSet?.add(textNode);
            }
        }
        else if (typeof child === 'function') {
            try {
                const result = child();
                if (result instanceof Node) {
                    parent.appendChild(result);
                    appendedSet?.add(result);
                }
                else if (Array.isArray(result)) {
                    // Recursion!
                    renderChildrenFlattened(parent, result, appendedSet);
                }
                else {
                    const textNode = document.createTextNode(String(result));
                    parent.appendChild(textNode);
                    appendedSet?.add(textNode);
                }
            }
            catch (error) {
                console.warn('Error rendering function child:', error);
            }
        }
        else if (typeof child === 'object' && child instanceof Node) {
            parent.appendChild(child);
            appendedSet?.add(child);
        }
        else {
            const textNode = document.createTextNode(String(child));
            parent.appendChild(textNode);
            appendedSet?.add(textNode);
        }
    }
}
// Main renderChildren entry point
function renderChildren(parent, children) {
    if (!children)
        return;
    const isHydratingParent = hydrationEnabled &&
        (parent instanceof HTMLElement && parent.isConnected ||
            parent === document.body);
    const appendedNodes = isHydratingParent ? new Set() : undefined;
    const initialChildNodes = isHydratingParent ? Array.from(parent.childNodes) : null;
    // Use flattened renderer
    renderChildrenFlattened(parent, children, appendedNodes);
    // Cleanup
    if (isHydratingParent && initialChildNodes && appendedNodes) {
        for (const node of initialChildNodes) {
            if (!appendedNodes.has(node)) {
                node.remove();
            }
        }
    }
}
// JSX Factory Function - creates actual DOM elements
// JSX Factory Function - creates actual DOM elements
export function jsx(type, props, key) {
    // Handle fragments
    if (type === FRAGMENT_TAG || type === Fragment) {
        const allChildren = props?.children;
        const fragment = document.createDocumentFragment();
        renderChildren(fragment, allChildren);
        return fragment;
    }
    // Handle function components
    if (typeof type === 'function') {
        // Wrap props in a proxy to auto-unwrap signals
        const proxyProps = new Proxy(props || {}, {
            get(target, prop, receiver) {
                const value = Reflect.get(target, prop, receiver);
                if (isSignal(value)) {
                    return value();
                }
                return value;
            }
        });
        return type(proxyProps);
    }
    // Handle regular HTML elements
    const element = createElement(type, props);
    // Handle children
    if (props?.children) {
        renderChildren(element, props.children);
    }
    return element;
}
// jsxs is used for multiple children in automatic runtime, same logic for us
export const jsxs = jsx;
export const jsxDEV = jsx;
// Fragment component
export function Fragment(props) {
    const fragment = document.createDocumentFragment();
    renderChildren(fragment, props.children);
    return fragment;
}
// Classic JSX Factory (for transform runtime)
export function createJSXElement(type, props, ...children) {
    const allProps = { ...props, children: children.length > 0 ? children.flat() : props?.children };
    return jsx(type, allProps);
}
// Template literal helpers for reactive strings
export function template(strings, ...values) {
    return signal_createComputed(() => {
        let result = strings[0] || '';
        for (let i = 0; i < values.length; i++) {
            const value = values[i];
            const resolvedValue = isSignal(value) ? value() : value;
            result += String(resolvedValue) + (strings[i + 1] || '');
        }
        return result;
    });
}
export function r(fn) {
    return signal_createComputed(fn);
}
// Classic JSX Factory (for backwards compatibility)
export { createJSXElement as createElement };
/**
 * Reset client node counter (useful for testing)
 */
export function resetClientNodeCounter() {
    clientNodeCounter = 0;
}
// Export node ID functions for external use
export { createClientId };
//# sourceMappingURL=jsx-runtime.js.map