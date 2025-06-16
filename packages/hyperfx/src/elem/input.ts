import type { 
  InputElementAttributes,
  FormElementAttributes,
  SelectElementAttributes,
  OptionElementAttributes,
  LabelElementAttributes,
  TextAreaElementAttributes,
  ButtonElementAttributes,
  AttributesForElement
} from "./attr";
import {
  el,
  VNode,
  VNodeChildren
} from "./elem";

/**
 * Type-safe input element using standardized attributes
 * Supports all HTML input types with proper validation
 */
export const Input = (
  attributes: InputElementAttributes = {} as InputElementAttributes
): VNode<"input"> => el("input", attributes);

/**
 * Type-safe form element
 */
export const Form = (
  attributes: FormElementAttributes = {} as FormElementAttributes,
  children?: VNodeChildren
): VNode<"form"> => el("form", attributes, children);

/**
 * Type-safe label element
 * The 'for' attribute is handled automatically (use 'htmlFor' in attributes)
 */
export const Label = (
  attributes: LabelElementAttributes = {} as LabelElementAttributes,
  children?: VNodeChildren
): VNode<"label"> => el("label", attributes, children);

/**
 * Type-safe textarea element
 */
export const TextArea = (
  attributes: TextAreaElementAttributes = {} as TextAreaElementAttributes,
  children?: VNodeChildren
): VNode<"textarea"> => {
  return el("textarea", attributes, children);
};

/**
 * Type-safe select element
 */
export const Select = (
  attributes: SelectElementAttributes = {} as SelectElementAttributes,
  children?: VNodeChildren
): VNode<"select"> => el("select", attributes, children);

/**
 * Type-safe option element
 */
export const Option = (
  attributes: OptionElementAttributes = {} as OptionElementAttributes,
  children?: VNodeChildren
): VNode<"option"> => el("option", attributes, children);

/**
 * Type-safe button element
 */
export const Button = (
  attributes: ButtonElementAttributes = {} as ButtonElementAttributes,
  children?: VNodeChildren
): VNode<"button"> => el("button", attributes, children);

/**
 * Type-safe fieldset element
 */
export const Fieldset = (
  attributes: AttributesForElement<'fieldset'> = {} as AttributesForElement<'fieldset'>,
  children?: VNodeChildren
): VNode<"fieldset"> => el("fieldset", attributes, children);

/**
 * Type-safe legend element
 */
export const Legend = (
  attributes: AttributesForElement<'legend'> = {} as AttributesForElement<'legend'>,
  children?: VNodeChildren
): VNode<"legend"> => el("legend", attributes, children);

/**
 * Type-safe optgroup element
 */
export const OptGroup = (
  attributes: AttributesForElement<'optgroup'> & { label?: string } = {} as AttributesForElement<'optgroup'> & { label?: string },
  children?: VNodeChildren
): VNode<"optgroup"> => el("optgroup", attributes, children);

/**
 * Type-safe datalist element
 */
export const DataList = (
  attributes: AttributesForElement<'datalist'> = {} as AttributesForElement<'datalist'>,
  children?: VNodeChildren
): VNode<"datalist"> => el("datalist", attributes, children);

/**
 * Type-safe progress element
 */
export const Progress = (
  attributes: AttributesForElement<'progress'> & { value?: number; max?: number } = {} as AttributesForElement<'progress'> & { value?: number; max?: number },
  children?: VNodeChildren
): VNode<"progress"> => el("progress", attributes, children);

/**
 * Type-safe meter element
 */
export const Meter = (
  attributes: AttributesForElement<'meter'> & { 
    value?: number; 
    min?: number; 
    max?: number; 
    low?: number; 
    high?: number; 
    optimum?: number 
  } = {} as AttributesForElement<'meter'> & { 
    value?: number; 
    min?: number; 
    max?: number; 
    low?: number; 
    high?: number; 
    optimum?: number 
  },
  children?: VNodeChildren
): VNode<"meter"> => el("meter", attributes, children);
