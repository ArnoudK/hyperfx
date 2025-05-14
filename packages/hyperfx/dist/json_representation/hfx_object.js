/**
 * convert an Element to a HFXObject
 * this object can be turned into a JSON-string
 * and be turned into a Element again
 * (note: it stores the current state and not stuff like
 * listeners )
 */
export function elementToHFXObject(el) {
    const tag = el.tagName;
    const attrs = {};
    const children = [];
    const cNodes = el.childNodes;
    const elAttrs = el.attributes;
    for (const a of elAttrs) {
        const aname = a.name;
        const value = a.value;
        attrs[aname] = value;
    }
    for (const c of cNodes) {
        children.push(nodeToHFXObject(c));
    }
    return { tag: tag, attrs: attrs, children: children };
}
/**
 * @see elementToHFXObject
 *
 * Parse stuff from the dom to simple JS object
 * mainly for json parsing.
 */
export function nodeToHFXObject(node) {
    if (node instanceof Text) {
        return node.textContent ?? "";
    }
    else {
        // we assert that this should work because
        // we shouldn't really deal with strange fragments
        // other other shenigans.
        return elementToHFXObject(node);
    }
}
export function HFXObjectToElement(hfx_object) {
    if (typeof hfx_object == "string") {
        return document.createTextNode(hfx_object);
    }
    const el = document.createElement(hfx_object.tag);
    for (const c of hfx_object.children) {
        el.appendChild(HFXObjectToElement(c));
    }
    const akeys = Object.keys(hfx_object.attrs);
    for (const a of akeys) {
        el.setAttribute(a, hfx_object.attrs[a]);
    }
    return el;
}
//# sourceMappingURL=hfx_object.js.map