import type { GlobalAttr } from "./attr";
import { createE } from "./elem";

type heads = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const Head = (t: heads, attributes: GlobalAttr, children?: readonly Text[]) =>
  createE(t, attributes, children);

export const H1 = (attributes: GlobalAttr, children?: readonly Text[]) =>
  Head("h1", attributes, children);

export const H2 = (attributes: GlobalAttr, children?: readonly Text[]) =>
  Head("h2", attributes, children);

export const H3 = (attributes: GlobalAttr, children?: readonly Text[]) =>
  Head("h3", attributes, children);

export const H4 = (attributes: GlobalAttr, children?: readonly Text[]) =>
  Head("h4", attributes, children);

export const H5 = (attributes: GlobalAttr, children?: readonly Text[]) =>
  Head("h5", attributes, children);

export const H6 = (attributes: GlobalAttr, children?: readonly Text[]) =>
  Head("h6", attributes, children);
