import type { AttributesForElement } from "./attr";
import { VNode, VNodeChildren } from "./elem";
export declare const Address: (attributes?: AttributesForElement<"address">, children?: VNodeChildren) => VNode<"address">;
export declare const Nav: (attributes?: AttributesForElement<"nav">, children?: VNodeChildren) => VNode<"nav">;
export declare const Pre: (attributes?: AttributesForElement<"pre">, children?: VNodeChildren) => VNode<"pre">;
/**
 * Output element with required attributes
 * The 'for' attribute is required for proper form association
 */
export declare const Output: (attributes: AttributesForElement<"output"> & {
    for: string;
    name: string;
}, children?: VNodeChildren) => VNode<"output">;
/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article */
export declare const Article: (attributes?: AttributesForElement<"article">, children?: VNodeChildren) => VNode<"article">;
/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside */
export declare const Aside: (attributes?: AttributesForElement<"aside">, children?: VNodeChildren) => VNode<"aside">;
export declare const Main: (attributes?: AttributesForElement<"main">, children?: VNodeChildren) => VNode<"main">;
export declare const Footer: (attributes?: AttributesForElement<"footer">, children?: VNodeChildren) => VNode<"footer">;
export declare const Header: (attributes?: AttributesForElement<"header">, children?: VNodeChildren) => VNode<"header">;
export declare const Section: (attributes?: AttributesForElement<"section">, children?: VNodeChildren) => VNode<"section">;
export declare const Figure: (attributes?: AttributesForElement<"figure">, children?: VNodeChildren) => VNode<"figure">;
export declare const Figcaption: (attributes?: AttributesForElement<"figcaption">, children?: VNodeChildren) => VNode<"figcaption">;
