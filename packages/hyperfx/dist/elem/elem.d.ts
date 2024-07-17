import type { GlobalAttr } from "./attr";
type BodyChild = HTMLDivElement | HTMLSpanElement | HTMLParagraphElement;
export declare const Div: (attributes: GlobalAttr, ...children: readonly BodyChild[]) => HTMLDivElement;
/** Render text (the text content inside a tag): */
export declare const t: (t: string) => Text;
export declare const RenderToBody: (el: HTMLElement) => HTMLElement;
export declare function addAttr(el: Element, attributes: object): void;
export declare function addChildren(e: Element, children: readonly (Element | Text)[]): void;
export declare function createS<K extends keyof HTMLElementTagNameMap>(name: K, attributes: object): HTMLElementTagNameMap[K];
export declare function createE<K extends keyof HTMLElementTagNameMap>(name: K, attributes: object, children: readonly (Text | Element)[]): HTMLElementTagNameMap[K];
export {};
//# sourceMappingURL=elem.d.ts.map