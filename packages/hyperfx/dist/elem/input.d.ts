import type { InputElementAttributes, FormElementAttributes, SelectElementAttributes, OptionElementAttributes, LabelElementAttributes, TextAreaElementAttributes, ButtonElementAttributes, AttributesForElement } from "./attr";
import { VNode, VNodeChildren } from "./elem";
/**
 * Type-safe input element using standardized attributes
 * Supports all HTML input types with proper validation
 */
export declare const Input: (attributes?: InputElementAttributes) => VNode<"input">;
/**
 * Type-safe form element
 */
export declare const Form: (attributes?: FormElementAttributes, children?: VNodeChildren) => VNode<"form">;
/**
 * Type-safe label element
 * The 'for' attribute is handled automatically (use 'htmlFor' in attributes)
 */
export declare const Label: (attributes?: LabelElementAttributes, children?: VNodeChildren) => VNode<"label">;
/**
 * Type-safe textarea element
 */
export declare const TextArea: (attributes?: TextAreaElementAttributes, children?: VNodeChildren) => VNode<"textarea">;
/**
 * Type-safe select element
 */
export declare const Select: (attributes?: SelectElementAttributes, children?: VNodeChildren) => VNode<"select">;
/**
 * Type-safe option element
 */
export declare const Option: (attributes?: OptionElementAttributes, children?: VNodeChildren) => VNode<"option">;
/**
 * Type-safe button element
 */
export declare const Button: (attributes?: ButtonElementAttributes, children?: VNodeChildren) => VNode<"button">;
/**
 * Type-safe fieldset element
 */
export declare const Fieldset: (attributes?: AttributesForElement<"fieldset">, children?: VNodeChildren) => VNode<"fieldset">;
/**
 * Type-safe legend element
 */
export declare const Legend: (attributes?: AttributesForElement<"legend">, children?: VNodeChildren) => VNode<"legend">;
/**
 * Type-safe optgroup element
 */
export declare const OptGroup: (attributes?: AttributesForElement<"optgroup"> & {
    label?: string;
}, children?: VNodeChildren) => VNode<"optgroup">;
/**
 * Type-safe datalist element
 */
export declare const DataList: (attributes?: AttributesForElement<"datalist">, children?: VNodeChildren) => VNode<"datalist">;
/**
 * Type-safe progress element
 */
export declare const Progress: (attributes?: AttributesForElement<"progress"> & {
    value?: number;
    max?: number;
}, children?: VNodeChildren) => VNode<"progress">;
/**
 * Type-safe meter element
 */
export declare const Meter: (attributes?: AttributesForElement<"meter"> & {
    value?: number;
    min?: number;
    max?: number;
    low?: number;
    high?: number;
    optimum?: number;
}, children?: VNodeChildren) => VNode<"meter">;
