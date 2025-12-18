import { createSignal, createEffect } from "../reactive/state";
let currentRouterContext = null;
export function Router({ children, initialPath }) {
    const currentPath = createSignal(initialPath || window.location.pathname);
    const historyStack = createSignal([currentPath()]);
    const historyIndex = createSignal(0);
    // Handle browser navigation
    const handlePopState = () => {
        const newPath = window.location.pathname || '/';
        currentPath(newPath);
        const stack = historyStack();
        stack[historyIndex()] = newPath;
        historyStack(stack);
    };
    // Set up navigation effects
    createEffect(() => {
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    });
    const navigate = (path, options = {}) => {
        if (options.replace) {
            window.history.replaceState({}, '', path);
            const newStack = [...historyStack()];
            newStack[historyIndex()] = path;
            historyStack(newStack);
        }
        else {
            window.history.pushState({}, '', path);
            const newStack = [...historyStack().slice(0, historyIndex() + 1), path];
            historyStack(newStack);
            historyIndex(historyIndex() + 1);
        }
        currentPath(path);
    };
    const back = () => {
        if (historyIndex() > 0) {
            const newIndex = historyIndex() - 1;
            historyIndex(newIndex);
            const path = historyStack()[newIndex] || '/';
            window.history.back();
            currentPath(path);
        }
    };
    const forward = () => {
        if (historyIndex() < historyStack().length - 1) {
            const newIndex = historyIndex() + 1;
            historyIndex(newIndex);
            const path = historyStack()[newIndex] || '/';
            window.history.forward();
            currentPath(path);
        }
    };
    const context = {
        currentPath,
        navigate,
        back,
        forward,
    };
    // Set global context
    currentRouterContext = context;
    // Create container div
    const container = document.createElement('div');
    container.className = 'router-container';
    // Mount children
    if (Array.isArray(children)) {
        children.forEach((child) => {
            container.appendChild(child);
        });
    }
    else {
        container.appendChild(children);
    }
    return container;
}
export function Route({ path, component, children, exact = false }) {
    if (!currentRouterContext) {
        throw new Error('Route must be used within a Router component');
    }
    const { currentPath } = currentRouterContext;
    // Create placeholder element
    const placeholder = document.createComment(`Route: ${path}`);
    let currentElement = null;
    const updateRoute = () => {
        const currentPathValue = currentPath();
        const matches = exact
            ? currentPathValue === path
            : currentPathValue.startsWith(path);
        if (matches) {
            // Remove previous element if it exists
            if (currentElement && placeholder.parentNode) {
                placeholder.parentNode.removeChild(currentElement);
            }
            // Render new content
            let newElement;
            if (component) {
                newElement = component({});
            }
            else if (typeof children === 'function') {
                const childResult = children();
                newElement = Array.isArray(childResult) ? childResult[0] || document.createComment('Empty route') : childResult;
            }
            else if (children) {
                newElement = children;
            }
            else {
                newElement = document.createComment('Empty route');
            }
            // Insert new element
            if (placeholder.parentNode) {
                placeholder.parentNode.insertBefore(newElement, placeholder);
            }
            currentElement = newElement;
        }
        else {
            // Hide route by removing current element
            if (currentElement && placeholder.parentNode) {
                placeholder.parentNode.removeChild(currentElement);
                currentElement = null;
            }
        }
    };
    createEffect(updateRoute);
    return placeholder;
}
export function Link({ to, children, class: className = '', activeClass: activeClassName = 'active', exact = false, replace = false, onClick }) {
    if (!currentRouterContext) {
        throw new Error('Link must be used within a Router component');
    }
    const { currentPath, navigate } = currentRouterContext;
    const link = document.createElement('a');
    link.href = to;
    link.className = className;
    // Handle clicks
    const handleClick = (event) => {
        event.preventDefault();
        if (onClick) {
            onClick(event);
        }
        navigate(to, { replace });
    };
    link.addEventListener('click', handleClick);
    // Update active class based on current path
    createEffect(() => {
        const currentPathValue = currentPath();
        const isActive = exact
            ? currentPathValue === to
            : currentPathValue.startsWith(to);
        if (isActive) {
            link.classList.add(activeClassName);
        }
        else {
            link.classList.remove(activeClassName);
        }
    });
    // Add children
    if (typeof children === 'string') {
        link.textContent = children;
    }
    else if (Array.isArray(children)) {
        children.forEach((child) => {
            link.appendChild(child);
        });
    }
    else {
        link.appendChild(children);
    }
    return link;
}
/**
 * Navigate Programmatically
 */
export function navigate(path, options = {}) {
    if (currentRouterContext) {
        currentRouterContext.navigate(path, options);
    }
    else {
        // Fallback to direct navigation
        if (options.replace) {
            window.history.replaceState({}, '', path);
        }
        else {
            window.history.pushState({}, '', path);
        }
    }
}
/**
 * Use current path in components
 */
export function usePath() {
    if (!currentRouterContext) {
        throw new Error('usePath must be used within a Router component');
    }
    return currentRouterContext.currentPath;
}
/**
 * Use navigation function in components
 */
export function useNavigate() {
    if (!currentRouterContext) {
        throw new Error('useNavigate must be used within a Router component');
    }
    return currentRouterContext.navigate;
}
export function Outlet({ children }) {
    // For now, just return children or empty div
    if (children) {
        const container = document.createElement('div');
        container.className = 'router-outlet';
        if (Array.isArray(children)) {
            children.forEach((child) => {
                container.appendChild(child);
            });
        }
        else {
            container.appendChild(children);
        }
        return container;
    }
    const outlet = document.createElement('div');
    outlet.className = 'router-outlet';
    outlet.textContent = 'Outlet placeholder';
    return outlet;
}
export function Switch({ children }) {
    const container = document.createElement('div');
    container.className = 'router-switch';
    // For now, just render all children - in a real implementation,
    // this would render only the first matching route
    if (Array.isArray(children)) {
        children.forEach((child) => {
            container.appendChild(child);
        });
    }
    else {
        container.appendChild(children);
    }
    return container;
}
export function Redirect({ to, replace = false }) {
    if (!currentRouterContext) {
        throw new Error('Redirect must be used within a Router component');
    }
    // Perform redirect immediately
    currentRouterContext.navigate(to, { replace });
    // Return empty comment
    return document.createComment('Redirect component');
}
// Legacy exports for compatibility
export { Router as BrowserRouter };
export { Route as RouteComponent };
export { Link as NavLink };
//# sourceMappingURL=router-components.js.map