import type { AttributesForElement } from "./attr";
import { el, VNode, VNodeChildren } from "./elem";

type heads = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const Head = <T extends heads>(
  t: T,
  attributes: AttributesForElement<T> = {} as AttributesForElement<T>,
  children?: VNodeChildren
): VNode<T> => el(t, attributes, children);

export const H1 = (
  attributes: AttributesForElement<"h1"> = {} as AttributesForElement<"h1">,
  children?: VNodeChildren
): VNode<"h1"> => Head("h1", attributes, children);

export const H2 = (
  attributes: AttributesForElement<"h2"> = {} as AttributesForElement<"h2">,
  children?: VNodeChildren
): VNode<"h2"> => Head("h2", attributes, children);

export const H3 = (
  attributes: AttributesForElement<"h3"> = {} as AttributesForElement<"h3">,
  children?: VNodeChildren
): VNode<"h3"> => Head("h3", attributes, children);

export const H4 = (
  attributes: AttributesForElement<"h4"> = {} as AttributesForElement<"h4">,
  children?: VNodeChildren
): VNode<"h4"> => Head("h4", attributes, children);

export const H5 = (
  attributes: AttributesForElement<"h5"> = {} as AttributesForElement<"h5">,
  children?: VNodeChildren
): VNode<"h5"> => Head("h5", attributes, children);

export const H6 = (
  attributes: AttributesForElement<"h6"> = {} as AttributesForElement<"h6">,
  children?: VNodeChildren
): VNode<"h6"> => Head("h6", attributes, children);
