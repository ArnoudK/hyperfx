import { isSignal, createComputed as signal_createComputed } from "../reactive/signal";
// Type guard for reactive signals
function isReactiveSignal(fn) {
    if (typeof fn !== 'function')
        return false;
    // Check for our custom signal implementation
    return typeof fn === 'function' && 'get' in fn && 'set' in fn && 'subscribe' in fn;
}
// Fragment symbol
export const FRAGMENT_TAG = Symbol("HyperFX.Fragment");
// Create a DOM element with reactive attributes
function createElement(tag, props) {
    const element = document.createElement(tag);
    if (props) {
        for (const [key, value] of Object.entries(props)) {
            if (key === 'children')
                continue; // Handle children separately
            if (key === 'key')
                continue; // Ignore React-style keys
            // Handle event handlers
            if (key.startsWith('on') && typeof value === 'function') {
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
// Render children to a parent element
function renderChildren(parent, children) {
    if (!children)
        return;
    const childArray = Array.isArray(children) ? children : [children];
    for (const child of childArray) {
        if (child == null || child === false || child === true)
            continue;
        if (isSignal(child)) {
            // Reactive child - handle based on current value type
            const value = child();
            if (value instanceof Node) {
                // Signal contains a DOM element - append it
                parent.appendChild(value);
                // Note: Full reactive replacement would require tracking the inserted node
            }
            else {
                // Signal contains text/array - use existing reactive text handling
                const textNode = createTextNode(child);
                parent.appendChild(textNode);
            }
        }
        else if (typeof child === 'function') {
            // Function component or computed child
            try {
                const result = child();
                if (result instanceof Node) {
                    parent.appendChild(result);
                }
                else if (Array.isArray(result)) {
                    renderChildren(parent, result);
                }
                else {
                    // Convert to text node
                    const textNode = document.createTextNode(String(result));
                    parent.appendChild(textNode);
                }
            }
            catch (error) {
                console.warn('Error rendering function child:', error);
            }
        }
        else if (typeof child === 'object' && child instanceof Node) {
            // Already a DOM node
            parent.appendChild(child);
        }
        else {
            // Convert to text node
            const textNode = document.createTextNode(String(child));
            parent.appendChild(textNode);
        }
    }
}
// JSX Factory Function - creates actual DOM elements
export function jsx(type, props, ...children) {
    // Handle fragments
    if (type === FRAGMENT_TAG) {
        const fragment = document.createDocumentFragment();
        const allChildren = children.length > 0 ? children.flat() : props?.children;
        renderChildren(fragment, allChildren);
        return fragment;
    }
    // Handle function components
    if (typeof type === 'function') {
        // Use props.children if available, otherwise use additional children args
        const componentChildren = props?.children ?? (children.length > 0 ? children.flat() : undefined);
        const componentProps = { ...props, children: componentChildren };
        return type(componentProps);
    }
    // Handle regular HTML elements
    const element = createElement(type, props);
    // Handle children
    const allChildren = children.length > 0 ? children.flat() : props?.children;
    renderChildren(element, allChildren);
    return element;
}
// Fragment component
export function Fragment(props) {
    const fragment = document.createDocumentFragment();
    renderChildren(fragment, props.children);
    return fragment;
}
// Classic JSX Factory (for backwards compatibility)
export function createJSXElement(type, props, ...children) {
    return jsx(type, props, ...children);
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
// Export for JSX automatic runtime
export const jsxs = jsx;
export const jsxDEV = jsx;
//# sourceMappingURL=jsx-runtime.js.map