import { navigateTo } from "../pages/navigate";
import type { 
  AttributesForElement,
  StrictLinkAttributes,
} from "./attr";
import {
  el,
  VNode,
  VNodeChildren,
  t,
} from "./elem";

/**
 * This file is for Elements with phrasing content that should have text as children
 * Phrasing context: https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#phrasing_content
 * But only the ones that are not just semantic divs
 */

export function Span(
  attributes: AttributesForElement<"span"> = {} as AttributesForElement<"span">,
  childOrText?: string | VNodeChildren
): VNode<"span"> {
  const children: VNodeChildren = typeof childOrText === 'string' ? [childOrText] : childOrText;
  return el("span", attributes, children);
}

export const P = (
  attributes: AttributesForElement<"p"> = {} as AttributesForElement<"p">,
  children?: VNodeChildren
): VNode<"p"> => el("p", attributes, children);

export const Abbr = (
  attributes: AttributesForElement<"abbr"> = {} as AttributesForElement<"abbr">,
  children?: VNodeChildren
): VNode<"abbr"> => el("abbr", attributes, children);

export function A(
  attributes: StrictLinkAttributes,
  children?: VNodeChildren
): VNode<"a"> {
  const props: AttributesForElement<"a"> = { ...attributes } as AttributesForElement<"a">;
  if (attributes.href && attributes.href[0] === "/") {
    props.onclick = (ev: Event) => {
      if (ev.target instanceof HTMLAnchorElement) {
        navigateTo(ev.target.href);
      }
      ev.preventDefault();
      return false;
    };
  }
  return el("a", props, children);
}

export const B = (
  attributes: AttributesForElement<"b"> = {} as AttributesForElement<"b">,
  children?: VNodeChildren
): VNode<"b"> => el("b", attributes, children);

export const Bdi = (
  attributes: AttributesForElement<"bdi"> = {} as AttributesForElement<"bdi">,
  children?: VNodeChildren
): VNode<"bdi"> => el("bdi", attributes, children);

export const Bdo = (
  attributes: AttributesForElement<"bdo"> = {} as AttributesForElement<"bdo">,
  children?: VNodeChildren
): VNode<"bdo"> => el("bdo", attributes, children);

export const I = (
  attributes: AttributesForElement<"i"> = {} as AttributesForElement<"i">,
  children?: VNodeChildren
): VNode<"i"> => el("i", attributes, children);

export const Cite = (
  attributes: AttributesForElement<"cite"> = {} as AttributesForElement<"cite">,
  children?: VNodeChildren
): VNode<"cite"> => el("cite", attributes, children);

export const Code = (
  attributes: AttributesForElement<"code"> = {} as AttributesForElement<"code">,
  children?: VNodeChildren
): VNode<"code"> => el("code", attributes, children);

export const Data = (
  attributes: AttributesForElement<"data"> & { value: string },
  children?: VNodeChildren
): VNode<"data"> => el("data", attributes, children);

export const Dfn = (
  attributes: AttributesForElement<"dfn"> = {} as AttributesForElement<"dfn">,
  children?: VNodeChildren
): VNode<"dfn"> => el("dfn", attributes, children);

export const Em = (
  attributes: AttributesForElement<"em"> = {} as AttributesForElement<"em">,
  children?: VNodeChildren
): VNode<"em"> => el("em", attributes, children);

export const Kbd = (
  attributes: AttributesForElement<"kbd"> = {} as AttributesForElement<"kbd">,
  children?: VNodeChildren
): VNode<"kbd"> => el("kbd", attributes, children);

export const Mark = (
  attributes: AttributesForElement<"mark"> = {} as AttributesForElement<"mark">,
  children?: VNodeChildren
): VNode<"mark"> => el("mark", attributes, children);

export const Q = (
  attributes: AttributesForElement<"q"> = {} as AttributesForElement<"q">,
  children?: VNodeChildren
): VNode<"q"> => el("q", attributes, children);

export const S = (
  attributes: AttributesForElement<"s"> = {} as AttributesForElement<"s">,
  children?: VNodeChildren
): VNode<"s"> => el("s", attributes, children);

export const Samp = (
  attributes: AttributesForElement<"samp"> = {} as AttributesForElement<"samp">,
  children?: VNodeChildren
): VNode<"samp"> => el("samp", attributes, children);

export const Small = (
  attributes: AttributesForElement<"small"> = {} as AttributesForElement<"small">,
  children?: VNodeChildren
): VNode<"small"> => el("small", attributes, children);

export const Strong = (
  attributes: AttributesForElement<"strong"> = {} as AttributesForElement<"strong">,
  children?: VNodeChildren
): VNode<"strong"> => el("strong", attributes, children);

export const Sub = (
  attributes: AttributesForElement<"sub"> = {} as AttributesForElement<"sub">,
  children?: VNodeChildren
): VNode<"sub"> => el("sub", attributes, children);

export const Sup = (
  attributes: AttributesForElement<"sup"> = {} as AttributesForElement<"sup">,
  children?: VNodeChildren
): VNode<"sup"> => el("sup", attributes, children);

export const Time = (
  attributes: AttributesForElement<"time"> = {} as AttributesForElement<"time">,
  children?: VNodeChildren
): VNode<"time"> => el("time", attributes, children);

export const U = (
  attributes: AttributesForElement<"u"> = {} as AttributesForElement<"u">,
  children?: VNodeChildren
): VNode<"u"> => el("u", attributes, children);

export const Var = (
  attributes: AttributesForElement<"var"> = {} as AttributesForElement<"var">,
  children?: VNodeChildren
): VNode<"var"> => el("var", attributes, children);

export const BlockQuote = (
  attributes: AttributesForElement<"blockquote"> = {} as AttributesForElement<"blockquote">,
  children?: VNodeChildren
): VNode<"blockquote"> => el("blockquote", attributes, children);

export const Br = (
  attributes: AttributesForElement<"br"> = {} as AttributesForElement<"br">
): VNode<"br"> => el("br", attributes);

export const Wbr = (
  attributes: AttributesForElement<"wbr"> = {} as AttributesForElement<"wbr">
): VNode<"wbr"> => el("wbr", attributes);
