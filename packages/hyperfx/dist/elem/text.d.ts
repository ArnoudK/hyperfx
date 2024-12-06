import type { GlobalAttr, targetValues } from "./attr";
import { type HtmlElement_Or_Text_Children_Or_Undefined, type TextChildren_Or_Undefined } from "./elem";
/**
    * this file is for Elements with phrasing content that should have text as children
    * Phrasing context:  https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#phrasing_content
    But only the ones that are not just semantic divs
    */
export declare function Span(attributes: GlobalAttr, childOrText: string | HtmlElement_Or_Text_Children_Or_Undefined): HTMLSpanElement;
export declare const P: (attributes: GlobalAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLParagraphElement;
export declare const Abbr: (attributes: GlobalAttr, children?: readonly Text[]) => HTMLElement;
type anchorAttr = Partial<GlobalAttr> & {
    href: string;
    target?: targetValues;
    download?: "download";
    filename?: string;
    hreflang?: string;
    ping?: string;
    referrerpolicy?: "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
    rel?: string;
};
export declare function A(attributes: anchorAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined): HTMLAnchorElement;
export declare const B: (attributes: GlobalAttr, children?: TextChildren_Or_Undefined) => HTMLElement;
export declare const Bdi: (attributes: GlobalAttr, children?: TextChildren_Or_Undefined) => HTMLElement;
export declare const Bdo: (attributes: GlobalAttr, children?: TextChildren_Or_Undefined) => HTMLElement;
export declare const I: (attributes: GlobalAttr, children?: TextChildren_Or_Undefined) => HTMLElement;
export declare const Cite: (attributes: GlobalAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLElement;
export declare const Code: (attributes: GlobalAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLElement;
export declare const BlockQuote: (attributes: GlobalAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLQuoteElement;
export {};
//# sourceMappingURL=text.d.ts.map