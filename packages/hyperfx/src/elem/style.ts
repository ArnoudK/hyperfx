import type { AttributesForElement } from "./attr";
import { createElement, VNode } from "./elem";

/**
 * Line break element
 * Br is a void element and cannot have children
 */
export const StyleBr = (attributes: AttributesForElement<"br"> = {}): VNode<"br"> => 
  createElement("br", attributes);

/**
 * Horizontal rule element  
 * Hr is a void element and cannot have children
 */
export const Hr = (attributes: AttributesForElement<"hr"> = {}): VNode<"hr"> => 
  createElement("hr", attributes);
