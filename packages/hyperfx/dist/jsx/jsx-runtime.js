import { isSignal, createComputed as signal_createComputed } from "../reactive/signal";
/**
 * Direct DOM JSX Runtime for HyperFX
 */
// Global node counter for generating unique node IDs (client-side)
let clientNodeCounter = 0;
// Track signal subscriptions for each element for cleanup
const elementSubscriptions = new WeakMap();
// Automatic cleanup using MutationObserver
if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.removedNodes.forEach((node) => {
                if (node instanceof Element && elementSubscriptions.has(node)) {
                    cleanupElementSubscriptions(node);
                }
                // Also check child nodes recursively
                if (node instanceof Element) {
                    node.querySelectorAll('*').forEach((child) => {
                        if (elementSubscriptions.has(child)) {
                            cleanupElementSubscriptions(child);
                        }
                    });
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
// Batch update system for performance optimization
let batchQueue = new Set();
let isBatching = false;
/**
 * Execute multiple updates together to reduce DOM manipulation
 */
export function batchUpdates(fn) {
    const wasBatching = isBatching;
    isBatching = true;
    try {
        const result = fn();
        return result;
    }
    finally {
        if (!wasBatching) {
            // Flush the batch
            isBatching = false;
            flushBatch();
        }
    }
}
/**
 * Add an update function to the batch queue
 */
function addToBatch(updateFn) {
    if (isBatching) {
        batchQueue.add(updateFn);
    }
    else {
        updateFn();
    }
}
/**
 * Execute all queued updates
 */
function flushBatch() {
    const updates = Array.from(batchQueue);
    batchQueue.clear();
    updates.forEach(update => {
        try {
            update();
        }
        catch (error) {
            console.error('Error in batched update:', error);
        }
    });
}
/**
 * Check if we're in an SSR environment
 */
function isSSREnvironment() {
    return typeof window === 'undefined' || typeof document === 'undefined';
}
/**
 * Generate a unique node ID for client-side elements
 */
export function createClientId() {
    return String(++clientNodeCounter).padStart(6, '0');
}
/**
 * Add a subscription to an element's cleanup list
 */
function addElementSubscription(element, unsubscribe) {
    const subscriptions = elementSubscriptions.get(element);
    if (!subscriptions) {
        elementSubscriptions.set(element, new Set([unsubscribe]));
    }
    else {
        subscriptions.add(unsubscribe);
    }
}
/**
 * Clean up all signal subscriptions for an element
 */
export function cleanupElementSubscriptions(element) {
    const subscriptions = elementSubscriptions.get(element);
    if (subscriptions) {
        subscriptions.forEach(unsubscribe => {
            try {
                unsubscribe();
            }
            catch (error) {
                console.error('Error during subscription cleanup:', error);
            }
        });
        subscriptions.clear();
        elementSubscriptions.delete(element);
    }
}
// Simple setAttribute function that handles all attribute types
function setAttribute(element, key, value) {
    // Skip children and key props
    if (key === 'children' || key === 'key') {
        return;
    }
    // Handle event handlers
    if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.slice(2).toLowerCase();
        element.addEventListener(eventName, value);
        return;
    }
    // Handle reactive signals
    if (isSignal(value)) {
        try {
            const update = () => {
                try {
                    setAttribute(element, key, value());
                }
                catch (error) {
                    console.error(`Error updating attribute "${key}":`, error);
                    // Remove attribute on error
                    element.removeAttribute(key);
                }
            };
            const unsubscribe = value.subscribe(() => addToBatch(update));
            addElementSubscription(element, unsubscribe);
            update(); // initial after subscribe succeeds
        }
        catch (error) {
            console.error(`Error subscribing to signal for attribute "${key}":`, error);
            // No attribute set if subscribe fails
        }
        return;
    }
    // Handle reactive functions (create computed for reactivity)
    else if (typeof value === 'function') {
        try {
            const computed = signal_createComputed(value);
            const update = () => {
                try {
                    setAttribute(element, key, computed());
                }
                catch (error) {
                    console.error(`Error updating computed attribute "${key}":`, error);
                    // Remove attribute on error
                    element.removeAttribute(key);
                }
            };
            const unsubscribe = computed.subscribe(() => addToBatch(update));
            addElementSubscription(element, unsubscribe);
            update(); // initial after subscribe
        }
        catch (error) {
            console.error(`Error creating computed for attribute "${key}":`, error);
            // No attribute set if fails
        }
        return;
    }
    // Handle class attribute specially
    if (key === 'class') {
        if (value != null) {
            element.className = String(value);
        }
        else {
            element.removeAttribute('class');
        }
        return;
    }
    // Handle boolean attributes
    const booleanAttrs = new Set([
        'disabled', 'checked', 'readonly', 'readOnly', 'required', 'autofocus', 'autoplay',
        'controls', 'default', 'defer', 'hidden', 'inert', 'loop', 'multiple',
        'muted', 'novalidate', 'open', 'reversed', 'selected'
    ]);
    if (booleanAttrs.has(key)) {
        const boolValue = Boolean(value);
        if (key === 'checked' && element instanceof HTMLInputElement) {
            element.checked = boolValue;
            element.toggleAttribute('checked', boolValue);
        }
        else if ((key === 'readonly' || key === 'readOnly') && element instanceof HTMLInputElement) {
            element.readOnly = boolValue;
            element.toggleAttribute('readonly', boolValue);
        }
        else if (key === 'disabled') {
            element.disabled = boolValue;
            element.toggleAttribute('disabled', boolValue);
        }
        else {
            element.toggleAttribute(key, boolValue);
        }
        return;
    }
    // Handle style attribute
    if (key === 'style') {
        if (value == null) {
            element.removeAttribute('style');
        }
        else if (typeof value === 'string') {
            element.setAttribute('style', value);
        }
        else if (typeof value === 'object') {
            Object.entries(value).forEach(([property, styleValue]) => {
                if (styleValue != null) {
                    try {
                        const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                        element.style[camelCaseProperty] = String(styleValue);
                    }
                    catch (styleError) {
                        console.warn(`Failed to set CSS property "${property}":`, styleError);
                    }
                }
            });
        }
        else {
            element.setAttribute('style', String(value));
        }
        return;
    }
    // Handle input properties
    if (key === 'value' && element instanceof HTMLInputElement) {
        element.value = String(value || '');
        return;
    }
    if (key === 'innerHTML' || key === 'textContent') {
        element[key] = value;
        return;
    }
    // Handle all other attributes
    if (value != null) {
        element.setAttribute(key, String(value));
    }
    else {
        element.removeAttribute(key);
    }
}
function normalizeValue(value) {
    // Handle signals
    if (isSignal(value)) {
        return {
            isReactive: true,
            isFunction: false,
            getValue: () => {
                try {
                    return value();
                }
                catch (error) {
                    console.error('Error accessing signal value:', error);
                    return undefined;
                }
            },
            subscribe: (callback) => {
                try {
                    return value.subscribe(callback);
                }
                catch (error) {
                    console.error('Error subscribing to signal:', error);
                    return () => { };
                }
            }
        };
    }
    // Handle functions (non-signal)
    if (typeof value === 'function') {
        return {
            isReactive: false,
            isFunction: true,
            getValue: () => {
                try {
                    return value();
                }
                catch (error) {
                    console.error('Error executing function value:', error);
                    return undefined;
                }
            },
            subscribe: undefined
        };
    }
    // Handle static values
    return {
        isReactive: false,
        isFunction: false,
        getValue: () => value,
        subscribe: undefined
    };
}
// Global attribute manager instance
const attributeManager = {
    applyAttribute(element, key, value) {
        setAttribute(element, key, value);
    },
    applyAttributes(element, props) {
        for (const [key, value] of Object.entries(props)) {
            this.applyAttribute(element, key, value);
        }
    }
};
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
    // Apply all attributes using the unified attribute manager
    if (props) {
        attributeManager.applyAttributes(element, props);
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
// Fragment component
export function Fragment(props) {
    const fragment = document.createDocumentFragment();
    renderChildren(fragment, props.children);
    return fragment;
}
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
// JSX namespace imported from elements.ts
//# sourceMappingURL=jsx-runtime.js.map