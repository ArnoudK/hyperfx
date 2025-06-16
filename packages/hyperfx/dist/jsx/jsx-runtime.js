import { FRAGMENT_TAG } from "../elem/elem";
// Normalize props for JSX compatibility
function normalizeProps(props) {
    if (!props)
        return {};
    const normalizedProps = {}; // Use any to avoid index signature issues
    const reactiveProps = {};
    for (const [key, value] of Object.entries(props)) {
        if (key === 'children')
            continue; // Children are handled separately
        // Convert className to class
        if (key === 'className') {
            normalizedProps.class = value;
        }
        // Convert htmlFor to for
        else if (key === 'htmlFor') {
            normalizedProps.for = value;
        }
        // Handle reactive signals and expressions
        else if (typeof value === 'function') {
            // Event handlers start with 'on' - don't call them!
            if (key.startsWith('on')) {
                normalizedProps[key] = value;
            }
            else {
                // Non-event function - check if it's a reactive signal
                try {
                    const testValue = value();
                    // If the function can be called, it might be a reactive signal
                    // Store it as a reactive prop for hydration
                    reactiveProps[key] = value;
                    normalizedProps[key] = testValue; // Use current value for SSR
                }
                catch {
                    // If it throws, treat as a regular function
                    normalizedProps[key] = value;
                }
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
// Normalize children to flatten arrays and handle reactive signals
function normalizeChildren(children) {
    if (!children)
        return [];
    const normalizedChildren = [];
    const flatten = (child) => {
        if (Array.isArray(child)) {
            child.forEach(flatten);
        }
        else if (child != null && child !== false && child !== true && child !== undefined) {
            if (typeof child === 'object' && child.tag) {
                // It's a VNode
                normalizedChildren.push(child);
            }
            else if (typeof child === 'function') {
                // Check if it's a reactive expression
                if (child.__isReactiveExpression) {
                    // It's a reactive expression - create a special container
                    const reactiveContainer = createReactiveExpressionContainer(child);
                    normalizedChildren.push(reactiveContainer);
                }
                else {
                    // Try to evaluate the function to see what it returns
                    try {
                        const result = child();
                        // Check if the original function name suggests it's a reactive signal
                        if (child.name === 'bound signalOper' || child.name === 'bound computedOper' ||
                            child.name === 'signalOper' || child.name === 'computedOper') {
                            // This is a reactive signal - always preserve it as a function
                            normalizedChildren.push(child);
                        }
                        else if (result === false || result === null || result === undefined) {
                            // This might be a reactive conditional - store the function for processing
                            normalizedChildren.push(child);
                        }
                        else if (typeof result === 'object' && result.tag) {
                            // Regular function that returns a VNode
                            flatten(result);
                        }
                        else {
                            // Regular function result
                            flatten(result);
                        }
                    }
                    catch (error) {
                        // If it throws, pass through for later processing
                        normalizedChildren.push(child);
                    }
                }
            }
            else {
                // Convert to string
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
// Create a special reactive container for array expressions
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
// Create a reactive container for reactive expressions
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
// Create a reactive text marker for inline reactive content
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
// Helper to handle reactive conditional rendering (like condition && JSX)
function createReactiveConditional(conditionalExprFn) {
    const containerId = `reactive-conditional-${++reactiveIdCounter}`;
    // Evaluate the expression to get initial content for SSR
    let initialContent = [];
    try {
        const result = conditionalExprFn();
        if (result && typeof result === 'object' && result.tag) {
            // It's a VNode
            initialContent = [result];
        }
        else if (Array.isArray(result)) {
            initialContent = result.filter(item => item && typeof item === 'object' && item.tag);
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
// Process children to detect and handle mixed reactive text
function processReactiveTextFragments(children) {
    const processedChildren = [];
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (!child) {
            continue;
        }
        // Check if this is a function (potential reactive signal)
        if (typeof child === 'function') {
            // Check if it's an alien-signals function by name OR if it might be a reactive function
            const isSignal = child.name === 'bound signalOper' || child.name === 'bound computedOper' || child.name === 'signalOper' || child.name === 'computedOper';
            // Also check if it's a function that might be reactive by trying to call it
            let isReactiveFunction = false;
            if (!isSignal) {
                try {
                    const testValue = child();
                    // If it returns a primitive value, it might be a reactive function
                    isReactiveFunction = typeof testValue === 'string' || typeof testValue === 'number' || typeof testValue === 'boolean';
                }
                catch {
                    // If it throws, it's probably not a reactive content function
                    isReactiveFunction = false;
                }
            }
            if (isSignal || isReactiveFunction) {
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
                // Regular function
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
// JSX Factory Function - used by TypeScript/Babel to transform JSX
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
        // Call the component function with props
        return type(props);
    }
    const normalizedProps = normalizeProps(props);
    const children = normalizeChildren(props?.children);
    // Extract reactive props if they exist
    const reactiveProps = normalizedProps.__reactiveProps;
    delete normalizedProps.__reactiveProps;
    const vnode = {
        tag: type,
        props: normalizedProps,
        children,
        key
    };
    // Add reactive props if they exist
    if (reactiveProps) {
        vnode.reactiveProps = reactiveProps;
    }
    return vnode;
}
// JSX Factory for fragments
export function Fragment(props) {
    return {
        tag: FRAGMENT_TAG,
        props: {},
        children: normalizeChildren(props?.children)
    };
}
// Classic JSX Factory (for backwards compatibility)
export function createElement(type, props, ...children) {
    const allChildren = children.length > 0 ? children : props?.children;
    return jsx(type, { ...props, children: allChildren });
}
// Export for JSX automatic runtime
export const jsxs = jsx;
export const jsxDEV = jsx;
//# sourceMappingURL=jsx-runtime.js.map