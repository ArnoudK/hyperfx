import { createElementWithChildren, } from "./elem";
export const Address = (attributes = {}, children) => createElementWithChildren("address", attributes, children);
export const Nav = (attributes = {}, children) => createElementWithChildren("nav", attributes, children);
export const Pre = (attributes = {}, children) => createElementWithChildren("pre", attributes, children);
/**
 * Output element with required attributes
 * The 'for' attribute is required for proper form association
 */
export const Output = (attributes, children) => createElementWithChildren("output", attributes, children);
/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article */
export const Article = (attributes = {}, children) => createElementWithChildren("article", attributes, children);
/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside */
export const Aside = (attributes = {}, children) => createElementWithChildren("aside", attributes, children);
export const Main = (attributes = {}, children) => createElementWithChildren("main", attributes, children);
export const Footer = (attributes = {}, children) => createElementWithChildren("footer", attributes, children);
export const Header = (attributes = {}, children) => createElementWithChildren("header", attributes, children);
export const Section = (attributes = {}, children) => createElementWithChildren("section", attributes, children);
export const Figure = (attributes = {}, children) => createElementWithChildren("figure", attributes, children);
export const Figcaption = (attributes = {}, children) => createElementWithChildren("figcaption", attributes, children);
//# sourceMappingURL=semantic.js.map