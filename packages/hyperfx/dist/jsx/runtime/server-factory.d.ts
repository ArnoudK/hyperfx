/**
 * Server-side JSX factory for HyperFX
 * Creates virtual nodes that implement DOM-compatible interfaces
 * Completely avoids the need for happy-dom or any DOM APIs
 */
import { FRAGMENT_TAG } from "./constants";
import type { FunctionComponent, JSXChildren, JSXElement } from "./types";
/**
 * Server-side Fragment component
 */
export declare function Fragment(props: {
    children?: JSXChildren;
}): DocumentFragment;
/**
 * Server-side JSX factory function
 * This is called by the TypeScript compiler for every JSX element
 * Returns DOM-compatible virtual nodes
 */
export declare function jsx(type: string | FunctionComponent<any> | typeof FRAGMENT_TAG, props: Record<string, any> | null, _key?: string | number | null): JSXElement;
/**
 * jsxs is used for multiple children in automatic runtime
 * Same implementation as jsx
 */
export declare const jsxs: typeof jsx;
/**
 * Classic JSX Factory (for transform runtime)
 */
export declare function createJSXElement(type: string | FunctionComponent<any> | typeof FRAGMENT_TAG, props: Record<string, any> | null, ...children: JSXChildren[]): JSXElement;
/**
 * Export createElement as alias for compatibility
 */
export { createJSXElement as createElement };
/**
 * Re-export hydration utilities for testing
 */
export { resetClientNodeCounter } from './hydration';
