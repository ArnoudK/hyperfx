import { navigateTo } from "../pages/navigate";
import type { GlobalAttr, targetValues } from "./attr";
import { addAttr, addChildren, createE, t } from "./elem";
/**
    * this file is for Elements with phrasing content that should have text as children
    * Phrasing context:  https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#phrasing_content
    But only the ones that are not just semantic divs
    */

export function Span(attributes: GlobalAttr, text: string) {
  const res = document.createElement("span");
  addAttr(res, attributes);
  res.appendChild(t(text));
  return res;
}
type TextChild = Text | HTMLElement;

export const P = (attributes: GlobalAttr, ...children: TextChild[]) =>
  createE("p", attributes, children);

export const Abbr = (attributes: GlobalAttr, ...children: Text[]) =>
  createE("abbr", attributes, children);

type anchorAttr = Partial<GlobalAttr> & {
  href: string;
  target?: targetValues;
  download?: "download";
  filename?: string;
  hreflang?: string;
  ping?: string;
  referrerpolicy?:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";
  rel?: string;
};

export function A(attributes: anchorAttr, ...children: TextChild[]) {
  const res = createE("a", attributes, children);
  if (attributes.href[0] == "/") {
    res.addEventListener("click", (ev) => {
      navigateTo((ev.target as HTMLAnchorElement).href);
      ev.preventDefault();
      return false;
    });
  }
  return res;
}

export const B = (attributes: GlobalAttr, ...children: Text[]) =>
  createE("b", attributes, children);

export const Bdi = (attributes: GlobalAttr, ...children: Text[]) =>
  createE("bdi", attributes, children);

export const Bdo = (attributes: GlobalAttr, ...children: Text[]) =>
  createE("bdo", attributes, children);

export const I = (attributes: GlobalAttr, ...children: Text[]) =>
  createE("i", attributes, children);

export const Cite = (attributes: GlobalAttr, ...children: TextChild[]) =>
  createE("cite", attributes, children);
