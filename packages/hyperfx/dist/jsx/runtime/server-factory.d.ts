import { FRAGMENT_TAG } from "./constants.js";
import type { FunctionComponent, JSXChildren, JSXElement, ComponentProps } from "./types.js";
import { SSRNode } from "../../ssr/render.js";
/**
 * Server-side Fragment component
 */
export declare function Fragment(props: ComponentProps): JSXElement;
export declare function marker(): SSRNode;
/**
 * Server-side JSX factory function
 */
export declare function jsx(type: string | FunctionComponent<Record<string, unknown>> | typeof FRAGMENT_TAG, props: Record<string, unknown> | null, _key?: string | number | null): JSXElement;
export declare const jsxs: typeof jsx;
export declare const jsxDEV: typeof jsx;
export declare function createJSXElement(type: string | FunctionComponent<Record<string, unknown>> | typeof FRAGMENT_TAG, props: Record<string, unknown> | null, ...children: JSXChildren[]): JSXElement;
export { createJSXElement as createElement };
