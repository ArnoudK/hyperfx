/**
 * Type-safe element creation helpers demonstrating improved type safety
 */

import type {
  InputAttributes,
  FormAttributes,
  LinkAttributes as AnchorAttributes,
  // ImageAttributes, // Removed as it's not defined in attr.ts
  TableAttributes,
  ButtonAttributes,
  TextAreaAttributes,
  SelectAttributes,
  OptionAttributes,
  LabelAttributes,
  VideoAudioAttributes as VideoAttributes,
  VideoAudioAttributes as AudioAttributes,
  IFrameAttributes as IframeAttributes,
  AttributesForElement,
} from "./attr";
import { el, VNode, VNodeChildren } from "./elem";

/**
 * Create a type-safe input element
 * @param attributes Input-specific attributes with validation
 * @returns VNode<"input">
 */
export const TypedInput = (
  attributes: InputAttributes = {} as InputAttributes
): VNode<"input"> => el("input", attributes as AttributesForElement<"input">);

/**
 * Create a type-safe form element
 * @param attributes Form-specific attributes
 * @param children Form child elements
 * @returns VNode<"form">
 */
export const TypedForm = (
  attributes: FormAttributes = {} as FormAttributes,
  children?: VNodeChildren
): VNode<"form"> => el("form", attributes as AttributesForElement<"form">, children);

/**
 * Create a type-safe anchor (link) element
 * @param attributes Link-specific attributes
 * @param children Link content
 * @returns VNode<"a">
 */
export const TypedA = (
  attributes: AnchorAttributes = {} as AnchorAttributes,
  children?: VNodeChildren
): VNode<"a"> => el("a", attributes as AttributesForElement<"a">, children);

/**
 * Create a type-safe image element
 * @param attributes Image-specific attributes with required src and alt
 * @returns VNode<"img">
 */
export const TypedImg = (
  attributes: AttributesForElement<"img"> = {} as AttributesForElement<"img">
): VNode<"img"> => el("img", attributes);

/**
 * Create a type-safe table element
 * @param attributes Table-specific attributes
 * @param children Table rows and content
 * @returns VNode<"table">
 */
export const TypedTable = (
  attributes: TableAttributes = {} as TableAttributes,
  children?: VNodeChildren
): VNode<"table"> => el("table", attributes as AttributesForElement<"table">, children);

/**
 * Create a type-safe table row element
 * @param attributes Table row attributes
 * @param children Table cells
 * @returns VNode<"tr">
 */
export const TypedTr = (
  attributes: AttributesForElement<"tr"> = {} as AttributesForElement<"tr">,
  children?: VNodeChildren
): VNode<"tr"> => el("tr", attributes, children);

/**
 * Create a type-safe table cell element
 * @param attributes Table cell attributes
 * @param children Cell content
 * @returns VNode<"td">
 */
export const TypedTd = (
  attributes: AttributesForElement<"td"> = {} as AttributesForElement<"td">,
  children?: VNodeChildren
): VNode<"td"> => el("td", attributes, children);

/**
 * Create a type-safe table header cell element
 * @param attributes Table header cell attributes
 * @param children Header content
 * @returns VNode<"th">
 */
export const TypedTh = (
  attributes: AttributesForElement<"th"> = {} as AttributesForElement<"th">,
  children?: VNodeChildren
): VNode<"th"> => el("th", attributes, children);

/**
 * Create a type-safe button element
 * @param attributes Button attributes
 * @param children Button content
 * @returns VNode<"button">
 */
export const TypedButton = (
  attributes: ButtonAttributes = {} as ButtonAttributes,
  children?: VNodeChildren
): VNode<"button"> => el("button", attributes as AttributesForElement<"button">, children);

/**
 * Create a type-safe textarea element
 * @param attributes Textarea attributes
 * @param children Text content
 * @returns VNode<"textarea">
 */
export const TypedTextArea = (
  attributes: TextAreaAttributes = {} as TextAreaAttributes,
  children?: VNodeChildren
): VNode<"textarea"> => el("textarea", attributes as AttributesForElement<"textarea">, children);

/**
 * Create a type-safe select element
 * @param attributes Select attributes
 * @param children Option elements
 * @returns VNode<"select">
 */
export const TypedSelect = (
  attributes: SelectAttributes = {} as SelectAttributes,
  children?: VNodeChildren
): VNode<"select"> => el("select", attributes as AttributesForElement<"select">, children);

/**
 * Create a type-safe option element
 * @param attributes Option attributes
 * @param children Option text
 * @returns VNode<"option">
 */
export const TypedOption = (
  attributes: OptionAttributes = {} as OptionAttributes,
  children?: VNodeChildren
): VNode<"option"> => el("option", attributes as AttributesForElement<"option">, children);

/**
 * Create a type-safe label element
 * @param attributes Label attributes
 * @param children Label content
 * @returns VNode<"label">
 */
export const TypedLabel = (
  attributes: LabelAttributes = {} as LabelAttributes,
  children?: VNodeChildren
): VNode<"label"> => el("label", attributes as AttributesForElement<"label">, children);

/**
 * Create a type-safe video element
 * @param attributes Video attributes
 * @param children Video content/sources
 * @returns VNode<"video">
 */
export const TypedVideo = (
  attributes: VideoAttributes = {} as VideoAttributes,
  children?: VNodeChildren
): VNode<"video"> => el("video", attributes as AttributesForElement<"video">, children);

/**
 * Create a type-safe audio element
 * @param attributes Audio attributes
 * @param children Audio content/sources
 * @returns VNode<"audio">
 */
export const TypedAudio = (
  attributes: AudioAttributes = {} as AudioAttributes,
  children?: VNodeChildren
): VNode<"audio"> => el("audio", attributes as AttributesForElement<"audio">, children);

/**
 * Create a type-safe iframe element
 * @param attributes IFrame attributes
 * @returns VNode<"iframe">
 */
export const TypedIframe = (
  attributes: IframeAttributes = {} as IframeAttributes
): VNode<"iframe"> => el("iframe", attributes as AttributesForElement<"iframe">);
