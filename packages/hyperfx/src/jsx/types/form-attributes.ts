import type { ReactiveString, ReactiveBoolean, ReactiveNumber } from './base';
import type { GlobalHTMLAttributes } from './global-attributes';

// ========================================
// FORM-ASSOCIATED ATTRIBUTES
// ========================================

export interface FormAssociatedAttributes {
  disabled?: ReactiveBoolean;
  form?: ReactiveString;
  name?: ReactiveString;
}

// ========================================
// FORM ELEMENTS
// ========================================

export interface ButtonHTMLAttributes extends GlobalHTMLAttributes, FormAssociatedAttributes {
  autofocus?: ReactiveBoolean;
  formaction?: ReactiveString;
  formenctype?: ReactiveString;
  formmethod?: ReactiveString;
  formnovalidate?: ReactiveBoolean;
  formtarget?: ReactiveString;
  type?: 'submit' | 'reset' | 'button' | ReactiveString;
  value?: ReactiveString;
}

export interface FormHTMLAttributes extends GlobalHTMLAttributes {
  acceptCharset?: ReactiveString;
  action?: ReactiveString;
  autocomplete?: ReactiveString;
  enctype?: ReactiveString;
  method?: ReactiveString;
  name?: ReactiveString;
  novalidate?: ReactiveBoolean;
  target?: ReactiveString;
  rel?: ReactiveString;
}

export interface InputHTMLAttributes extends GlobalHTMLAttributes, FormAssociatedAttributes {
  accept?: ReactiveString;
  alt?: ReactiveString;
  autocomplete?: ReactiveString;
  autofocus?: ReactiveBoolean;
  capture?: ReactiveBoolean | ReactiveString;
  checked?: ReactiveBoolean;
  dirname?: ReactiveString;
  formaction?: ReactiveString;
  formenctype?: ReactiveString;
  formmethod?: ReactiveString;
  formnovalidate?: ReactiveBoolean;
  formtarget?: ReactiveString;
  height?: ReactiveNumber | ReactiveString;
  list?: ReactiveString;
  max?: ReactiveNumber | ReactiveString;
  maxlength?: ReactiveNumber | ReactiveString;
  min?: ReactiveNumber | ReactiveString;
  minlength?: ReactiveNumber | ReactiveString;
  multiple?: ReactiveBoolean;
  pattern?: ReactiveString;
  placeholder?: ReactiveString;
  readonly?: ReactiveBoolean;
  required?: ReactiveBoolean;
  size?: ReactiveNumber | ReactiveString;
  src?: ReactiveString;
  step?: ReactiveNumber | ReactiveString;
  type?: InputType;
  value?: ReactiveString;
  width?: ReactiveNumber | ReactiveString;
}

export interface LabelHTMLAttributes extends GlobalHTMLAttributes {
  for?: ReactiveString;
  form?: ReactiveString;
}

export interface SelectHTMLAttributes extends GlobalHTMLAttributes, FormAssociatedAttributes {
  autocomplete?: ReactiveString;
  autofocus?: ReactiveBoolean;
  disabled?: ReactiveBoolean;
  multiple?: ReactiveBoolean;
  required?: ReactiveBoolean;
  size?: ReactiveNumber | ReactiveString;
  value?: ReactiveString;
}

export interface TextareaHTMLAttributes extends GlobalHTMLAttributes, FormAssociatedAttributes {
  autocomplete?: ReactiveString;
  autofocus?: ReactiveBoolean;
  cols?: ReactiveNumber | ReactiveString;
  dirname?: ReactiveString;
  disabled?: ReactiveBoolean;
  maxlength?: ReactiveNumber | ReactiveString;
  minlength?: ReactiveNumber | ReactiveString;
  placeholder?: ReactiveString;
  readonly?: ReactiveBoolean;
  required?: ReactiveBoolean;
  rows?: ReactiveNumber | ReactiveString;
  value?: ReactiveString;
  wrap?: 'hard' | 'soft' | ReactiveString;
}

export interface OptionHTMLAttributes extends GlobalHTMLAttributes {
  disabled?: ReactiveBoolean;
  label?: ReactiveString;
  selected?: ReactiveBoolean;
  value?: ReactiveString;
}

export interface OptgroupHTMLAttributes extends GlobalHTMLAttributes {
  disabled?: ReactiveBoolean;
  label?: ReactiveString;
}

// ========================================
// FORM VALIDATION & ADVANCED TYPES
// ========================================

export type InputType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

export type FormEncType =
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'text/plain';

export type FormMethod = 'get' | 'post' | 'dialog';

export type AutoComplete =
  | 'off'
  | 'on'
  | 'name'
  | 'honorific-prefix'
  | 'given-name'
  | 'additional-name'
  | 'family-name'
  | 'honorific-suffix'
  | 'nickname'
  | 'email'
  | 'username'
  | 'new-password'
  | 'current-password'
  | 'one-time-code'
  | 'organization-title'
  | 'organization'
  | 'street-address'
  | 'address-line1'
  | 'address-line2'
  | 'address-line3'
  | 'address-level4'
  | 'address-level3'
  | 'address-level2'
  | 'address-level1'
  | 'country'
  | 'country-name'
  | 'postal-code'
  | 'cc-name'
  | 'cc-given-name'
  | 'cc-additional-name'
  | 'cc-family-name'
  | 'cc-number'
  | 'cc-exp'
  | 'cc-exp-month'
  | 'cc-exp-year'
  | 'cc-csc'
  | 'cc-type'
  | 'transaction-currency'
  | 'transaction-amount'
  | 'language'
  | 'bday'
  | 'bday-day'
  | 'bday-month'
  | 'bday-year'
  | 'sex'
  | 'tel'
  | 'tel-country-code'
  | 'tel-national'
  | 'tel-area-code'
  | 'tel-local'
  | 'tel-extension'
  | 'impp'
  | 'url'
  | 'photo';

// ========================================
// OTHER FORM-RELATED ELEMENTS
// ========================================

export interface FieldsetHTMLAttributes extends GlobalHTMLAttributes, FormAssociatedAttributes {
  disabled?: ReactiveBoolean;
}

export interface LegendHTMLAttributes extends GlobalHTMLAttributes {}

export interface MeterHTMLAttributes extends GlobalHTMLAttributes {
  form?: ReactiveString;
  high?: ReactiveNumber | ReactiveString;
  low?: ReactiveNumber | ReactiveString;
  max?: ReactiveNumber | ReactiveString;
  min?: ReactiveNumber | ReactiveString;
  optimum?: ReactiveNumber | ReactiveString;
  value?: ReactiveString | ReadonlyArray<ReactiveString> | ReactiveNumber;
}

export interface OutputHTMLAttributes extends GlobalHTMLAttributes, FormAssociatedAttributes {
  for?: ReactiveString;
}

export interface ProgressHTMLAttributes extends GlobalHTMLAttributes {
  max?: ReactiveNumber | ReactiveString;
  value?: ReactiveString | ReadonlyArray<ReactiveString> | ReactiveNumber;
}

export interface DatalistHTMLAttributes extends GlobalHTMLAttributes {}