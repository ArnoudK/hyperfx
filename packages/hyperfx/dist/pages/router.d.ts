import { VNode } from "../elem/elem";
export interface Route {
    path: string;
    component: () => VNode;
    title?: string;
}
export interface RouterOptions {
    baseUrl?: string;
    mode?: 'history' | 'hash';
    container?: HTMLElement;
}
/**
 * Client-side router for handling navigation
 */
export declare class Router {
    private routes;
    private currentRoute;
    private container;
    private baseUrl;
    private mode;
    private isInitialized;
    constructor(options?: RouterOptions);
    /**
     * Register a route
     */
    addRoute(path: string, component: () => VNode, title?: string): void;
    /**
     * Initialize the router
     */
    init(): void;
    /**
     * Navigate to a route
     */
    navigate(path: string, pushState?: boolean): Promise<void>;
    /**
     * Get current path from URL
     */
    private getCurrentPath;
    /**
     * Get current route
     */
    getCurrentRoute(): string;
}
/**
 * Get or create global router instance
 */
export declare function getRouter(options?: RouterOptions): Router;
/**
 * RouterLink Props interface for JSX
 */
export interface RouterLinkProps {
    href: string;
    className?: string;
    class?: string;
    id?: string;
    title?: string;
    target?: string;
    children?: any;
    [key: string]: any;
}
/**
 * Link component for client-side navigation (Function Component style)
 */
export declare function RouterLink(props: RouterLinkProps): VNode;
/**
 * Legacy Link component for VNode-style usage (backwards compatibility)
 */
export declare function RouterLinkVNode(props: {
    href: string;
    class?: string;
    id?: string;
    title?: string;
    target?: string;
}, children: (VNode | string)[]): VNode;
/**
 * Programmatic navigation helper
 */
export declare function navigate(path: string): void;
/**
 * Setup router with routes - convenience function
 */
export declare function setupRouter(routes: Route[], options?: RouterOptions): Router;
