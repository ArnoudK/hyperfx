/**
 * Type-safe HTML attributes for hyperfx
 */

import { Prettify } from "../tools/type_utils";

// Base types
type Name = { name: string };
type Context = { content: string };

export type MetaAttribute = Name | Context;

/** See: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#lang */
type Lang = { lang: string };

export type TargetValues =
  | "_self"
  | "_blank"
  | "_parent"
  | "_top"
  | "_unfencedTop";

// Fixed typo: HtmlAtrribute -> HtmlAttribute
export type HtmlAttribute = Lang;

/** Boolean HTML attributes that can be present (true) or absent (false/undefined) */
type BooleanAttribute = boolean | "";

/** Numeric attributes that accept numbers or string representations */
type NumericAttribute = number | `${number}`;

/** 
 * ARIA attributes for accessibility (all required in base type)
 * See: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes
 */
export interface AriaAttributes {
  'aria-label': string;
  'aria-labelledby': string;
  'aria-describedby': string;
  'aria-expanded': "true" | "false";
  'aria-hidden': "true" | "false";
  'aria-live': "polite" | "assertive" | "off";
  'aria-atomic': "true" | "false";
  'aria-busy': "true" | "false";
  'aria-checked': "true" | "false" | "mixed";
  'aria-disabled': "true" | "false";
  'aria-grabbed': "true" | "false";
  'aria-haspopup': "true" | "false" | "menu" | "listbox" | "tree" | "grid" | "dialog";
  'aria-invalid': "true" | "false" | "grammar" | "spelling";
  'aria-pressed': "true" | "false" | "mixed";
  'aria-readonly': "true" | "false";
  'aria-required': "true" | "false";
  'aria-selected': "true" | "false";
  'aria-autocomplete': "none" | "inline" | "list" | "both";
  'aria-current': "page" | "step" | "location" | "date" | "time" | "true" | "false";
  'aria-orientation': "horizontal" | "vertical";
  'aria-sort': "ascending" | "descending" | "none" | "other";
  'aria-level': NumericAttribute;
  'aria-posinset': NumericAttribute;
  'aria-setsize': NumericAttribute;
  'aria-valuemax': NumericAttribute;
  'aria-valuemin': NumericAttribute;
  'aria-valuenow': NumericAttribute;
  'aria-valuetext': string;
}

/**
 * Role attribute with comprehensive values
 * See: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles
 */
export type RoleAttribute =
  | "alert" | "alertdialog" | "application" | "article" | "banner" | "button"
  | "cell" | "checkbox" | "columnheader" | "combobox" | "complementary"
  | "contentinfo" | "dialog" | "directory" | "document" | "feed" | "figure"
  | "form" | "grid" | "gridcell" | "group" | "heading" | "img" | "link"
  | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math"
  | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio"
  | "navigation" | "none" | "note" | "option" | "presentation" | "progressbar"
  | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader"
  | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton"
  | "status" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term"
  | "textbox" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid"
  | "treeitem";

/** 
 * Global HTML attributes (all required in base type)
 * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
 */
interface GlobalAttrs extends AriaAttributes {
  /** See https://webaim.org/techniques/keyboard/accesskey#spec */
  accesskey: string;
  autocapitalize: "none" | "off" | "sentences" | "on" | "words" | "characters";
  autofocus: BooleanAttribute;
  class: string;
  contenteditable: "true" | "false" | "plaintext-only" | "";
  /** Content direction */
  dir: "ltr" | "rtl" | "auto";
  draggable: "true" | "false";
  enterkeyhint: "enter" | "done" | "go" | "next" | "previous" | "search" | "send";
  exportparts: string;
  hidden: "" | "hidden" | "until-found" | BooleanAttribute;
  id: string;
  inert: BooleanAttribute;
  inputmode: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
  /** https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is */
  is: string;
  /** https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemid */
  itemid: string;
  /** https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop */
  itemprop: string;
  itemref: string;
  itemscope: BooleanAttribute;
  itemtype: string;
  lang: string;
  nonce: string;
  part: string;
  popover: "auto" | "manual" | "";
  role: RoleAttribute;
  slot: string;
  spellcheck: "true" | "false" | "";
  style: string;
  /** 
   * Tab index with more comprehensive options
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex 
   */
  tabindex: NumericAttribute;
  title: string;
  /** 
   * Prevent translation (such as Google translate). Should only be used for names
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate 
   */
  translate: "yes" | "no" | "";
  /** https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/virtualkeyboardpolicy */
  virtualkeyboardpolicy: "auto" | "manual" | "";

  /** Data attributes with type safety */
  [key: `data-${string}`]: string | number | boolean;

  /** Adding innerHTML to GlobalAttrs */
  innerHTML?: string;
}

export type GlobalAttr = Partial<GlobalAttrs>;

/**
 * Event handlers with proper typing
 */
export type EventHandlers = {
  [K in keyof HTMLElementEventMap as `on${K}`]?: (event: HTMLElementEventMap[K]) => void;
};

/**
 * Standard autocomplete tokens from HTML spec, for use in autocomplete attributes.
 * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
 * See: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
 */
export type AutocompleteStandard =
  | "on" | "off"
  | "name" | "honorific-prefix" | "given-name" | "additional-name" | "family-name" | "honorific-suffix"
  | "nickname" | "email" | "username" | "new-password" | "current-password"
  | "organization-title" | "organization"
  | "street-address" | "address-line1" | "address-line2" | "address-line3"
  | "address-level4" | "address-level3" | "address-level2" | "address-level1"
  | "country" | "country-name" | "postal-code" | "cc-name" | "cc-given-name" | "cc-additional-name"
  | "cc-family-name" | "cc-number" | "cc-exp" | "cc-exp-month" | "cc-exp-year" | "cc-csc" | "cc-type"
  | "transaction-currency" | "transaction-amount"
  | "language" | "bday" | "bday-day" | "bday-month" | "bday-year"
  | "sex" | "tel" | "tel-country-code" | "tel-national" | "tel-area-code" | "tel-local" | "tel-extension"
  | "impp" | "url" | "photo"
  | "one-time-code";

/**
 * Autocomplete attribute type for HTML elements.
 * Includes all standard tokens and allows custom string values for advanced autofill scenarios.
 * Example: "name email address" to autofill multiple fields.
 */
export type AutocompleteAttr = AutocompleteStandard | (string & {});

/**
 * Interface for the autocomplete attribute, to be reused by multiple attribute types.
 */
export interface WithAutocomplete {
  /**
   * Controls browser autofill. Use standard tokens or custom values for advanced scenarios.
   * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
   */
  autocomplete: AutocompleteAttr;
}

/**
 * Interface for the formenctype attribute, to be reused by multiple attribute types.
 * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/submit#attr-formenctype
 */
export interface WithFormEnctype {
  formenctype: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
}

/**
 * Form-specific attributes (all required in base type)
 */
export interface FormAttributes extends WithAutocomplete {
  action: string;
  method: "get" | "post" | "dialog";
  enctype: WithFormEnctype['formenctype'];
  target: TargetValues | string;
  novalidate: BooleanAttribute;
  name: string;
}

/**
 * Input-specific attributes (all required in base type)
 */
export interface InputAttributes extends WithAutocomplete, WithFormEnctype {
  accept: string;
  alt: string;
  capture: "user" | "environment" | BooleanAttribute;
  checked: BooleanAttribute;
  dirname: string;
  disabled: BooleanAttribute;
  form: string;
  formaction: string;
  formmethod: FormAttributes['method'];
  formnovalidate: BooleanAttribute;
  formtarget: TargetValues | string;
  height: NumericAttribute;
  list: string;
  max: string | number;
  maxlength: NumericAttribute;
  min: string | number;
  minlength: NumericAttribute;
  multiple: BooleanAttribute;
  name: string;
  pattern: string;
  placeholder: string;
  readonly: BooleanAttribute;
  required: BooleanAttribute;
  size: NumericAttribute;
  src: string;
  step: NumericAttribute | "any";
  type: "button" | "checkbox" | "color" | "date" | "datetime-local"
  | "email" | "file" | "hidden" | "image" | "month" | "number"
  | "password" | "radio" | "range" | "reset" | "search" | "submit"
  | "tel" | "text" | "time" | "url" | "week";
  value: string | number;
  width: NumericAttribute;
}

/**
 * Select-specific attributes (all required in base type)
 */
export interface SelectAttributes extends WithAutocomplete {
  disabled: BooleanAttribute;
  form: string;
  multiple: BooleanAttribute;
  name: string;
  required: BooleanAttribute;
  size: NumericAttribute;
}

/**
 * TextArea-specific attributes (all required in base type)
 */
export interface TextAreaAttributes extends WithAutocomplete {
  cols: NumericAttribute;
  dirname: string;
  disabled: BooleanAttribute;
  form: string;
  maxlength: NumericAttribute;
  minlength: NumericAttribute;
  name: string;
  placeholder: string;
  readonly: BooleanAttribute;
  required: BooleanAttribute;
  rows: NumericAttribute;
  wrap: "hard" | "soft" | "off";
  value: string | number; // Allow number for compatibility
}

/**
 * Link-specific attributes (all required in base type)
 */
export interface LinkAttributes {
  href: string;
  target: TargetValues | string;
  rel: "alternate" | "author" | "bookmark" | "external" | "help" | "license"
  | "next" | "nofollow" | "noreferrer" | "noopener" | "prev" | "search" | "tag"
  | string; // Allow custom rel values
  hreflang: string;
  type: string;
  download: string | BooleanAttribute;
  ping: string;
  referrerpolicy: "no-referrer" | "no-referrer-when-downgrade" | "origin"
  | "origin-when-cross-origin" | "same-origin" | "strict-origin"
  | "strict-origin-when-cross-origin" | "unsafe-url";
}

/**
 * Media-specific attributes (all required in base type)
 */
export interface MediaAttributes {
  src: string;
  alt: string; // For images
  width: NumericAttribute;
  height: NumericAttribute;
  loading: "eager" | "lazy";
  decoding: "sync" | "async" | "auto";
  crossorigin: "anonymous" | "use-credentials" | "";
  referrerpolicy: LinkAttributes['referrerpolicy'];
  sizes: string;
  srcset: string;
  usemap: string;
}

/**
 * Table-specific attributes (all required in base type)
 */
export interface TableAttributes {
  colspan: NumericAttribute;
  rowspan: NumericAttribute;
  headers: string;
  scope: "row" | "col" | "rowgroup" | "colgroup";
  abbr: string;
}

/**
 * Button-specific attributes (all required in base type)
 */
export interface ButtonAttributes {
  type: "button" | "submit" | "reset";
  disabled: BooleanAttribute;
  form: string;
  formaction: string;
  formenctype: FormAttributes['enctype'];
  formmethod: FormAttributes['method'];
  formnovalidate: BooleanAttribute;
  formtarget: TargetValues | string;
  name: string;
  value: string | number;
}

/**
 * Option-specific attributes (all required in base type)
 */
export interface OptionAttributes {
  disabled: BooleanAttribute;
  label: string;
  selected: BooleanAttribute;
  value: string | number;
}

/**
 * Label-specific attributes (all required in base type)
 */
export interface LabelAttributes {
  for: string; // Use 'for' directly - TypeScript allows reserved keywords as object keys
  form: string;
}

/**
 * Video/Audio-specific attributes (all required in base type)
 */
export interface VideoAudioAttributes {
  autoplay: BooleanAttribute;
  controls: BooleanAttribute;
  crossorigin: "anonymous" | "use-credentials" | "";
  loop: BooleanAttribute;
  muted: BooleanAttribute;
  preload: "none" | "metadata" | "auto" | "";
  src: string;
}

/**
 * IFrame-specific attributes (all required in base type)
 */
export interface IFrameAttributes {
  allow: string;
  allowfullscreen: BooleanAttribute;
  height: NumericAttribute;
  loading: "eager" | "lazy";
  name: string;
  referrerpolicy: LinkAttributes['referrerpolicy'];
  sandbox: string;
  src: string;
  srcdoc: string;
  width: NumericAttribute;
}

/**
 * Complete element attributes combining all specific types (using Partial for optional usage)
 * Note: Some attributes like 'type' have different meanings in different contexts
 */
export type ElementAttributes = Prettify<GlobalAttr & Partial<EventHandlers> & Partial<
  Omit<FormAttributes, 'type'> &
  Omit<InputAttributes, 'type'> &
  Omit<LinkAttributes, 'type'> &
  Omit<MediaAttributes, 'type'> &
  TableAttributes &
  Omit<ButtonAttributes, 'type'> &
  SelectAttributes &
  OptionAttributes &
  LabelAttributes &
  TextAreaAttributes &
  VideoAudioAttributes &
  IFrameAttributes
> & {
  // Allow type to be any of the valid values from different contexts
  type?: InputAttributes['type'] | ButtonAttributes['type'] | LinkAttributes['type'];
  innerHTML?: string; // Added innerHTML here as well for consistency 
}>;

/**
 * Utility type to get attributes for a specific HTML element (using Partial for optional usage)
 */
export type AttributesForElement<T extends keyof HTMLElementTagNameMap> =
  T extends 'input' ? InputElementAttributes :
  T extends 'form' ? FormElementAttributes :
  T extends 'a' ? LinkElementAttributes :
  T extends 'img' ? StrictImageAttributes :
  T extends 'video' | 'audio' ? VideoAudioElementAttributes :
  T extends 'button' ? ButtonElementAttributes :
  T extends 'select' ? SelectElementAttributes :
  T extends 'option' ? OptionElementAttributes :
  T extends 'label' ? LabelElementAttributes :
  T extends 'textarea' ? TextAreaElementAttributes :
  T extends 'iframe' ? IFrameElementAttributes :
  T extends 'td' | 'th' | 'table' | 'tr' | 'thead' | 'tbody' | 'tfoot' ? TableElementAttributes :
  ElementAttributes;

// Added specific element attribute types that were missing from the previous context provided.
export type InputElementAttributes = Prettify<GlobalAttr & Partial<EventHandlers> & Partial<InputAttributes>>;
export type FormElementAttributes = Prettify<GlobalAttr & Partial<EventHandlers> & Partial<FormAttributes>>;
export type LinkElementAttributes = Prettify<GlobalAttr & Partial<EventHandlers> & Partial<LinkAttributes>>;
export type MediaElementAttributes = Prettify<GlobalAttr & Partial<EventHandlers> & Partial<MediaAttributes>>;
export type TableElementAttributes = Prettify<GlobalAttr & Partial<EventHandlers> & Partial<TableAttributes>>;
export type ButtonElementAttributes = Prettify<GlobalAttr & Partial<EventHandlers> & Partial<ButtonAttributes>>;
export type SelectElementAttributes = Prettify<GlobalAttr & Partial<EventHandlers> & Partial<SelectAttributes>>;
export type OptionElementAttributes = Prettify<GlobalAttr & Partial<EventHandlers> & Partial<OptionAttributes>>;
export type LabelElementAttributes = Prettify<GlobalAttr & Partial<EventHandlers> & Partial<LabelAttributes>>;
export type TextAreaElementAttributes = Prettify<GlobalAttr & Partial<EventHandlers> & Partial<TextAreaAttributes>>;
export type VideoAudioElementAttributes = Prettify<GlobalAttr & Partial<EventHandlers> & Partial<VideoAudioAttributes>>;
export type IFrameElementAttributes = Prettify<GlobalAttr & Partial<EventHandlers> & Partial<IFrameAttributes>>;
export type StrictImageAttributes = Prettify<GlobalAttr & Partial<EventHandlers> & Partial<MediaAttributes> & { src: string; alt: string; }>;
export type StrictLinkAttributes = Prettify<GlobalAttr & Partial<EventHandlers> & Partial<LinkAttributes> & { href: string; }>;
export type StrictFormAttributes = Prettify<GlobalAttr & Partial<EventHandlers> & Partial<FormAttributes> & { action: string; }>;

/** 
* Set with boolean attributes 
*/
export const booleanAttrs = new Set([
  "allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "defer", "disabled", "formnovalidate", "hidden", "inert", "ismap", "itemscope", "loop", "multiple", "muted", "novalidate", "open", "readonly", "required", "reversed", "selected"
]);