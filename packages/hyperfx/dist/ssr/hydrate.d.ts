import { JSXElement } from "../jsx/jsx-runtime";
import type { HydrationData } from "./render";
/**
 * Read hydration data from the window global
 */
export declare function readHydrationData(): HydrationData | null;
/**
 * Hydrate an application into a container using structural matching.
 *
 * This approach:
 * 1. Executes the component factory to build a fresh client DOM tree
 * 2. Validates the client tree matches the server tree structurally
 * 3. Replaces server DOM with client DOM (which has event handlers attached)
 * 4. Restores signal state from hydration data
 *
 * On mismatch: Falls back to full client-side render
 *
 * @param container - The DOM element containing the SSR output
 * @param factory - A function that returns the root component (JSXElement)
 */
export declare function hydrate(container: Element, factory: () => JSXElement): void;
/**
 * Check if the page has potential for hydration
 */
export declare function isHydratable(container: Element): boolean;
