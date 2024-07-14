import type { GlobalAttr } from "./attr";
import { createE } from "./elem";

export const Address = (attributes: GlobalAttr, ...children: HTMLElement[]) =>
  createE("address", attributes, children);

export const Nav = (attributes: GlobalAttr, ...children: HTMLElement[]) =>
  createE("nav", attributes, children);

/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article */
export const Article = (attributes: GlobalAttr, ...children: HTMLElement[]) =>
  createE("article", attributes, children);

/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside */
export const Aside = (attributes: GlobalAttr, ...children: HTMLElement[]) =>
  createE("aside", attributes, children);

export const Main = (attributes: GlobalAttr, ...children: HTMLElement[]) =>
  createE("main", attributes, children);

export const Button = (attributes: GlobalAttr, ...children: HTMLElement[]) =>
  createE("button", attributes, children);

export const Footer = (attributes: GlobalAttr, ...children: HTMLElement[]) =>
  createE("footer", attributes, children);
