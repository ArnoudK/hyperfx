import { JSXElement } from "../jsx/jsx-runtime";
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
    renderPage(element: JSXElement | JSXElement[], options?: Partial<HtmlDocumentOptions>): string;
    /**
     * Render with hydration support
     */
    renderWithHydration(element: JSXElement): {
        html: string;
        hydrationScript: string;
        fullDocument?: string;
    };
    /**
     * Render a full HTML document
     */
    private renderDocument;
    /**
     * Generate meta tags for SEO
     */
    private generateMetaTags;
    /**
     * Generate critical CSS for above-the-fold content
     */
    private generateCriticalCSS;
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
    addRoute(path: string, component: () => JSXElement | Promise<JSXElement>): void;
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
    serverSafe<T>(serverComponent: () => JSXElement, clientComponent: () => T, fallback?: () => JSXElement): () => JSXElement | T;
    /**
     * Conditional rendering based on environment
     */
    clientOnly<T>(component: () => T, fallback?: () => JSXElement): () => JSXElement | T | null;
    /**
     * Server-only rendering
     */
    serverOnly(component: () => JSXElement): () => JSXElement | null;
    /**
     * Create placeholder for client-side hydration
     */
    createHydrationPlaceholder(id: string, tagName?: string): JSXElement;
};
