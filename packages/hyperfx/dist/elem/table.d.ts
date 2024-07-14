import type { GlobalAttr } from "./attr";
/** <caption> <thead> <tbody> <tfooter>
 * also accepts <tr> directly
 * But it seems like using a <tbody> is preffered by the new standards
 */
type tableChild = HTMLTableSectionElement | HTMLTableCaptionElement | HTMLTableRowElement;
export declare const Table: (attributes: GlobalAttr, ...children: tableChild[]) => HTMLTableElement;
export declare const TableHead: (attributes: GlobalAttr, ...children: HTMLTableRowElement[]) => HTMLTableSectionElement;
export declare const Thead: (attributes: GlobalAttr, ...children: HTMLTableRowElement[]) => HTMLTableSectionElement;
export declare const TableBody: (attributes: GlobalAttr, ...children: HTMLTableRowElement[]) => HTMLTableSectionElement;
export declare const Tbody: (attributes: GlobalAttr, ...children: HTMLTableRowElement[]) => HTMLTableSectionElement;
export declare const TableFoot: (attributes: GlobalAttr, ...children: HTMLTableRowElement[]) => HTMLTableSectionElement;
export declare const Tfoot: (attributes: GlobalAttr, ...children: HTMLTableRowElement[]) => HTMLTableSectionElement;
/** Only <td> and <th> */
type tableRowChild = HTMLTableCellElement;
export declare const TableRow: (attributes: GlobalAttr, ...children: tableRowChild[]) => HTMLTableRowElement;
export declare const Tr: (attributes: GlobalAttr, ...children: tableRowChild[]) => HTMLTableRowElement;
export declare const TableData: (attributes: GlobalAttr, ...children: (HTMLElement | Text)[]) => HTMLTableCellElement;
export declare const Td: (attributes: GlobalAttr, ...children: (HTMLElement | Text)[]) => HTMLTableCellElement;
/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attributes */
type tableHeaderAttributes = GlobalAttr & {
    scope?: "row" | "col" | "rowgroup" | "colgroup";
    abbr?: string;
    colspan?: string;
    headers?: string;
    rowspan?: string;
};
export declare const TableHeader: (attributes: tableHeaderAttributes, ...children: (Text | HTMLElement)[]) => HTMLTableCellElement;
export declare const Th: (attributes: tableHeaderAttributes, ...children: (Text | HTMLElement)[]) => HTMLTableCellElement;
export declare const TableCaption: (attributes: GlobalAttr, ...children: (Text | HTMLElement)[]) => HTMLTableCaptionElement;
export {};
//# sourceMappingURL=table.d.ts.map