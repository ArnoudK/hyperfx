import type { JSXElement, ComponentProps } from "../jsx/jsx-runtime";
import type { Component } from "../reactive/component-dom";
import { navigateTo } from "./navigate";

/**
 * Direct DOM Routing System for HyperFX
 * 
 * This routing system works with actual DOM elements instead of VNodes,
 * providing client-side routing with direct DOM manipulation.
 */

// Route parameter type
type RouteParam = {
  name: string;
  position: number;
  value?: string;
};

// Route configuration type
type RouteConfig = {
  path: string;
  component: Component;
  params: RouteParam[];
  pattern: RegExp;
};

// Page wrapper for lifecycle management
interface PageWrapper<T extends ComponentProps = ComponentProps> {
  component: Component<T>;
  props?: T;
  element?: JSXElement;
  mounted: boolean;
}

/**
 * Direct DOM Router
 */
export class DirectDOMRouter {
  private container: HTMLElement;
  private routes: RouteConfig[] = [];
  private currentRoute: RouteConfig | undefined;
  private currentPage: PageWrapper | undefined;
  private currentPath: string = '';

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /**
   * Register a new route
   */
  registerRoute(
    path: string,
    component: Component,
    defaultProps?: ComponentProps
  ): this {
    const pattern = this.createRoutePattern(path);
    const params = this.extractRouteParams(path);

    const route: RouteConfig = {
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
  enable(): this {
    window.addEventListener('popstate', this.handleRouteChange.bind(this));
    window.addEventListener('hashchange', this.handleRouteChange.bind(this));

    // Store router reference globally for navigation
    (window as any).__$HFX_Router = this;

    // Handle initial route
    this.handleRouteChange();

    return this;
  }

  /**
   * Navigate to a specific route programmatically
   */
  navigate(path: string, data?: Record<string, unknown>): void {
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
  getParam(name: string): string | undefined {
    return this.currentRoute?.params.find(p => p.name === name)?.value;
  }

  /**
   * Get query parameter value
   */
  getQueryParam(name: string): string | null {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name);
  }

  /**
   * Get all query parameter values for a name
   */
  getQueryParams(name: string): string[] {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.getAll(name);
  }

  private getAllQueryParams(): Record<string, string> {
    const searchParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    return params;
  }

  /**
   * Get current route path
   */
  getCurrentPath(): string {
    return this.currentPath;
  }

  /**
   * Get all registered routes
   */
  getRoutes(): RouteConfig[] {
    return [...this.routes];
  }

  private createRoutePattern(path: string): RegExp {
    if (path === '/' || path === '') {
      return /^\/?$/;
    }

    let pattern = '^';
    const segments = path.split('/');

    for (const segment of segments) {
      if (!segment) continue;
      
      pattern += '\\/';
      
      if (segment.startsWith('[') && segment.endsWith(']')) {
        // Parameter segment
        const paramName = segment.slice(1, -1);
        pattern += '([A-Za-z0-9_-]+)';
      } else {
        // Static segment
        pattern += segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
    }

    pattern += '\\/?$';
    return new RegExp(pattern);
  }

  private extractRouteParams(path: string): RouteParam[] {
    const params: RouteParam[] = [];
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

  private handleRouteChange(): void {
    const currentPath = this.getCurrentCleanPath();
    
    if (currentPath === this.currentPath) {
      return; // No change needed
    }

    this.currentPath = currentPath;
    this.unmountCurrentPage();

    const matchedRoute = this.findMatchingRoute(currentPath);
    
    if (matchedRoute) {
      this.mountRoute(matchedRoute, currentPath);
    } else {
      this.handleNotFound(currentPath);
    }
  }

  private getCurrentCleanPath(): string {
    let path = window.location.pathname;
    
    // Remove trailing slash (except for root)
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    
    return path;
  }

  private findMatchingRoute(path: string): RouteConfig | undefined {
    return this.routes.find(route => {
      const match = path.match(route.pattern);
      return match && match[0].length >= path.length;
    });
  }

  private mountRoute(route: RouteConfig, path: string): void {
    if (!this.container) {
      console.error('Router container is null, cannot mount route');
      return;
    }

    this.currentRoute = route;

    // Extract parameter values
    const routeParamArray = this.extractRouteParams(path);
    const queryParams = this.getAllQueryParams();

    // Convert route params to record for component props
    const routeParamRecord: Record<string, string> = {};
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
    } as ComponentProps;

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

  private unmountCurrentPage(): void {
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

  private handleNotFound(path: string): void {
    // Check if already on 404 page to prevent loops
    if (path.startsWith('/404') || path === '404') {
      return;
    }
    
    // Navigate to 404 page with original path as query param
    this.navigate('/404', { page: path });
  }

  private generatePageTitle(route: RouteConfig, params: Record<string, string>): string {
    // Basic title generation - can be enhanced
    const routeName = route.path.replace(/^\//, '').replace(/\//g, ' > ');
    const paramValues = Object.values(params).filter(Boolean).join(' ');
    
    if (paramValues) {
      return `${routeName} - ${paramValues} | HyperFX`;
    }
    
    return `${routeName} | HyperFX`;
  }

  // Cleanup method
  destroy(): void {
    this.unmountCurrentPage();
    window.removeEventListener('popstate', this.handleRouteChange.bind(this));
    window.removeEventListener('hashchange', this.handleRouteChange.bind(this));
    (window as any).__$HFX_Router = undefined;
  }
}

/**
 * Create a new router instance
 */
export function createRouter(container: HTMLElement): DirectDOMRouter {
  return new DirectDOMRouter(container);
}

/**
 * Route registration helper (backward compatibility)
 */
export function RouteRegister(container: HTMLElement): DirectDOMRouter {
  return new DirectDOMRouter(container);
}

/**
 * Get current router instance
 */
export function getCurrentRouter(): DirectDOMRouter | undefined {
  return (window as any).__$HFX_Router;
}

/**
 * Get route parameter from current route
 */
export function getParam(name: string): string | undefined {
  const router = getCurrentRouter();
  return router?.getParam(name);
}

/**
 * Get query parameter from current URL
 */
export function getQueryValue(name: string): string | null {
  const router = getCurrentRouter();
  return router?.getQueryParam(name) || null;
}

/**
 * Get all query parameter values for a name
 */
export function getQueryValues(name: string): string[] {
  const router = getCurrentRouter();
  return router?.getQueryParams(name) || [];
}

// Legacy exports for backward compatibility
export { navigateTo };

// Type declarations for global router
declare global {
  interface Window {
    __$HFX_Router?: DirectDOMRouter;
  }
}