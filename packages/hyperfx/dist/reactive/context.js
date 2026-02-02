import { createVirtualFragment } from "../jsx/runtime/virtual-node";
// Global context stack
// Map of Context ID -> Stack of values
const contextStacks = new Map();
/**
 * Create a Context object
 * @param defaultValue Default value to return if no provider is found
 */
export function createContext(defaultValue) {
    const id = Symbol('Context');
    const Provider = (props) => {
        // Push value to stack
        let stack = contextStacks.get(id);
        if (!stack) {
            stack = [];
            contextStacks.set(id, stack);
        }
        stack.push(props.value);
        // Execute children
        let children;
        try {
            if (typeof props.children === 'function') {
                children = props.children();
            }
            else {
                // If children is not a function, it's already evaluated.
                // This happens during SSR with JSX automatic transform.
                // The children were already executed before this Provider ran,
                // so they couldn't access the context we just pushed.
                // We keep the context on the stack and don't pop it yet.
                children = props.children;
            }
        }
        finally {
            // Only pop if children were a function (executed inside the try block)
            // For SSR pre-executed children, we leave context on stack
            // (it will be cleaned up after SSR rendering completes)
            if (typeof props.children === 'function') {
                stack.pop();
            }
        }
        // Render logic (handled by JSX runtime, we just return the result)
        // If children returned an element or array, we return it.
        // We wrap in a fragment if needed, or simple return.
        // Provider itself doesn't render a DOM element, just its children.
        // Simplest way to return children without extra wrapper is just returning them.
        // However, JSX expects JSXElement.
        // If multiple children, fragment.
        if (Array.isArray(children)) {
            // SSR-safe fragment creation
            if (typeof document === 'undefined') {
                // Server-side: use virtual fragment
                return createVirtualFragment(children);
            }
            else {
                // Client-side: use DOM fragment
                const fragment = document.createDocumentFragment();
                children.forEach(child => {
                    if (child instanceof Node)
                        fragment.appendChild(child);
                });
                return fragment;
            }
        }
        return children;
    };
    return {
        id,
        defaultValue,
        Provider
    };
}
/**
 * Hook to consume context value
 * @param context The context object
 */
export function useContext(context) {
    const stack = contextStacks.get(context.id);
    if (stack && stack.length > 0) {
        return stack[stack.length - 1];
    }
    return context.defaultValue;
}
/**
 * Manually push a context value onto the stack
 * This is useful for SSR where children are pre-evaluated
 * @internal
 */
export function pushContext(context, value) {
    let stack = contextStacks.get(context.id);
    if (!stack) {
        stack = [];
        contextStacks.set(context.id, stack);
    }
    stack.push(value);
}
/**
 * Manually pop a context value from the stack
 * @internal
 */
export function popContext(context) {
    const stack = contextStacks.get(context.id);
    if (stack && stack.length > 0) {
        stack.pop();
    }
}
//# sourceMappingURL=context.js.map