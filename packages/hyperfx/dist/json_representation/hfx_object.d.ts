type attributes = Record<string, string>;
export type HFXObject = {
    tag: string;
    attrs: attributes;
    children: HFXObject[];
} | string;
/**
 * convert an Element to a HFXObject
 * this object can be turned into a JSON-string
 * and be turned into a Element again
 * (note: it stores the current state and not stuff like
 * listeners )
 */
export declare function elementToHFXObject(el: Element): HFXObject;
/**
 * @see elementToHFXObject
 *
 * Parse stuff from the dom to simple JS object
 * mainly for json parsing.
 */
export declare function nodeToHFXObject(node: Node): HFXObject;
export declare function HFXObjectToElement(hfx_object: HFXObject): Text | Element;
export {};
//# sourceMappingURL=hfx_object.d.ts.map