import { SSRNode } from "./render";
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
 * HTML document options for full page rendering
 */
export interface HtmlDocumentOptions {
    title?: string;
    description?: string;
    lang?: string;
    charset?: string;
    viewport?: string;
    favicon?: string;
    inlineStyles?: string;
    inlineScripts?: string;
    bodyClass?: string;
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
    renderPage(element: SSRNode | string, options?: HtmlDocumentOptions): string;
    /**
     * Render as string
     */
    private renderDocument;
    /**
     * Generate meta tags for SEO
     */
    private generateMetaTags;
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
     * Add a route handler
     */
    addRoute(path: string, component: () => (SSRNode | string) | Promise<SSRNode | string>): void;
    /**
     * Generate static HTML for all routes
     */
    generateAll(_outputDir?: string): Promise<Map<string, string>>;
}
/**
 * Component-level SSR utilities
 */
export declare const SSRUtils: {
    /**
     * Create a server-safe component
     */
    serverSafe<T>(serverComponent: () => (SSRNode | string), clientComponent: () => T, fallback?: () => (SSRNode | string)): () => (SSRNode | string) | T;
    /**
     * Conditional rendering
     */
    clientOnly<T>(component: () => T, fallback?: () => (SSRNode | string)): () => (SSRNode | string) | T | null;
    /**
     * Server-only rendering
     */
    serverOnly(component: () => (SSRNode | string)): () => (SSRNode | string) | null;
};
