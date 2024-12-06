import type { GlobalAttr } from "./attr";
export type HtmlElement_Or_Text_Children_Or_Undefined = readonly (Element | Text)[] | undefined;
export type TextChildren_Or_Undefined = readonly Element[] | undefined;
export declare const Div: (attributes: GlobalAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLDivElement;
/** Render text (the text content inside a tag): */
export declare const t: (t: string) => Text;
export declare const RenderToBody: (el: HTMLElement) => HTMLElement;
export declare const addAttr: (el: Element, attributes: object) => void;
export declare const addChildren: (e: Element, children?: HtmlElement_Or_Text_Children_Or_Undefined) => void;
export declare const createS: <K extends keyof HTMLElementTagNameMap>(name: K, attributes: object) => HTMLElementTagNameMap[K];
export declare const createE: <K extends keyof HTMLElementTagNameMap>(name: K, attributes: object, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLElementTagNameMap[K];
//# sourceMappingURL=elem.d.ts.map