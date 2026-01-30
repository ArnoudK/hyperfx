import type { Signal } from "../../reactive/signal";
import type { JSXChildren } from "./types";
export declare const FRAGMENT_TAG: unique symbol;
declare function createTextNode(content: string | number | boolean | Signal<string | number | boolean>): Text;
export declare function Fragment(props: {
    children?: JSXChildren;
}): DocumentFragment;
export { createTextNode };
