import { VNode } from "../elem/elem";
import { ReactiveSignal } from "../reactive/state";
/**
 * Hydration context for tracking elements with event handlers
 */
/**
 * Hydration context for tracking elements with event handlers during SSR
 */
export interface HydrationMarker {
    index: number;
    tag: string;
    props: Record<string, any>;
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
 * Render a VNode, string, or reactive signal to HTML string
 */
export declare function renderToString(vnode: VNode | string | ReactiveSignal<string>): string;
/**
 * Render multiple VNodes to HTML string
 */
export declare function renderArrayToString(vnodes: (VNode | string | ReactiveSignal<string>)[]): string;
/**
 * Generate a complete HTML document with the rendered VNode
 */
export interface HtmlDocumentOptions {
    title?: string;
    lang?: string;
    charset?: string;
    viewport?: string;
    description?: string;
    stylesheets?: string[];
    scripts?: string[];
    inlineStyles?: string;
    inlineScripts?: string;
    bodyAttributes?: Record<string, string>;
    htmlAttributes?: Record<string, string>;
}
export declare function renderToDocument(vnode: VNode | VNode[], options?: HtmlDocumentOptions): string;
/**
 * Create a streaming HTML renderer (useful for large documents)
 */
export declare class StreamRenderer {
    private chunks;
    write(chunk: string): void;
    renderVNode(vnode: VNode | string | ReactiveSignal<string>): void;
    renderArray(vnodes: (VNode | string | ReactiveSignal<string>)[]): void;
    getResult(): string;
    clear(): void;
}
/**
 * Generate hydration markers for client-side mounting
 * Only tracks elements that actually need hydration (have event handlers or reactive props)
 */
export declare function renderWithHydration(vnode: VNode): {
    html: string;
    hydrationData: HydrationData;
};
