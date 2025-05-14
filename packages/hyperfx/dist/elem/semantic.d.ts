import type { GlobalAttr } from "./attr";
import { type HtmlElement_Or_Text_Children_Or_Undefined } from "./elem";
export declare const Address: (attributes: GlobalAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLElement;
export declare const Nav: (attributes: GlobalAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLElement;
export declare const Pre: (attributes: GlobalAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLPreElement;
export declare const Output: (attributes: GlobalAttr & {
    for: string;
    name: string;
}, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLOutputElement;
/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article */
export declare const Article: (attributes: GlobalAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLElement;
/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside */
export declare const Aside: (attributes: GlobalAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLElement;
export declare const Main: (attributes: GlobalAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLElement;
export declare const Button: (attributes: GlobalAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLButtonElement;
export declare const Footer: (attributes: GlobalAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLElement;
