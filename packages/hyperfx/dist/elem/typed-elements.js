/**
 * Type-safe element creation helpers demonstrating improved type safety
 */
import { el } from "./elem";
/**
 * Create a type-safe input element
 * @param attributes Input-specific attributes with validation
 * @returns VNode<"input">
 */
export const TypedInput = (attributes = {}) => el("input", attributes);
/**
 * Create a type-safe form element
 * @param attributes Form-specific attributes
 * @param children Form child elements
 * @returns VNode<"form">
 */
export const TypedForm = (attributes = {}, children) => el("form", attributes, children);
/**
 * Create a type-safe anchor (link) element
 * @param attributes Link-specific attributes
 * @param children Link content
 * @returns VNode<"a">
 */
export const TypedA = (attributes = {}, children) => el("a", attributes, children);
/**
 * Create a type-safe image element
 * @param attributes Image-specific attributes with required src and alt
 * @returns VNode<"img">
 */
export const TypedImg = (attributes = {}) => el("img", attributes);
/**
 * Create a type-safe table element
 * @param attributes Table-specific attributes
 * @param children Table rows and content
 * @returns VNode<"table">
 */
export const TypedTable = (attributes = {}, children) => el("table", attributes, children);
/**
 * Create a type-safe table row element
 * @param attributes Table row attributes
 * @param children Table cells
 * @returns VNode<"tr">
 */
export const TypedTr = (attributes = {}, children) => el("tr", attributes, children);
/**
 * Create a type-safe table cell element
 * @param attributes Table cell attributes
 * @param children Cell content
 * @returns VNode<"td">
 */
export const TypedTd = (attributes = {}, children) => el("td", attributes, children);
/**
 * Create a type-safe table header cell element
 * @param attributes Table header cell attributes
 * @param children Header content
 * @returns VNode<"th">
 */
export const TypedTh = (attributes = {}, children) => el("th", attributes, children);
/**
 * Create a type-safe button element
 * @param attributes Button attributes
 * @param children Button content
 * @returns VNode<"button">
 */
export const TypedButton = (attributes = {}, children) => el("button", attributes, children);
/**
 * Create a type-safe textarea element
 * @param attributes Textarea attributes
 * @param children Text content
 * @returns VNode<"textarea">
 */
export const TypedTextArea = (attributes = {}, children) => el("textarea", attributes, children);
/**
 * Create a type-safe select element
 * @param attributes Select attributes
 * @param children Option elements
 * @returns VNode<"select">
 */
export const TypedSelect = (attributes = {}, children) => el("select", attributes, children);
/**
 * Create a type-safe option element
 * @param attributes Option attributes
 * @param children Option text
 * @returns VNode<"option">
 */
export const TypedOption = (attributes = {}, children) => el("option", attributes, children);
/**
 * Create a type-safe label element
 * @param attributes Label attributes
 * @param children Label content
 * @returns VNode<"label">
 */
export const TypedLabel = (attributes = {}, children) => el("label", attributes, children);
/**
 * Create a type-safe video element
 * @param attributes Video attributes
 * @param children Video content/sources
 * @returns VNode<"video">
 */
export const TypedVideo = (attributes = {}, children) => el("video", attributes, children);
/**
 * Create a type-safe audio element
 * @param attributes Audio attributes
 * @param children Audio content/sources
 * @returns VNode<"audio">
 */
export const TypedAudio = (attributes = {}, children) => el("audio", attributes, children);
/**
 * Create a type-safe iframe element
 * @param attributes IFrame attributes
 * @returns VNode<"iframe">
 */
export const TypedIframe = (attributes = {}) => el("iframe", attributes);
//# sourceMappingURL=typed-elements.js.map