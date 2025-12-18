import { navigateTo } from "./navigate";
/**
 * Direct DOM Router
 */
export class DirectDOMRouter {
    constructor(container) {
        this.routes = [];
        this.currentPath = '';
        this.container = container;
    }
    /**
     * Register a new route
     */
    registerRoute(path, component, defaultProps) {
        const pattern = this.createRoutePattern(path);
        const params = this.extractRouteParams(path);
        const route = {
            path,
            component,
            params,
            pattern,
        };
        // Check for duplicate routes
        if (this.routes.some(r => r.pattern.source === route.pattern.source)) {
            throw new Error(`Route already exists: '${path}'`);
        }
        this.routes.push(route);
        return this;
    }
    /**
     * Enable the router and handle initial route
     */
    enable() {
        window.addEventListener('popstate', this.handleRouteChange.bind(this));
        window.addEventListener('hashchange', this.handleRouteChange.bind(this));
        // Store router reference globally for navigation
        window.__$HFX_Router = this;
        // Handle initial route
        this.handleRouteChange();
        return this;
    }
    /**
     * Navigate to a specific route programmatically
     */
    navigate(path, data) {
        const url = new URL(path, window.location.origin);
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                url.searchParams.set(key, String(value));
            });
        }
        window.history.pushState({}, '', url.toString());
        this.handleRouteChange();
    }
    /**
     * Get current route parameter value
     */
    getParam(name) {
        return this.currentRoute?.params.find(p => p.name === name)?.value;
    }
    /**
     * Get query parameter value
     */
    getQueryParam(name) {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get(name);
    }
    /**
     * Get all query parameter values for a name
     */
    getQueryParams(name) {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.getAll(name);
    }
    getAllQueryParams() {
        const searchParams = new URLSearchParams(window.location.search);
        const params = {};
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        return params;
    }
    /**
     * Get current route path
     */
    getCurrentPath() {
        return this.currentPath;
    }
    /**
     * Get all registered routes
     */
    getRoutes() {
        return [...this.routes];
    }
    createRoutePattern(path) {
        if (path === '/' || path === '') {
            return /^\/?$/;
        }
        let pattern = '^';
        const segments = path.split('/');
        for (const segment of segments) {
            if (!segment)
                continue;
            pattern += '\\/';
            if (segment.startsWith('[') && segment.endsWith(']')) {
                // Parameter segment
                const paramName = segment.slice(1, -1);
                pattern += '([A-Za-z0-9_-]+)';
            }
            else {
                // Static segment
                pattern += segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }
        }
        pattern += '\\/?$';
        return new RegExp(pattern);
    }
    extractRouteParams(path) {
        const params = [];
        const segments = path.split('/');
        segments.forEach((segment, index) => {
            if (segment.startsWith('[') && segment.endsWith(']')) {
                const paramName = segment.slice(1, -1);
                params.push({
                    name: paramName,
                    position: index,
                });
            }
        });
        return params;
    }
    handleRouteChange() {
        const currentPath = this.getCurrentCleanPath();
        if (currentPath === this.currentPath) {
            return; // No change needed
        }
        this.currentPath = currentPath;
        this.unmountCurrentPage();
        const matchedRoute = this.findMatchingRoute(currentPath);
        if (matchedRoute) {
            this.mountRoute(matchedRoute, currentPath);
        }
        else {
            this.handleNotFound(currentPath);
        }
    }
    getCurrentCleanPath() {
        let path = window.location.pathname;
        // Remove trailing slash (except for root)
        if (path.length > 1 && path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        return path;
    }
    findMatchingRoute(path) {
        return this.routes.find(route => {
            const match = path.match(route.pattern);
            return match && match[0].length >= path.length;
        });
    }
    mountRoute(route, path) {
        if (!this.container) {
            console.error('Router container is null, cannot mount route');
            return;
        }
        this.currentRoute = route;
        // Extract parameter values
        const routeParamArray = this.extractRouteParams(path);
        const queryParams = this.getAllQueryParams();
        // Convert route params to record for component props
        const routeParamRecord = {};
        routeParamArray.forEach(param => {
            if (param.value) {
                routeParamRecord[param.name] = param.value;
            }
        });
        // Create props for the component
        const props = {
            ...routeParamRecord,
            ...queryParams,
            router: this,
        };
        // Render and mount the component
        const element = route.component(props);
        // Clear container and mount new element
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        this.container.appendChild(element);
        // Update page title
        const title = this.generatePageTitle(route, routeParamRecord);
        if (title) {
            document.title = title;
        }
    }
    unmountCurrentPage() {
        if (this.currentPage && this.currentPage.mounted) {
            // Trigger cleanup if component has lifecycle
            if (this.currentPage.element && this.currentPage.element.parentNode) {
                this.currentPage.element.parentNode.removeChild(this.currentPage.element);
            }
            this.currentPage.mounted = false;
        }
        this.currentRoute = undefined;
        this.currentPage = undefined;
    }
    handleNotFound(path) {
        // Check if already on 404 page to prevent loops
        if (path.startsWith('/404') || path === '404') {
            return;
        }
        // Navigate to 404 page with original path as query param
        this.navigate('/404', { page: path });
    }
    generatePageTitle(route, params) {
        // Basic title generation - can be enhanced
        const routeName = route.path.replace(/^\//, '').replace(/\//g, ' > ');
        const paramValues = Object.values(params).filter(Boolean).join(' ');
        if (paramValues) {
            return `${routeName} - ${paramValues} | HyperFX`;
        }
        return `${routeName} | HyperFX`;
    }
    // Cleanup method
    destroy() {
        this.unmountCurrentPage();
        window.removeEventListener('popstate', this.handleRouteChange.bind(this));
        window.removeEventListener('hashchange', this.handleRouteChange.bind(this));
        window.__$HFX_Router = undefined;
    }
}
/**
 * Create a new router instance
 */
export function createRouter(container) {
    return new DirectDOMRouter(container);
}
/**
 * Route registration helper (backward compatibility)
 */
export function RouteRegister(container) {
    return new DirectDOMRouter(container);
}
/**
 * Get current router instance
 */
export function getCurrentRouter() {
    return window.__$HFX_Router;
}
/**
 * Get route parameter from current route
 */
export function getParam(name) {
    const router = getCurrentRouter();
    return router?.getParam(name);
}
/**
 * Get query parameter from current URL
 */
export function getQueryValue(name) {
    const router = getCurrentRouter();
    return router?.getQueryParam(name) || null;
}
/**
 * Get all query parameter values for a name
 */
export function getQueryValues(name) {
    const router = getCurrentRouter();
    return router?.getQueryParams(name) || [];
}
// Legacy exports for backward compatibility
export { navigateTo };
//# sourceMappingURL=router-dom.js.map