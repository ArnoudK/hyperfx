import type { AttributesForElement } from "./attr";
import { VNode } from "./elem";
/**
 * Line break element
 * Br is a void element and cannot have children
 */
export declare const StyleBr: (attributes?: AttributesForElement<"br">) => VNode<"br">;
/**
 * Horizontal rule element
 * Hr is a void element and cannot have children
 */
export declare const Hr: (attributes?: AttributesForElement<"hr">) => VNode<"hr">;
