type attributes = Record<string, string>;
export type HFXObject =
  | {
      tag: string;
      attrs: attributes;
      children: HFXObject[];
    }
  | string;

/**
 * convert an Element to a HFXObject
 * this object can be turned into a JSON-string
 * and be turned into a Element again
 * (note: it stores the current state and not stuff like
 * listeners )
 */
export function elementToHFXObject(el: Element): HFXObject {
  const tag = el.tagName;
  const attrs: attributes = {};
  const children: HFXObject[] = [];
  const cNodes = el.childNodes;
  const elAttrs = el.attributes;
  for (const a of elAttrs) {
    const aname = a.name;
    const value = a.value;
    (attrs as Record<string, unknown>)[aname] = value;
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
export function nodeToHFXObject(node: Node) {
  if (node instanceof Text) {
    return (node as Text).textContent ?? "";
  } else {
    // we assert that this should work because
    // we shouldn't really deal with strange fragments
    // other other shenigans.
    return elementToHFXObject(node as Element);
  }
}

export function HFXObjectToElement(hfx_object: HFXObject): Text | Element {
  if (typeof hfx_object == "string") {
    return document.createTextNode(hfx_object);
  }
  const el = document.createElement(hfx_object.tag);
  for (const c of hfx_object.children) {
    el.appendChild(HFXObjectToElement(c));
  }
  const akeys = Object.keys( hfx_object.attrs);
  for (const a of akeys) {
    el.setAttribute(a, hfx_object.attrs[a]!);
  }

  return el;
}
