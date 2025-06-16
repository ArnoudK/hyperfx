import type { AttributesForElement } from "./attr";
import { VNode, VNodeChildren } from "./elem";
/** <caption> <thead> <tbody> <tfooter>
 * also accepts <tr> directly
 * But it seems like using a <tbody> is preferred by the new standards
 */
export declare const Table: (attributes?: AttributesForElement<"table">, children?: VNodeChildren) => VNode<"table">;
export declare const TableHead: (attributes?: AttributesForElement<"thead">, children?: VNodeChildren) => VNode<"thead">;
export declare const Thead: (attributes?: AttributesForElement<"thead">, children?: VNodeChildren) => VNode<"thead">;
export declare const TableBody: (attributes?: AttributesForElement<"tbody">, children?: VNodeChildren) => VNode<"tbody">;
export declare const Tbody: (attributes?: AttributesForElement<"tbody">, children?: VNodeChildren) => VNode<"tbody">;
export declare const TableFoot: (attributes?: AttributesForElement<"tfoot">, children?: VNodeChildren) => VNode<"tfoot">;
export declare const Tfoot: (attributes?: AttributesForElement<"tfoot">, children?: VNodeChildren) => VNode<"tfoot">;
export declare const TableRow: (attributes?: AttributesForElement<"tr">, children?: VNodeChildren) => VNode<"tr">;
export declare const Tr: (attributes?: AttributesForElement<"tr">, children?: VNodeChildren) => VNode<"tr">;
/**
 * Table data cell with type-safe attributes
 */
export declare const TableData: (attributes?: AttributesForElement<"td">, children?: VNodeChildren) => VNode<"td">;
export declare const Td: (attributes?: AttributesForElement<"td">, children?: VNodeChildren) => VNode<"td">;
/**
 * Table header cell with enhanced type safety
 */
export declare const TableHeader: (attributes?: AttributesForElement<"th">, children?: VNodeChildren) => VNode<"th">;
export declare const Th: (attributes?: AttributesForElement<"th">, children?: VNodeChildren) => VNode<"th">;
/**
 * Caption for tables
 */
export declare const TableCaption: (attributes?: AttributesForElement<"caption">, children?: VNodeChildren) => VNode<"caption">;
