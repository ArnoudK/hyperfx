import { el } from "./elem";
/**
 * Type-safe input element using standardized attributes
 * Supports all HTML input types with proper validation
 */
export const Input = (attributes = {}) => el("input", attributes);
/**
 * Type-safe form element
 */
export const Form = (attributes = {}, children) => el("form", attributes, children);
/**
 * Type-safe label element
 * The 'for' attribute is handled automatically (use 'htmlFor' in attributes)
 */
export const Label = (attributes = {}, children) => el("label", attributes, children);
/**
 * Type-safe textarea element
 */
export const TextArea = (attributes = {}, children) => {
    return el("textarea", attributes, children);
};
/**
 * Type-safe select element
 */
export const Select = (attributes = {}, children) => el("select", attributes, children);
/**
 * Type-safe option element
 */
export const Option = (attributes = {}, children) => el("option", attributes, children);
/**
 * Type-safe button element
 */
export const Button = (attributes = {}, children) => el("button", attributes, children);
/**
 * Type-safe fieldset element
 */
export const Fieldset = (attributes = {}, children) => el("fieldset", attributes, children);
/**
 * Type-safe legend element
 */
export const Legend = (attributes = {}, children) => el("legend", attributes, children);
/**
 * Type-safe optgroup element
 */
export const OptGroup = (attributes = {}, children) => el("optgroup", attributes, children);
/**
 * Type-safe datalist element
 */
export const DataList = (attributes = {}, children) => el("datalist", attributes, children);
/**
 * Type-safe progress element
 */
export const Progress = (attributes = {}, children) => el("progress", attributes, children);
/**
 * Type-safe meter element
 */
export const Meter = (attributes = {}, children) => el("meter", attributes, children);
//# sourceMappingURL=input.js.map