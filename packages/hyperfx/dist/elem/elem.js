export const Div = (attributes, children) => createE("div", attributes, children);
/** Render text (the text content inside a tag): */
export function t(text, ...values) {
    let result = "";
    if (typeof text === "string") {
        // If the input is a string, just return it
        result = text;
    }
    else {
        // Iterate through the static strings and interleave them with the values
        for (let i = 0; i < values.length; i++) {
            result += text[i]; // Append the static string part
            result += String(values[i]); // Append the stringified value
        }
        // Append the last static string part
        // (there's always one more string part than there are values)
        result += text[values.length];
    }
    return document.createTextNode(result);
}
const a = t `kek`;
export const RenderToBody = (el) => document.body.appendChild(el);
export const addAttr = (el, attributes) => {
    const attrs = Object.keys(attributes);
    for (const attr of attrs) {
        el.setAttribute(attr, attributes[attr]);
    }
};
export const addChildren = (e, children) => {
    if (children)
        for (const c of children) {
            e.appendChild(c);
        }
};
export const createS = function (name, attributes) {
    const el = document.createElement(name);
    const attrs = Object.keys(attributes);
    for (const attr of attrs) {
        el.setAttribute(attr, attributes[attr]);
    }
    return el;
};
export const createE = function (name, attributes, children) {
    const el = document.createElement(name);
    const attrs = Object.keys(attributes);
    for (const attr of attrs) {
        el.setAttribute(attr, attributes[attr]);
    }
    if (children) {
        for (const c of children) {
            el.appendChild(c);
        }
    }
    return el;
};
//# sourceMappingURL=elem.js.map