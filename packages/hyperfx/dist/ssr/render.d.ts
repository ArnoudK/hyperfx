import { isSSRMode, setSSRMode, clearSSRState, createNodeId } from "../jsx/runtime/hydration";
export { isSSRMode, setSSRMode, clearSSRState, createNodeId };
/**
 * Result of server-side rendering
 * This is just a string wrapper to distinguish HTML from plain text
 */
export interface SSRResult {
    t: string;
    __ssr: true;
}
/**
 * Interface for mock nodes used during SSR
 * Mimics minimal DOM Node interface for control flow
 */
export interface SSRNode extends SSRResult {
    nodeType?: number;
    textContent?: string;
    childNodes?: SSRNode[];
    appendChild?(node: SSRNode): SSRNode;
    removeChild?(node: SSRNode): SSRNode;
    insertBefore?(newNode: SSRNode, referenceNode: SSRNode | null): SSRNode;
    cloneNode?(): SSRNode;
}
/**
 * SSR Options for renderToString
 */
export interface SSROptions {
    ssrHydration?: boolean;
    initialState?: {
        signals?: Record<string, unknown>;
        resources?: Record<string, unknown>;
        contexts?: Record<string, unknown>;
    };
}
/**
 * Hydration data for client-side state restoration
 */
export interface HydrationData {
    state: {
        signals: Record<string, unknown>;
        resources: Record<string, unknown>;
        contexts: Record<string, unknown>;
    };
    version: string;
}
/**
 * Escape HTML special characters
 */
export declare function escapeHtml(text: string): string;
/**
 * Render properties to HTML string
 */
export declare function renderAttributes(props: Record<string, unknown> | null | undefined): string;
/**
 * Main entry point for SSR
 */
export declare function renderToString(element: SSRNode | string | Function | null | undefined, options?: SSROptions): {
    html: string;
    hydrationData: HydrationData;
};
/**
 * Create an SSR result for a tag
 */
export declare function ssrElement(tag: string, props: Record<string, unknown>, children: string): SSRResult;
export declare function renderHydrationData(hydrationData: HydrationData): string;
export declare function renderWithHydration(element: SSRNode | string | null | undefined): string;
