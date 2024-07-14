import type { GlobalAttr } from "./attr";
import { createE } from "./elem";

/** <caption> <thead> <tbody> <tfooter>
 * also accepts <tr> directly
 * But it seems like using a <tbody> is preffered by the new standards
 */
type tableChild =
  | HTMLTableSectionElement
  | HTMLTableCaptionElement
  | HTMLTableRowElement;

export const Table = (attributes: GlobalAttr, ...children: tableChild[]) =>
  createE("table", attributes, children);

export const TableHead = (
  attributes: GlobalAttr,
  ...children: HTMLTableRowElement[]
) => createE("thead", attributes, children);

export const Thead = TableHead;

export const TableBody = (
  attributes: GlobalAttr,
  ...children: HTMLTableRowElement[]
) => createE("tbody", attributes, children);

export const Tbody = TableBody;

export const TableFoot = (
  attributes: GlobalAttr,
  ...children: HTMLTableRowElement[]
) => createE("tfoot", attributes, children);

export const Tfoot = TableFoot;

/** Only <td> and <th> */
type tableRowChild = HTMLTableCellElement;

export const TableRow = (
  attributes: GlobalAttr,
  ...children: tableRowChild[]
) => createE("tr", attributes, children);

export const Tr = TableRow;

export const TableData = (
  attributes: GlobalAttr,
  ...children: (HTMLElement | Text)[]
) => createE("td", attributes, children);

export const Td = TableData;

/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attributes */
type tableHeaderAttributes = GlobalAttr & {
  scope?: "row" | "col" | "rowgroup" | "colgroup";
  abbr?: string;
  colspan?: string;
  headers?: string;
  rowspan?: string;
};

export const TableHeader = (
  attributes: tableHeaderAttributes,
  ...children: (Text | HTMLElement)[]
) => createE("th", attributes, children);

export const Th = TableHeader;

/* Caption for tables */
export const TableCaption = (
  attributes: GlobalAttr,
  ...children: (Text | HTMLElement)[]
) => createE("caption", attributes, children);
