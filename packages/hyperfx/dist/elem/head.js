/* Elements that should be inside the head */
import { createElement, createElementWithChildren } from "./elem";
/**
 * Must be inside <head>
 * If used there should only be 1 inside the document
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base
 * The <base> HTML element specifies the base URL to use for all relative URLs in a document. There can be only one <base> element in a document.
 *
 * A document's used base URL can be accessed by scripts with Node.baseURI. If the document has no <base> elements, then baseURI defaults to location.href.
 */
export function Base(attr) {
    return createElement("base", attr);
}
export function Meta(attributes) {
    return createElement("meta", attributes);
}
/**
 * Sets or updates the meta description in the head
 * TODO: This function needs to be re-evaluated for VDOM.
 * For now, it will return a VNode, and direct DOM manipulation is removed.
 */
export function MetaDescription(description) {
    // const current = document.head.querySelector('meta[name="description"]');
    // if (current) {
    //   current.setAttribute("content", description);
    // } else {
    //   // document.head.appendChild(
    //   //   Meta({ name: "description", content: description })
    //   // );
    // }
    return Meta({ name: "description", content: description });
}
/**
 * Sets or updates the document title.
 * WARNING: This is direct DOM manipulation and is NOT VDOM-compatible in its current form.
 * This approach bypasses the HyperFX VDOM rendering lifecycle.
 * A proper VDOM solution would involve a side-effect mechanism or a special VNode type
 * handled by the root rendering process to update document.title.
 * Leaving as is for now, but this needs to be addressed for full VDOM integration.
 */
export const Title = (title) => (document.title = title);
export function Link(attributes) {
    return createElement("link", attributes);
}
export function Script(attributes, textContent) {
    const children = textContent ? [textContent] : undefined;
    return createElementWithChildren("script", attributes, children);
}
export function Style(attributes, cssContent) {
    const children = cssContent ? [cssContent] : undefined;
    return createElementWithChildren("style", attributes, children);
}
//# sourceMappingURL=head.js.map