import type { VirtualNode } from "../jsx/runtime/virtual-node";
/**
 * SSR Options for renderToString
 */
export interface SSROptions {
    /**
     * Enable SSR hydration features (signal/resource/context serialization)
     * @default false
     */
    ssrHydration?: boolean;
    /**
     * Initial state to restore before rendering
     * Useful for stateful SSR (e.g., loading from database)
     */
    initialState?: {
        signals?: Record<string, any>;
        resources?: Record<string, any>;
        contexts?: Record<string, any>;
    };
}
/**
 * Hydration data for client-side state restoration
 */
export interface HydrationData {
    state: {
        signals: Record<string, any>;
        resources: Record<string, any>;
        contexts: Record<string, any>;
    };
    version: string;
}
/**
 * Render a virtual node (JSX element) to HTML string for SSR
 * Handles both new VirtualNode format and legacy HTMLElement mocks
 */
export declare function renderToString(element: VirtualNode | any, // Accept any for backward compat with mock elements
options?: SSROptions): {
    html: string;
    hydrationData: HydrationData;
};
/**
 * Render hydration data as inline script that sets window global
 */
export declare function renderHydrationData(hydrationData: HydrationData): string;
/**
 * Full SSR rendering with hydration data included
 */
export declare function renderWithHydration(element: VirtualNode): string;
/**
 * Stream rendering interface for large components
 * Note: Currently simplified for virtual node implementation
 */
export declare function createSSRStream(element: VirtualNode): {
    html: AsyncIterable<string>;
    hydrationData: Promise<HydrationData>;
};
