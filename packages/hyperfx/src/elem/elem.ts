import type { GlobalAttr, HtmlAtrribute } from "./attr";

export type HtmlElement_Or_Text_Children_Or_Undefined =
  | readonly (Element | Text)[]
  | undefined;

export type TextChildren_Or_Undefined = readonly Element[] | undefined;

export const Div = (
  attributes: GlobalAttr,
  children?: HtmlElement_Or_Text_Children_Or_Undefined
) => createE("div", attributes, children);

/** Render text (the text content inside a tag): */
export const t = (t: string) => document.createTextNode(t);

export const RenderToBody = (el: HTMLElement) => document.body.appendChild(el);

export const addAttr = (el: Element, attributes: object) => {
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    el.setAttribute(attr, (attributes as any)[attr]);
  }
};

export const addChildren = (
  e: Element,
  children?: HtmlElement_Or_Text_Children_Or_Undefined
) => {
  if (children)
    for (const c of children) {
      e.appendChild(c);
    }
};

export const createS = function <K extends keyof HTMLElementTagNameMap>(
  name: K,
  attributes: object
) {
  const el = document.createElement(name);
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    el.setAttribute(attr, (attributes as any)[attr]);
  }
  return el;
};

export const createE = function <K extends keyof HTMLElementTagNameMap>(
  name: K,
  attributes: object,
  children?: HtmlElement_Or_Text_Children_Or_Undefined
) {
  const el = document.createElement(name);
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    el.setAttribute(attr, (attributes as any)[attr]);
  }
  if (children) {
    for (const c of children) {
      el.appendChild(c);
    }
  }
  return el;
};
