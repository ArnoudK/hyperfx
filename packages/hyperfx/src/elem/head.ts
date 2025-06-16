/* Elements that should be inside the head */

import type { TargetValues } from "./attr";
import { createElement, createElementWithChildren, VNode, VNodeChildren } from "./elem";

/**
 * Base element attributes with strict typing
 */
type BaseAttrOpt = {
  href: string;
  target: TargetValues;
};

type BaseAttr = Partial<BaseAttrOpt> &
  (Pick<BaseAttrOpt, "href"> | Pick<BaseAttrOpt, "target">);

/**
 * Must be inside <head>
 * If used there should only be 1 inside the document
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base
 * The <base> HTML element specifies the base URL to use for all relative URLs in a document. There can be only one <base> element in a document.
 *
 * A document's used base URL can be accessed by scripts with Node.baseURI. If the document has no <base> elements, then baseURI defaults to location.href.
 */
export function Base(attr: BaseAttr): VNode<"base"> {
  return createElement("base", attr as any);
}

/**
 * Meta element with strict typing for name and content
 */
type MetaAttributes = {
  name?: string;
  content?: string;
  charset?: string;
  'http-equiv'?: "content-security-policy" | "content-type" | "default-style" | "x-ua-compatible" | "refresh";
  property?: string; // For Open Graph meta tags
};

export function Meta(attributes: MetaAttributes): VNode<"meta"> {
  return createElement("meta", attributes as any);
}

/**
 * Sets or updates the meta description in the head
 * TODO: This function needs to be re-evaluated for VDOM.
 * For now, it will return a VNode, and direct DOM manipulation is removed.
 */
export function MetaDescription(description: string): VNode<"meta"> {
  // const current = document.head.querySelector('meta[name="description"]');
  // if (current) {
  //   current.setAttribute("content", description);
  // } else {
  //   // document.head.appendChild(
  //   //   Meta({ name: "description", content: description })
  //   // );
  // }
  return Meta({ name: "description", content: description });
}

/**
 * Sets or updates the document title.
 * WARNING: This is direct DOM manipulation and is NOT VDOM-compatible in its current form.
 * This approach bypasses the HyperFX VDOM rendering lifecycle.
 * A proper VDOM solution would involve a side-effect mechanism or a special VNode type
 * handled by the root rendering process to update document.title.
 * Leaving as is for now, but this needs to be addressed for full VDOM integration.
 */
export const Title = (title: string) => (document.title = title);

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

export function Link(attributes: LinkAttributes): VNode<"link"> {
  return createElement("link", attributes as any);
}

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

export function Script(attributes: ScriptAttributes, textContent?: string): VNode<"script"> {
  const children: VNodeChildren | undefined = textContent ? [textContent] : undefined;
  return createElementWithChildren("script", attributes as any, children);
}

/**
 * Style element for inline CSS
 */
type StyleAttributes = {
  type?: "text/css";
  media?: string;
  nonce?: string;
  title?: string;
};

export function Style(attributes: StyleAttributes, cssContent?: string): VNode<"style"> {
  const children: VNodeChildren | undefined = cssContent ? [cssContent] : undefined;
  return createElementWithChildren("style", attributes as any, children);
}
