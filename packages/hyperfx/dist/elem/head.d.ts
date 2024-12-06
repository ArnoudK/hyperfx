import type { targetValues } from "./attr";
type BaseAttrOpt = {
    href: string;
    target: targetValues;
};
type BaseAttr = Partial<BaseAttrOpt> & (Pick<BaseAttrOpt, "href"> | Pick<BaseAttrOpt, "target">);
/**
 * Must be inside <head>
 * If used there should only be 1 inside the document
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base
 * The <base> HTML element specifies the base URL to use for all relative URLs in a document. There can be only one <base> element in a document.
 *
 *A document's used base URL can be accessed by scripts with Node.baseURI. If the document has no <base> elements, then baseURI defaults to location.href.
 */
export declare function Base(attr: BaseAttr): HTMLBaseElement;
/**
 * Sets or updates the meta description in the head
 */
export declare function MetaDescription(description: string): void;
/**
 * Sets or updates the document title (this is a void function use it above the return in your render)
 */
export declare const Title: (title: string) => string;
export {};
//# sourceMappingURL=head.d.ts.map