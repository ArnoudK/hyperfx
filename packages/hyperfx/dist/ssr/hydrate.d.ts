import { JSXElement } from "../jsx/jsx-runtime";
/**
 * Hydrate an application into a container.
 *
 * This executes the component logic (factory) in "Hydration Mode",
 * attempting to claim existing DOM nodes instead of creating new ones.
 *
 * @param container - The DOM element containing the SSR output
 * @param factory - A function that returns the root component (JSXElement)
 */
export declare function hydrate(container: Element, factory: () => JSXElement): void;
/**
 * Check if the page has potential for hydration
 */
export declare function isHydratable(container: Element): boolean;
