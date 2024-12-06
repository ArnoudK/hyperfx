import type { GlobalAttr } from "./attr";
import {
  createE,
  type HtmlElement_Or_Text_Children_Or_Undefined,
} from "./elem";

export const Address = (
  attributes: GlobalAttr,
  children?: HtmlElement_Or_Text_Children_Or_Undefined
) => createE("address", attributes, children);

export const Nav = (
  attributes: GlobalAttr,
  children?: HtmlElement_Or_Text_Children_Or_Undefined
) => createE("nav", attributes, children);

export const Pre = (
  attributes: GlobalAttr,
  children?: HtmlElement_Or_Text_Children_Or_Undefined
) => createE("pre", attributes, children);

export const Output = (
  attributes: GlobalAttr & { for: string; name: string },
  children?: HtmlElement_Or_Text_Children_Or_Undefined
) => createE("output", attributes, children);

/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article */
export const Article = (
  attributes: GlobalAttr,
  children?: HtmlElement_Or_Text_Children_Or_Undefined
) => createE("article", attributes, children);

/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside */
export const Aside = (
  attributes: GlobalAttr,
  children?: HtmlElement_Or_Text_Children_Or_Undefined
) => createE("aside", attributes, children);

export const Main = (
  attributes: GlobalAttr,
  children?: HtmlElement_Or_Text_Children_Or_Undefined
) => createE("main", attributes, children);

export const Button = (
  attributes: GlobalAttr,
  children?: HtmlElement_Or_Text_Children_Or_Undefined
) => createE("button", attributes, children);

export const Footer = (
  attributes: GlobalAttr,
  children?: HtmlElement_Or_Text_Children_Or_Undefined
) => createE("footer", attributes, children);
