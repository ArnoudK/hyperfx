import { createE, } from "./elem";
export const Table = (attributes, children) => createE("table", attributes, children);
export const TableHead = (attributes, children) => createE("thead", attributes, children);
export const Thead = TableHead;
export const TableBody = (attributes, children) => createE("tbody", attributes, children);
export const Tbody = TableBody;
export const TableFoot = (attributes, children) => createE("tfoot", attributes, children);
export const Tfoot = TableFoot;
export const TableRow = (attributes, children) => createE("tr", attributes, children);
export const Tr = TableRow;
export const TableData = (attributes, children) => createE("td", attributes, children);
export const Td = TableData;
export const TableHeader = (attributes, children) => createE("th", attributes, children);
export const Th = TableHeader;
/* Caption for tables */
export const TableCaption = (attributes, children) => createE("caption", attributes, children);
//# sourceMappingURL=table.js.map