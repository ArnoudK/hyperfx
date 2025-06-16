import { navigateTo } from "../pages/navigate";
import { el, } from "./elem";
/**
 * This file is for Elements with phrasing content that should have text as children
 * Phrasing context: https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#phrasing_content
 * But only the ones that are not just semantic divs
 */
export function Span(attributes = {}, childOrText) {
    const children = typeof childOrText === 'string' ? [childOrText] : childOrText;
    return el("span", attributes, children);
}
export const P = (attributes = {}, children) => el("p", attributes, children);
export const Abbr = (attributes = {}, children) => el("abbr", attributes, children);
export function A(attributes, children) {
    const props = { ...attributes };
    if (attributes.href && attributes.href[0] === "/") {
        props.onclick = (ev) => {
            if (ev.target instanceof HTMLAnchorElement) {
                navigateTo(ev.target.href);
            }
            ev.preventDefault();
            return false;
        };
    }
    return el("a", props, children);
}
export const B = (attributes = {}, children) => el("b", attributes, children);
export const Bdi = (attributes = {}, children) => el("bdi", attributes, children);
export const Bdo = (attributes = {}, children) => el("bdo", attributes, children);
export const I = (attributes = {}, children) => el("i", attributes, children);
export const Cite = (attributes = {}, children) => el("cite", attributes, children);
export const Code = (attributes = {}, children) => el("code", attributes, children);
export const Data = (attributes, children) => el("data", attributes, children);
export const Dfn = (attributes = {}, children) => el("dfn", attributes, children);
export const Em = (attributes = {}, children) => el("em", attributes, children);
export const Kbd = (attributes = {}, children) => el("kbd", attributes, children);
export const Mark = (attributes = {}, children) => el("mark", attributes, children);
export const Q = (attributes = {}, children) => el("q", attributes, children);
export const S = (attributes = {}, children) => el("s", attributes, children);
export const Samp = (attributes = {}, children) => el("samp", attributes, children);
export const Small = (attributes = {}, children) => el("small", attributes, children);
export const Strong = (attributes = {}, children) => el("strong", attributes, children);
export const Sub = (attributes = {}, children) => el("sub", attributes, children);
export const Sup = (attributes = {}, children) => el("sup", attributes, children);
export const Time = (attributes = {}, children) => el("time", attributes, children);
export const U = (attributes = {}, children) => el("u", attributes, children);
export const Var = (attributes = {}, children) => el("var", attributes, children);
export const BlockQuote = (attributes = {}, children) => el("blockquote", attributes, children);
export const Br = (attributes = {}) => el("br", attributes);
export const Wbr = (attributes = {}) => el("wbr", attributes);
//# sourceMappingURL=text.js.map