import { el } from "./elem";
const Head = (t, attributes = {}, children) => el(t, attributes, children);
export const H1 = (attributes = {}, children) => Head("h1", attributes, children);
export const H2 = (attributes = {}, children) => Head("h2", attributes, children);
export const H3 = (attributes = {}, children) => Head("h3", attributes, children);
export const H4 = (attributes = {}, children) => Head("h4", attributes, children);
export const H5 = (attributes = {}, children) => Head("h5", attributes, children);
export const H6 = (attributes = {}, children) => Head("h6", attributes, children);
//# sourceMappingURL=headings.js.map