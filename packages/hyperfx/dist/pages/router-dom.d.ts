import type { ComponentProps } from "../jsx/jsx-runtime";
import type { Component } from "../reactive/component-dom";
import { navigateTo } from "./navigate";
/**
 * Direct DOM Routing System for HyperFX
 *
 * This routing system works with actual DOM elements instead of VNodes,
 * providing client-side routing with direct DOM manipulation.
 */
type RouteParam = {
    name: string;
    position: number;
    value?: string;
};
type RouteConfig = {
    path: string;
    component: Component;
    params: RouteParam[];
    pattern: RegExp;
};
/**
 * Direct DOM Router
 */
export declare class DirectDOMRouter {
    private container;
    private routes;
    private currentRoute;
    private currentPage;
    private currentPath;
    constructor(container: HTMLElement);
    /**
     * Register a new route
     */
    registerRoute(path: string, component: Component, defaultProps?: ComponentProps): this;
    /**
     * Enable the router and handle initial route
     */
    enable(): this;
    /**
     * Navigate to a specific route programmatically
     */
    navigate(path: string, data?: Record<string, unknown>): void;
    /**
     * Get current route parameter value
     */
    getParam(name: string): string | undefined;
    /**
     * Get query parameter value
     */
    getQueryParam(name: string): string | null;
    /**
     * Get all query parameter values for a name
     */
    getQueryParams(name: string): string[];
    private getAllQueryParams;
    /**
     * Get current route path
     */
    getCurrentPath(): string;
    /**
     * Get all registered routes
     */
    getRoutes(): RouteConfig[];
    private createRoutePattern;
    private extractRouteParams;
    private handleRouteChange;
    private getCurrentCleanPath;
    private findMatchingRoute;
    private mountRoute;
    private unmountCurrentPage;
    private handleNotFound;
    private generatePageTitle;
    destroy(): void;
}
/**
 * Create a new router instance
 */
export declare function createRouter(container: HTMLElement): DirectDOMRouter;
/**
 * Route registration helper (backward compatibility)
 */
export declare function RouteRegister(container: HTMLElement): DirectDOMRouter;
/**
 * Get current router instance
 */
export declare function getCurrentRouter(): DirectDOMRouter | undefined;
/**
 * Get route parameter from current route
 */
export declare function getParam(name: string): string | undefined;
/**
 * Get query parameter from current URL
 */
export declare function getQueryValue(name: string): string | null;
/**
 * Get all query parameter values for a name
 */
export declare function getQueryValues(name: string): string[];
export { navigateTo };
declare global {
    interface Window {
        __$HFX_Router?: DirectDOMRouter;
    }
}
