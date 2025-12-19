import { JSXElement } from "../jsx/jsx-runtime";
/**
 * Hydration context for tracking elements with event handlers
 */
export interface HydrationMarker {
    index: number;
    nodeId: string;
    tag: string;
    props: Record<string, unknown>;
    hasReactiveProps: boolean;
    hasEventHandlers: boolean;
}
export interface HydrationData {
    markers: HydrationMarker[];
    version: string;
}
/**
 * Create a new hydration context
 */
export declare function createHydrationContext(): {
    markers: HydrationMarker[];
    currentIndex: number;
};
/**
 * Generate a unique node ID for SSR elements
 */
export declare function createNodeId(): string;
/**
 * Reset global node counter (useful for testing)
 */
export declare function resetNodeCounter(): void;
/**
 * Render a JSX element to HTML string for SSR
 */
export declare function renderToString(element: JSXElement): {
    html: string;
    hydrationData: HydrationData;
};
/**
 * Render hydration data as JSON script tag
 */
export declare function renderHydrationData(hydrationData: HydrationData): string;
/**
 * Full SSR rendering with hydration data included
 */
export declare function renderWithHydration(element: JSXElement): string;
/**
 * Stream rendering interface for large components
 */
export declare function createSSRStream(element: JSXElement): {
    html: AsyncIterable<string>;
    hydrationData: Promise<HydrationData>;
};
