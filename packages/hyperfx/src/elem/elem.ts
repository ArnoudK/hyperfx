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
export function t(text: TemplateStringsArray | string, ...values: (((string|unknown)[]))) {
  let result = "";
  if (typeof text === "string") {
    // If the input is a string, just return it
    result = text;
  } else {
    // Iterate through the static strings and interleave them with the values
    for (let i = 0; i < values.length; i++) {
      result += text[i]; // Append the static string part
      result += String(values[i]); // Append the stringified value
    }
    // Append the last static string part
    // (there's always one more string part than there are values)
    result += text[values.length];
  }
  return document.createTextNode(result);
}
const a = t`kek`

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
