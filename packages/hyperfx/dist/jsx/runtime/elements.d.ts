import type { Signal } from "../../reactive/signal";
import type { JSXChildren } from "./types";
import { FRAGMENT_TAG } from "./constants";
export { FRAGMENT_TAG };
declare function createTextNode(content: string | number | boolean | Signal<string | number | boolean>): Text;
export declare function Fragment(props: {
    children?: JSXChildren;
}): DocumentFragment;
export { createTextNode };
