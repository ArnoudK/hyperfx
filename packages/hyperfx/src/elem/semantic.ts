import type { GlobalAttr } from "./attr";
import { createE } from "./elem";

export const Address = (
  attributes: GlobalAttr,
  ...children: readonly HTMLElement[]
) => createE("address", attributes, children);

export const Nav = (
  attributes: GlobalAttr,
  ...children: readonly HTMLElement[]
) => createE("nav", attributes, children);

/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article */
export const Article = (
  attributes: GlobalAttr,
  ...children: readonly HTMLElement[]
) => createE("article", attributes, children);

/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside */
export const Aside = (
  attributes: GlobalAttr,
  ...children: readonly HTMLElement[]
) => createE("aside", attributes, children);

export const Main = (
  attributes: GlobalAttr,
  ...children: readonly HTMLElement[]
) => createE("main", attributes, children);

export const Button = (
  attributes: GlobalAttr,
  ...children: readonly HTMLElement[]
) => createE("button", attributes, children);

export const Footer = (
  attributes: GlobalAttr,
  ...children: readonly HTMLElement[]
) => createE("footer", attributes, children);
