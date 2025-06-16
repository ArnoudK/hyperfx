import type { AttributesForElement, StrictLinkAttributes } from "./attr";
import { VNode, VNodeChildren } from "./elem";
/**
 * This file is for Elements with phrasing content that should have text as children
 * Phrasing context: https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#phrasing_content
 * But only the ones that are not just semantic divs
 */
export declare function Span(attributes?: AttributesForElement<"span">, childOrText?: string | VNodeChildren): VNode<"span">;
export declare const P: (attributes?: AttributesForElement<"p">, children?: VNodeChildren) => VNode<"p">;
export declare const Abbr: (attributes?: AttributesForElement<"abbr">, children?: VNodeChildren) => VNode<"abbr">;
export declare function A(attributes: StrictLinkAttributes, children?: VNodeChildren): VNode<"a">;
export declare const B: (attributes?: AttributesForElement<"b">, children?: VNodeChildren) => VNode<"b">;
export declare const Bdi: (attributes?: AttributesForElement<"bdi">, children?: VNodeChildren) => VNode<"bdi">;
export declare const Bdo: (attributes?: AttributesForElement<"bdo">, children?: VNodeChildren) => VNode<"bdo">;
export declare const I: (attributes?: AttributesForElement<"i">, children?: VNodeChildren) => VNode<"i">;
export declare const Cite: (attributes?: AttributesForElement<"cite">, children?: VNodeChildren) => VNode<"cite">;
export declare const Code: (attributes?: AttributesForElement<"code">, children?: VNodeChildren) => VNode<"code">;
export declare const Data: (attributes: AttributesForElement<"data"> & {
    value: string;
}, children?: VNodeChildren) => VNode<"data">;
export declare const Dfn: (attributes?: AttributesForElement<"dfn">, children?: VNodeChildren) => VNode<"dfn">;
export declare const Em: (attributes?: AttributesForElement<"em">, children?: VNodeChildren) => VNode<"em">;
export declare const Kbd: (attributes?: AttributesForElement<"kbd">, children?: VNodeChildren) => VNode<"kbd">;
export declare const Mark: (attributes?: AttributesForElement<"mark">, children?: VNodeChildren) => VNode<"mark">;
export declare const Q: (attributes?: AttributesForElement<"q">, children?: VNodeChildren) => VNode<"q">;
export declare const S: (attributes?: AttributesForElement<"s">, children?: VNodeChildren) => VNode<"s">;
export declare const Samp: (attributes?: AttributesForElement<"samp">, children?: VNodeChildren) => VNode<"samp">;
export declare const Small: (attributes?: AttributesForElement<"small">, children?: VNodeChildren) => VNode<"small">;
export declare const Strong: (attributes?: AttributesForElement<"strong">, children?: VNodeChildren) => VNode<"strong">;
export declare const Sub: (attributes?: AttributesForElement<"sub">, children?: VNodeChildren) => VNode<"sub">;
export declare const Sup: (attributes?: AttributesForElement<"sup">, children?: VNodeChildren) => VNode<"sup">;
export declare const Time: (attributes?: AttributesForElement<"time">, children?: VNodeChildren) => VNode<"time">;
export declare const U: (attributes?: AttributesForElement<"u">, children?: VNodeChildren) => VNode<"u">;
export declare const Var: (attributes?: AttributesForElement<"var">, children?: VNodeChildren) => VNode<"var">;
export declare const BlockQuote: (attributes?: AttributesForElement<"blockquote">, children?: VNodeChildren) => VNode<"blockquote">;
export declare const Br: (attributes?: AttributesForElement<"br">) => VNode<"br">;
export declare const Wbr: (attributes?: AttributesForElement<"wbr">) => VNode<"wbr">;
