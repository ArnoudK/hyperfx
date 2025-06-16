import type { TargetValues } from "./attr";
import { VNode } from "./elem";
/**
 * Base element attributes with strict typing
 */
type BaseAttrOpt = {
    href: string;
    target: TargetValues;
};
type BaseAttr = Partial<BaseAttrOpt> & (Pick<BaseAttrOpt, "href"> | Pick<BaseAttrOpt, "target">);
/**
 * Must be inside <head>
 * If used there should only be 1 inside the document
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base
 * The <base> HTML element specifies the base URL to use for all relative URLs in a document. There can be only one <base> element in a document.
 *
 * A document's used base URL can be accessed by scripts with Node.baseURI. If the document has no <base> elements, then baseURI defaults to location.href.
 */
export declare function Base(attr: BaseAttr): VNode<"base">;
/**
 * Meta element with strict typing for name and content
 */
type MetaAttributes = {
    name?: string;
    content?: string;
    charset?: string;
    'http-equiv'?: "content-security-policy" | "content-type" | "default-style" | "x-ua-compatible" | "refresh";
    property?: string;
};
export declare function Meta(attributes: MetaAttributes): VNode<"meta">;
/**
 * Sets or updates the meta description in the head
 * TODO: This function needs to be re-evaluated for VDOM.
 * For now, it will return a VNode, and direct DOM manipulation is removed.
 */
export declare function MetaDescription(description: string): VNode<"meta">;
/**
 * Sets or updates the document title.
 * WARNING: This is direct DOM manipulation and is NOT VDOM-compatible in its current form.
 * This approach bypasses the HyperFX VDOM rendering lifecycle.
 * A proper VDOM solution would involve a side-effect mechanism or a special VNode type
 * handled by the root rendering process to update document.title.
 * Leaving as is for now, but this needs to be addressed for full VDOM integration.
 */
export declare const Title: (title: string) => string;
/**
 * Link element for stylesheets, icons, etc.
 */
type LinkAttributes = {
    rel: "stylesheet" | "icon" | "shortcut icon" | "apple-touch-icon" | "manifest" | "preload" | "prefetch" | "dns-prefetch" | "preconnect" | string;
    href: string;
    type?: string;
    media?: string;
    sizes?: string;
    as?: "script" | "style" | "image" | "font" | "fetch" | "document";
    crossorigin?: "anonymous" | "use-credentials";
    integrity?: string;
};
export declare function Link(attributes: LinkAttributes): VNode<"link">;
/**
 * Script element with type safety
 */
type ScriptAttributes = {
    src?: string;
    type?: "text/javascript" | "module" | "application/json" | string;
    async?: boolean;
    defer?: boolean;
    crossorigin?: "anonymous" | "use-credentials";
    integrity?: string;
    nomodule?: boolean;
    nonce?: string;
};
export declare function Script(attributes: ScriptAttributes, textContent?: string): VNode<"script">;
/**
 * Style element for inline CSS
 */
type StyleAttributes = {
    type?: "text/css";
    media?: string;
    nonce?: string;
    title?: string;
};
export declare function Style(attributes: StyleAttributes, cssContent?: string): VNode<"style">;
export {};
