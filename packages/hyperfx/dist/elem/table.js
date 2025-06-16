import { createElementWithChildren, } from "./elem";
/** <caption> <thead> <tbody> <tfooter>
 * also accepts <tr> directly
 * But it seems like using a <tbody> is preferred by the new standards
 */
// The specific child types like HTMLTableSectionElement are too restrictive for VNode children.
// VNodeChildren allows for more flexible composition.
export const Table = (attributes = {}, children) => createElementWithChildren("table", attributes, children);
export const TableHead = (attributes = {}, children // Typically VNode<"tr">[]
) => createElementWithChildren("thead", attributes, children);
export const Thead = TableHead;
export const TableBody = (attributes = {}, children // Typically VNode<"tr">[]
) => createElementWithChildren("tbody", attributes, children);
export const Tbody = TableBody;
export const TableFoot = (attributes = {}, children // Typically VNode<"tr">[]
) => createElementWithChildren("tfoot", attributes, children);
export const Tfoot = TableFoot;
export const TableRow = (attributes = {}, children // Typically (VNode<"td"> | VNode<"th">)[]
) => createElementWithChildren("tr", attributes, children);
export const Tr = TableRow;
/**
 * Table data cell with type-safe attributes
 */
export const TableData = (attributes = {}, children) => createElementWithChildren("td", attributes, children);
export const Td = TableData;
/**
 * Table header cell with enhanced type safety
 */
export const TableHeader = (attributes = {}, children) => createElementWithChildren("th", attributes, children);
export const Th = TableHeader;
/**
 * Caption for tables
 */
export const TableCaption = (attributes = {}, children) => createElementWithChildren("caption", attributes, children);
//# sourceMappingURL=table.js.map