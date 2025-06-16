import { VNode } from "../elem/elem";
import { HtmlDocumentOptions } from "./render";
/**
 * SSR context for passing server-side data
 */
export interface SSRContext {
    url: string;
    userAgent?: string;
    isBot?: boolean;
    cookies?: Record<string, string>;
    headers?: Record<string, string>;
    query?: Record<string, string>;
    params?: Record<string, string>;
}
/**
 * SSR page configuration
 */
export interface SSRPageConfig {
    title?: string;
    description?: string;
    keywords?: string[];
    canonical?: string;
    openGraph?: {
        title?: string;
        description?: string;
        image?: string;
        type?: string;
    };
    twitter?: {
        card?: string;
        title?: string;
        description?: string;
        image?: string;
    };
}
/**
 * Enhanced SSR renderer with common patterns
 */
export declare class SSRRenderer {
    private context;
    private config;
    constructor(context: SSRContext, config?: SSRPageConfig);
    /**
     * Render a page with full HTML document
     */
    renderPage(vnode: VNode | VNode[], options?: Partial<HtmlDocumentOptions>): string;
    /**
     * Render with hydration support
     */
    renderWithHydration(vnode: VNode): {
        html: string;
        hydrationScript: string;
        fullDocument?: string;
    };
    /**
     * Generate critical CSS for above-the-fold content
     */
    private generateCriticalCSS;
    /**
     * Add SEO meta tags to HTML
     */
    private addSEOMetaTags;
    /**
     * Check if request is from a bot/crawler
     */
    static isBot(userAgent: string): boolean;
}
/**
 * Static site generation helpers
 */
export declare class StaticGenerator {
    private routes;
    /**
     * Register a route for static generation
     */
    addRoute(path: string, component: () => VNode | Promise<VNode>): void;
    /**
     * Generate static HTML for all routes
     */
    generateAll(outputDir?: string): Promise<Map<string, string>>;
    /**
     * Generate sitemap.xml
     */
    generateSitemap(baseUrl: string): string;
}
/**
 * Component-level SSR utilities
 */
export declare const SSRUtils: {
    /**
     * Create a server-safe component that handles client-only features
     */
    serverSafe<T>(serverComponent: () => VNode, clientComponent: () => T, fallback?: () => VNode): () => VNode | T;
    /**
     * Conditional rendering based on environment
     */
    clientOnly<T>(component: () => T, fallback?: () => VNode): () => VNode | T | null;
    /**
     * Server-only rendering
     */
    serverOnly(component: () => VNode): () => VNode | null;
    /**
     * Create placeholder for client-side hydration
     */
    createHydrationPlaceholder(id: string, tagName?: string): VNode;
};
