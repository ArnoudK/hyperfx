import type {
  AttributesForElement,
} from "./attr";
import {
  createElementWithChildren,
  VNode,
  VNodeChildren,
} from "./elem";

/** <caption> <thead> <tbody> <tfooter>
 * also accepts <tr> directly
 * But it seems like using a <tbody> is preferred by the new standards
 */
// The specific child types like HTMLTableSectionElement are too restrictive for VNode children.
// VNodeChildren allows for more flexible composition.
export const Table = (
  attributes: AttributesForElement<"table"> = {},
  children?: VNodeChildren
): VNode<"table"> => createElementWithChildren("table", attributes, children);

export const TableHead = (
  attributes: AttributesForElement<"thead"> = {},
  children?: VNodeChildren // Typically VNode<"tr">[]
): VNode<"thead"> => createElementWithChildren("thead", attributes, children);

export const Thead = TableHead;

export const TableBody = (
  attributes: AttributesForElement<"tbody"> = {},
  children?: VNodeChildren // Typically VNode<"tr">[]
): VNode<"tbody"> => createElementWithChildren("tbody", attributes, children);

export const Tbody = TableBody;

export const TableFoot = (
  attributes: AttributesForElement<"tfoot"> = {},
  children?: VNodeChildren // Typically VNode<"tr">[]
): VNode<"tfoot"> => createElementWithChildren("tfoot", attributes, children);

export const Tfoot = TableFoot;

export const TableRow = (
  attributes: AttributesForElement<"tr"> = {},
  children?: VNodeChildren // Typically (VNode<"td"> | VNode<"th">)[]
): VNode<"tr"> => createElementWithChildren("tr", attributes, children);

export const Tr = TableRow;

/**
 * Table data cell with type-safe attributes
 */
export const TableData = (
  attributes: AttributesForElement<"td"> = {},
  children?: VNodeChildren
): VNode<"td"> => createElementWithChildren("td", attributes, children);

export const Td = TableData;

/**
 * Table header cell with enhanced type safety
 */
export const TableHeader = (
  attributes: AttributesForElement<"th"> = {},
  children?: VNodeChildren
): VNode<"th"> => createElementWithChildren("th", attributes, children);

export const Th = TableHeader;

/**
 * Caption for tables
 */
export const TableCaption = (
  attributes: AttributesForElement<"caption"> = {},
  children?: VNodeChildren
): VNode<"caption"> => createElementWithChildren("caption", attributes, children);
