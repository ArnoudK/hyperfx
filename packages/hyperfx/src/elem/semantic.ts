import type { 
  AttributesForElement,
  
} from "./attr";
import {
  createElementWithChildren,
  VNode,
  VNodeChildren,
} from "./elem";

export const Address = (
  attributes: AttributesForElement<"address"> = {},
  children?: VNodeChildren
): VNode<"address"> => createElementWithChildren("address", attributes, children);

export const Nav = (
  attributes: AttributesForElement<"nav"> = {},
  children?: VNodeChildren
): VNode<"nav"> => createElementWithChildren("nav", attributes, children);

export const Pre = (
  attributes: AttributesForElement<"pre"> = {},
  children?: VNodeChildren
): VNode<"pre"> => createElementWithChildren("pre", attributes, children);

/**
 * Output element with required attributes
 * The 'for' attribute is required for proper form association
 */
export const Output = (
  attributes: AttributesForElement<"output"> & { for: string; name: string },
  children?: VNodeChildren
): VNode<"output"> => createElementWithChildren("output", attributes, children);

/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article */
export const Article = (
  attributes: AttributesForElement<"article"> = {},
  children?: VNodeChildren
): VNode<"article"> => createElementWithChildren("article", attributes, children);

/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside */
export const Aside = (
  attributes: AttributesForElement<"aside"> = {},
  children?: VNodeChildren
): VNode<"aside"> => createElementWithChildren("aside", attributes, children);

export const Main = (
  attributes: AttributesForElement<"main"> = {},
  children?: VNodeChildren
): VNode<"main"> => createElementWithChildren("main", attributes, children);

export const Footer = (
  attributes: AttributesForElement<"footer"> = {},
  children?: VNodeChildren
): VNode<"footer"> => createElementWithChildren("footer", attributes, children);

export const Header = (
  attributes: AttributesForElement<"header"> = {},
  children?: VNodeChildren
): VNode<"header"> => createElementWithChildren("header", attributes, children);

export const Section = (
  attributes: AttributesForElement<"section"> = {},
  children?: VNodeChildren
): VNode<"section"> => createElementWithChildren("section", attributes, children);

export const Figure = (
  attributes: AttributesForElement<"figure"> = {},
  children?: VNodeChildren
): VNode<"figure"> => createElementWithChildren("figure", attributes, children);

export const Figcaption = (
  attributes: AttributesForElement<"figcaption"> = {},
  children?: VNodeChildren
): VNode<"figcaption"> => createElementWithChildren("figcaption", attributes, children);
