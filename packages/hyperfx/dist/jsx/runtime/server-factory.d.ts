/**
 * Server-side JSX factory for HyperFX
 * Creates virtual nodes instead of real DOM elements
 * Completely avoids the need for happy-dom or any DOM APIs
 */
import { FRAGMENT_TAG } from "./elements";
import type { FunctionComponent, JSXChildren } from "./types";
import type { VirtualNode } from "./virtual-node";
/**
 * Server-side JSX factory function
 * This is called by the TypeScript compiler for every JSX element
 */
export declare function jsx(type: string | FunctionComponent<any> | typeof FRAGMENT_TAG, props: Record<string, any> | null, _key?: string | number | null): VirtualNode;
/**
 * jsxs is used for multiple children in automatic runtime
 * Same implementation as jsx
 */
export declare const jsxs: typeof jsx;
/**
 * Classic JSX Factory (for transform runtime)
 */
export declare function createJSXElement(type: string | FunctionComponent<any> | typeof FRAGMENT_TAG, props: Record<string, any> | null, ...children: JSXChildren[]): VirtualNode;
/**
 * Export createElement as alias for compatibility
 */
export { createJSXElement as createElement };
