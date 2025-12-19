import { JSXElement } from "../jsx/jsx-runtime";
import { HydrationData, HydrationMarker } from "./render";
/**
 * Hydration context for managing hydration process
 */
export interface HydrationContext {
    markers: HydrationMarker[];
    elements: Map<number, Element>;
    nodeElements: Map<string, Element>;
    currentIndex: number;
}
/**
 * Create a hydration context from hydration data
 */
export declare function createHydrationContext(hydrationData: HydrationData): HydrationContext;
/**
 * Parse hydration data from the DOM
 */
export declare function parseHydrationData(): HydrationData | null;
/**
 * Find all hydration markers in the DOM
 */
export declare function findHydrationMarkers(): Map<number, Element>;
/**
 * Find all node IDs in the DOM
 */
export declare function findAllNodeIds(): Map<string, Element>;
/**
 * Find element by node ID (primary method for precise location)
 */
export declare function findElementByNodeId(nodeId: string): Element | null;
/**
 * Find element by hydration index (fallback method)
 */
export declare function findElementByHydrationIndex(index: number): Element | null;
/**
 * Hydrate a single element
 */
export declare function hydrateElement(element: Element, marker: HydrationMarker): void;
/**
 * Hydrate the entire application
 */
export declare function hydrate(element: JSXElement): void;
/**
 * Enhanced hydration using node IDs for precise element location
 */
export declare function hydrateWithNodeIds(element: JSXElement): void;
/**
 * Manual hydration for specific elements
 */
export declare function hydrateManual(element: JSXElement, hydrationData: HydrationData): void;
/**
 * Clean up hydration
 */
export declare function cleanupHydration(): void;
/**
 * Check if the page is hydrated
 */
export declare function isHydrated(): boolean;
/**
 * Rehydrate after dynamic content changes
 */
export declare function rehydrate(): void;
