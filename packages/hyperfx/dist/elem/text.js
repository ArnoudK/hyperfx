import { navigateTo } from "../pages/navigate";
import { addAttr, addChildren, createE, t, } from "./elem";
/**
    * this file is for Elements with phrasing content that should have text as children
    * Phrasing context:  https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#phrasing_content
    But only the ones that are not just semantic divs
    */
export function Span(attributes, childOrText) {
    const res = document.createElement("span");
    addAttr(res, attributes);
    if (typeof childOrText === "string") {
        res.appendChild(t(childOrText));
    }
    else {
        addChildren(res, childOrText);
    }
    return res;
}
export const P = (attributes, children) => createE("p", attributes, children);
export const Abbr = (attributes, children) => createE("abbr", attributes, children);
export function A(attributes, children) {
    const res = createE("a", attributes, children);
    if (attributes.href[0] == "/") {
        res.addEventListener("click", (ev) => {
            navigateTo(ev.target.href);
            ev.preventDefault();
            return false;
        });
    }
    return res;
}
export const B = (attributes, children) => createE("b", attributes, children);
export const Bdi = (attributes, children) => createE("bdi", attributes, children);
export const Bdo = (attributes, children) => createE("bdo", attributes, children);
export const I = (attributes, children) => createE("i", attributes, children);
export const Cite = (attributes, children) => createE("cite", attributes, children);
export const Code = (attributes, children) => createE("code", attributes, children);
export const BlockQuote = (attributes, children) => createE("blockquote", attributes, children);
//# sourceMappingURL=text.js.map