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
                // If children is not a function, it's already evaluated,
                // so it ran outside this provider's scope!
                // We warn but proceed (context won't work for them).
                console.warn('Context.Provider: children should be a function to receive context value.');
                children = props.children;
            }
        }
        finally {
            // Pop value from stack
            stack.pop();
        }
        // Render logic (handled by JSX runtime, we just return the result)
        // If children returned an element or array, we return it.
        // We wrap in a fragment if needed, or simple return.
        // Provider itself doesn't render a DOM element, just its children.
        // Simplest way to return children without extra wrapper is just returning them.
        // However, JSX expects JSXElement.
        // If multiple children, fragment.
        if (Array.isArray(children)) {
            const fragment = document.createDocumentFragment();
            children.forEach(child => {
                if (child instanceof Node)
                    fragment.appendChild(child);
            });
            return fragment;
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
//# sourceMappingURL=context.js.map