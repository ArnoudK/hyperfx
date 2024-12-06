import type { GlobalAttr } from "./attr";
import { type HtmlElement_Or_Text_Children_Or_Undefined } from "./elem";
/** <caption> <thead> <tbody> <tfooter>
 * also accepts <tr> directly
 * But it seems like using a <tbody> is preffered by the new standards
 */
type tableChild = HTMLTableSectionElement | HTMLTableCaptionElement | HTMLTableRowElement;
export declare const Table: (attributes: GlobalAttr, children?: readonly tableChild[]) => HTMLTableElement;
export declare const TableHead: (attributes: GlobalAttr, children?: readonly HTMLTableRowElement[]) => HTMLTableSectionElement;
export declare const Thead: (attributes: GlobalAttr, children?: readonly HTMLTableRowElement[]) => HTMLTableSectionElement;
export declare const TableBody: (attributes: GlobalAttr, children?: readonly HTMLTableRowElement[]) => HTMLTableSectionElement;
export declare const Tbody: (attributes: GlobalAttr, children?: readonly HTMLTableRowElement[]) => HTMLTableSectionElement;
export declare const TableFoot: (attributes: GlobalAttr, children?: readonly HTMLTableRowElement[]) => HTMLTableSectionElement;
export declare const Tfoot: (attributes: GlobalAttr, children?: readonly HTMLTableRowElement[]) => HTMLTableSectionElement;
/** Only <td> and <th> */
type tableRowChild = HTMLTableCellElement;
export declare const TableRow: (attributes: GlobalAttr, children?: readonly tableRowChild[]) => HTMLTableRowElement;
export declare const Tr: (attributes: GlobalAttr, children?: readonly tableRowChild[]) => HTMLTableRowElement;
export declare const TableData: (attributes: GlobalAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLTableCellElement;
export declare const Td: (attributes: GlobalAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLTableCellElement;
/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attributes */
type tableHeaderAttributes = GlobalAttr & {
    scope?: "row" | "col" | "rowgroup" | "colgroup";
    abbr?: string;
    colspan?: string;
    headers?: string;
    rowspan?: string;
};
export declare const TableHeader: (attributes: tableHeaderAttributes, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLTableCellElement;
export declare const Th: (attributes: tableHeaderAttributes, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLTableCellElement;
export declare const TableCaption: (attributes: GlobalAttr, children?: HtmlElement_Or_Text_Children_Or_Undefined) => HTMLTableCaptionElement;
export {};
//# sourceMappingURL=table.d.ts.map