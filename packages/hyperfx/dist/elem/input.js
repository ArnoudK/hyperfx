import { createE, createS, } from "./elem";
const inputTypes = [
    "button",
    "checkbox",
    "color",
    "date",
    "datetime-local",
    "email",
    "file",
    "hidden",
    "image",
    "month",
    "password",
    "radio",
    "range",
    "reset",
    "search",
    "submit",
    "tel",
    "text",
    "time",
    "url",
    "week",
];
export const Input = (attrs) => createS("input", attrs);
export const Label = (attrs, children) => createE("label", attrs, children);
export const TextArea = (attrs) => {
    const el = createS("textarea", attrs);
    if (attrs.value) {
        el.value = attrs.value;
    }
    return el;
};
//# sourceMappingURL=input.js.map