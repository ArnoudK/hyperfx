import type { GlobalAttr, HtmlAtrribute } from "./attr";

type BodyChild = HTMLDivElement | HTMLSpanElement | HTMLParagraphElement;

export const Div = (attributes: GlobalAttr, ...children: BodyChild[]) =>
  createE("div", attributes, children);

/** Render text (the text content inside a tag): */
export const t = (t: string) => document.createTextNode(t);

export const RenderToBody = (el: HTMLElement) => document.body.appendChild(el);

export function addAttr(el: Element, attributes: object) {
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    el.setAttribute(attr, (attributes as any)[attr]);
  }
}

export function addChildren(e: Element, children: (Element | Text)[]) {
  for (const c of children) {
    e.appendChild(c);
  }
}

export function createS<K extends keyof HTMLElementTagNameMap>(
  name: K,
  attributes: object,
) {
  const el = document.createElement(name);
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    el.setAttribute(attr, (attributes as any)[attr]);
  }
  return el;
}

export function createE<K extends keyof HTMLElementTagNameMap>(
  name: K,
  attributes: object,
  children: (Text | Element)[],
) {
  const el = document.createElement(name);
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    el.setAttribute(attr, (attributes as any)[attr]);
  }
  for (const c of children) {
    el.appendChild(c);
  }
  return el;
}
