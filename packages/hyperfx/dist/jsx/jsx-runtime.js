import { FRAGMENT_TAG } from "../elem/elem";
import { createComputed } from "../reactive/state";
// Type guards for reactive signals
function isReactiveSignal(fn) {
    if (typeof fn !== 'function')
        return false;
    // Check for alien-signals function names (these are the most reliable)
    const signalNames = ['bound signalOper', 'bound computedOper', 'signalOper', 'computedOper'];
    if (signalNames.includes(fn.name)) {
        return true;
    }
    // Try to call the function to see if it's reactive
    try {
        const result = fn();
        // If it returns a primitive value, it's likely reactive
        const isPrimitive = typeof result === 'string' || typeof result === 'number' || typeof result === 'boolean';
        if (isPrimitive) {
            // Additional check: see if the function string contains signal calls
            const fnString = fn.toString();
            // Look for common reactive patterns:
            const hasReactivePattern = /\w+\(\)/.test(fnString) || // function calls ending with ()
                /signal|computed|createSignal|createComputed/.test(fnString) || // signal creation
                /\$\{[^}]*\(\)[^}]*\}/.test(fnString) || // template literal patterns with ${...()}
                /\$\{[^}]*signal|computed[^}]*\}/.test(fnString) || // template literals with signal/computed
                /`[^`]*\$\{[^}]*\}[^`]*`/.test(fnString); // template literal detection
            return hasReactivePattern;
        }
        return false;
    }
    catch {
        // If calling the function throws, but it looks like it might be reactive, 
        // check if it has reactive patterns in its string representation
        try {
            const fnString = fn.toString();
            return /signal|computed|createSignal|createComputed|\$\{[^}]*\(\)/.test(fnString);
        }
        catch {
            return false;
        }
    }
}
function isComputedSignal(fn) {
    if (typeof fn !== 'function')
        return false;
    return fn.name.includes('computedOper') || fn.name.includes('bound computedOper');
}
// Normalize props for JSX compatibility with better type safety
function normalizeProps(props) {
    if (!props)
        return {};
    const normalizedProps = {};
    const reactiveProps = {};
    for (const [key, value] of Object.entries(props)) {
        if (key === 'children')
            continue; // Children are handled separately
        if (key === 'key') {
            // Extract key for special handling - it shouldn't be in props
            normalizedProps.__key = value;
            continue;
        }
        // Convert className to class
        if (key === 'className') {
            if (isReactiveSignal(value)) {
                reactiveProps.class = value;
                normalizedProps.class = value(); // Use current value for SSR
            }
            else {
                normalizedProps.class = value;
            }
        }
        // Convert htmlFor to for
        else if (key === 'htmlFor') {
            if (isReactiveSignal(value)) {
                reactiveProps.for = value;
                normalizedProps.for = value(); // Use current value for SSR
            }
            else {
                normalizedProps.for = value;
            }
        }
        // Handle reactive signals and expressions
        else if (typeof value === 'function') {
            // Event handlers start with 'on' - don't call them!
            if (key.startsWith('on') && typeof value === 'function') {
                normalizedProps[key] = value;
            }
            else if (isReactiveSignal(value)) {
                // Reactive signal - extract for special handling
                reactiveProps[key] = value;
                normalizedProps[key] = value(); // Use current value for SSR
            }
            else {
                // Regular function - keep as is
                normalizedProps[key] = value;
                console.log('🔍 Regular function prop:', key, 'name:', value.name);
            }
        }
        else {
            normalizedProps[key] = value;
        }
    }
    // If we have reactive props, add them to the VNode
    if (Object.keys(reactiveProps).length > 0) {
        normalizedProps.__reactiveProps = reactiveProps;
    }
    return normalizedProps;
}
// Normalize children to flatten arrays and handle reactive signals with better type safety
function normalizeChildren(children) {
    if (!children)
        return [];
    const normalizedChildren = [];
    const flatten = (child) => {
        if (Array.isArray(child)) {
            child.forEach(flatten);
        }
        else if (child != null && child !== false && child !== true && child !== undefined) {
            if (typeof child === 'object' && 'tag' in child) {
                // It's a VNode
                normalizedChildren.push(child);
            }
            else if (typeof child === 'function') {
                if (isReactiveSignal(child)) {
                    // This is a reactive signal - preserve it as a function
                    // The signal could return string, number, boolean, VNode, or VNode[]
                    normalizedChildren.push(child);
                }
                else {
                    // Try to evaluate the function to see what it returns
                    try {
                        const result = child();
                        flatten(result);
                    }
                    catch (error) {
                        // If it throws, convert to string for safety
                        normalizedChildren.push(String(child));
                    }
                }
            }
            else {
                // Convert to string (handles numbers, booleans, etc.)
                normalizedChildren.push(String(child));
            }
        }
    };
    if (Array.isArray(children)) {
        children.forEach(flatten);
    }
    else {
        flatten(children);
    }
    // Process reactive text fragments to handle mixed content properly
    return processReactiveTextFragments(normalizedChildren);
}
// Create a special reactive container for array expressions with better types
function createReactiveArrayContainer(reactiveArrayFn) {
    const containerId = `reactive-array-${++reactiveIdCounter}`;
    return {
        tag: 'div',
        props: {
            'data-reactive-array': 'true',
            'data-reactive-id': containerId,
            style: 'display: contents;' // Don't affect layout
        },
        children: [],
        // Store the reactive function for hydration
        __reactiveArrayFn: reactiveArrayFn,
    };
}
// Create a reactive container for reactive expressions with better types
function createReactiveExpressionContainer(reactiveExprFn) {
    const containerId = `reactive-expr-${++reactiveIdCounter}`;
    // Evaluate the expression to get initial content
    let initialContent = [];
    try {
        const result = reactiveExprFn();
        if (Array.isArray(result)) {
            initialContent = result;
        }
        else {
            initialContent = [String(result)];
        }
    }
    catch (error) {
        console.warn('Failed to evaluate reactive expression:', error);
        initialContent = [];
    }
    return {
        tag: 'div',
        props: {
            'data-reactive-expr': 'true',
            'data-reactive-id': containerId,
            style: 'display: contents;' // Don't affect layout
        },
        children: initialContent,
        // Store the reactive function for hydration
        __reactiveExprFn: reactiveExprFn,
    };
}
// Global counter for deterministic IDs
let reactiveIdCounter = 0;
// Create a reactive text marker for inline reactive content with better types
function createReactiveTextMarker(reactiveExprFn) {
    const markerId = `reactive-text-${++reactiveIdCounter}`;
    // Evaluate the expression to get initial content for SSR
    let initialContent = '';
    try {
        const result = reactiveExprFn();
        initialContent = String(result);
    }
    catch (error) {
        console.warn('Failed to evaluate reactive expression:', error);
        initialContent = '';
    }
    return {
        tag: 'span',
        props: {
            'data-reactive-text': 'true',
            'data-reactive-id': markerId,
            style: 'display: contents;' // Don't affect layout
        },
        children: [initialContent],
        // Store the reactive function for hydration
        __reactiveTextFn: reactiveExprFn,
    };
}
// Helper to handle reactive conditional rendering (like condition && JSX) with better types
function createReactiveConditional(conditionalExprFn) {
    const containerId = `reactive-conditional-${++reactiveIdCounter}`;
    // Evaluate the expression to get initial content for SSR
    let initialContent = [];
    try {
        const result = conditionalExprFn();
        if (result && typeof result === 'object' && 'tag' in result) {
            // It's a VNode
            initialContent = [result];
        }
        else if (Array.isArray(result)) {
            initialContent = result.filter(item => item && typeof item === 'object' && 'tag' in item);
        }
        // If result is false/null/undefined, initialContent stays empty
    }
    catch (error) {
        console.warn('Failed to evaluate reactive conditional:', error);
        initialContent = [];
    }
    return {
        tag: 'div',
        props: {
            'data-reactive-conditional': 'true',
            'data-reactive-id': containerId,
            style: 'display: contents;' // Don't affect layout
        },
        children: initialContent,
        // Store the reactive function for hydration
        __reactiveConditionalFn: conditionalExprFn,
    };
}
// Process children to detect and handle mixed reactive text with better types
function processReactiveTextFragments(children) {
    const processedChildren = [];
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (!child) {
            continue;
        }
        // Check if this is a function (potential reactive signal)
        if (typeof child === 'function') {
            if (isReactiveSignal(child)) {
                // Check if this is in a mixed text context by looking at siblings
                const hasStringSiblings = children.some((sibling, index) => index !== i && typeof sibling === 'string' && sibling.trim().length > 0);
                if (hasStringSiblings) {
                    // This is mixed text context - create reactive text marker
                    processedChildren.push(createReactiveTextMarker(child));
                }
                else {
                    // This is standalone reactive content - pass through as-is for normal processing
                    processedChildren.push(child);
                }
            }
            else {
                // Regular function - this shouldn't happen in normalized children
                processedChildren.push(child);
            }
        }
        else {
            // Regular child (string or VNode)
            processedChildren.push(child);
        }
    }
    return processedChildren;
}
// Template literal helpers for reactive strings
/**
 * Creates a reactive template literal that automatically updates when any signals change
 * Usage:
 * @example template`Clear all ${cartItemCount()} items from cart`
 */
export function template(strings, ...values) {
    return createComputed(() => {
        let result = strings[0] || '';
        for (let i = 0; i < values.length; i++) {
            const value = values[i];
            // If the value is a reactive signal, call it to get the current value
            const resolvedValue = typeof value === 'function' && isReactiveSignal(value) ? value() : value;
            result += String(resolvedValue) + (strings[i + 1] || '');
        }
        return result;
    });
}
/**
 * Alternative syntax for reactive template literals using a function wrapper
 * Usage: r(() => `Clear all ${cartItemCount()} items from cart`)
 */
export function r(fn) {
    return createComputed(fn);
}
export function jsx(type, props, key) {
    // Handle fragments
    if (type === FRAGMENT_TAG || type === Fragment) {
        return {
            tag: FRAGMENT_TAG,
            props: {},
            children: normalizeChildren(props?.children),
            key
        };
    }
    // Handle function components
    if (typeof type === 'function') {
        // Extract key from props if it exists
        const { key: propsKey, ...componentProps } = props || {};
        const resultVNode = type(componentProps);
        // Apply key to the result if provided
        if (key !== undefined || propsKey !== undefined) {
            resultVNode.key = key ?? propsKey;
        }
        return resultVNode;
    }
    const normalizedProps = normalizeProps(props);
    const children = normalizeChildren(props?.children);
    // Extract key and reactive props if they exist
    const extractedKey = normalizedProps.__key;
    const reactiveProps = normalizedProps.__reactiveProps;
    delete normalizedProps.__key;
    delete normalizedProps.__reactiveProps;
    const vnode = {
        tag: type,
        props: normalizedProps,
        children,
        key: key ?? extractedKey // Use explicit key parameter or extracted key from props
    };
    // Add reactive props if they exist
    if (reactiveProps) {
        vnode.reactiveProps = reactiveProps;
    }
    return vnode;
}
// JSX Factory for fragments with better types
export function Fragment(props) {
    return {
        tag: FRAGMENT_TAG,
        props: {},
        children: normalizeChildren(props?.children)
    };
}
// Classic JSX Factory (for backwards compatibility) with looser typing for dynamic usage
export function createElement(type, props, ...children) {
    const allChildren = children.length > 0 ? children : props?.children;
    // Use a type assertion since createElement is more dynamic than jsx
    return jsx(type, { ...props, children: allChildren });
}
// Export for JSX automatic runtime
export const jsxs = jsx;
export const jsxDEV = jsx;
//# sourceMappingURL=jsx-runtime.js.map