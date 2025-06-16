/**
 * Type-safe element creation helpers demonstrating improved type safety
 */
import type { InputAttributes, FormAttributes, LinkAttributes as AnchorAttributes, TableAttributes, ButtonAttributes, TextAreaAttributes, SelectAttributes, OptionAttributes, LabelAttributes, VideoAudioAttributes as VideoAttributes, VideoAudioAttributes as AudioAttributes, IFrameAttributes as IframeAttributes, AttributesForElement } from "./attr";
import { VNode, VNodeChildren } from "./elem";
/**
 * Create a type-safe input element
 * @param attributes Input-specific attributes with validation
 * @returns VNode<"input">
 */
export declare const TypedInput: (attributes?: InputAttributes) => VNode<"input">;
/**
 * Create a type-safe form element
 * @param attributes Form-specific attributes
 * @param children Form child elements
 * @returns VNode<"form">
 */
export declare const TypedForm: (attributes?: FormAttributes, children?: VNodeChildren) => VNode<"form">;
/**
 * Create a type-safe anchor (link) element
 * @param attributes Link-specific attributes
 * @param children Link content
 * @returns VNode<"a">
 */
export declare const TypedA: (attributes?: AnchorAttributes, children?: VNodeChildren) => VNode<"a">;
/**
 * Create a type-safe image element
 * @param attributes Image-specific attributes with required src and alt
 * @returns VNode<"img">
 */
export declare const TypedImg: (attributes?: AttributesForElement<"img">) => VNode<"img">;
/**
 * Create a type-safe table element
 * @param attributes Table-specific attributes
 * @param children Table rows and content
 * @returns VNode<"table">
 */
export declare const TypedTable: (attributes?: TableAttributes, children?: VNodeChildren) => VNode<"table">;
/**
 * Create a type-safe table row element
 * @param attributes Table row attributes
 * @param children Table cells
 * @returns VNode<"tr">
 */
export declare const TypedTr: (attributes?: AttributesForElement<"tr">, children?: VNodeChildren) => VNode<"tr">;
/**
 * Create a type-safe table cell element
 * @param attributes Table cell attributes
 * @param children Cell content
 * @returns VNode<"td">
 */
export declare const TypedTd: (attributes?: AttributesForElement<"td">, children?: VNodeChildren) => VNode<"td">;
/**
 * Create a type-safe table header cell element
 * @param attributes Table header cell attributes
 * @param children Header content
 * @returns VNode<"th">
 */
export declare const TypedTh: (attributes?: AttributesForElement<"th">, children?: VNodeChildren) => VNode<"th">;
/**
 * Create a type-safe button element
 * @param attributes Button attributes
 * @param children Button content
 * @returns VNode<"button">
 */
export declare const TypedButton: (attributes?: ButtonAttributes, children?: VNodeChildren) => VNode<"button">;
/**
 * Create a type-safe textarea element
 * @param attributes Textarea attributes
 * @param children Text content
 * @returns VNode<"textarea">
 */
export declare const TypedTextArea: (attributes?: TextAreaAttributes, children?: VNodeChildren) => VNode<"textarea">;
/**
 * Create a type-safe select element
 * @param attributes Select attributes
 * @param children Option elements
 * @returns VNode<"select">
 */
export declare const TypedSelect: (attributes?: SelectAttributes, children?: VNodeChildren) => VNode<"select">;
/**
 * Create a type-safe option element
 * @param attributes Option attributes
 * @param children Option text
 * @returns VNode<"option">
 */
export declare const TypedOption: (attributes?: OptionAttributes, children?: VNodeChildren) => VNode<"option">;
/**
 * Create a type-safe label element
 * @param attributes Label attributes
 * @param children Label content
 * @returns VNode<"label">
 */
export declare const TypedLabel: (attributes?: LabelAttributes, children?: VNodeChildren) => VNode<"label">;
/**
 * Create a type-safe video element
 * @param attributes Video attributes
 * @param children Video content/sources
 * @returns VNode<"video">
 */
export declare const TypedVideo: (attributes?: VideoAttributes, children?: VNodeChildren) => VNode<"video">;
/**
 * Create a type-safe audio element
 * @param attributes Audio attributes
 * @param children Audio content/sources
 * @returns VNode<"audio">
 */
export declare const TypedAudio: (attributes?: AudioAttributes, children?: VNodeChildren) => VNode<"audio">;
/**
 * Create a type-safe iframe element
 * @param attributes IFrame attributes
 * @returns VNode<"iframe">
 */
export declare const TypedIframe: (attributes?: IframeAttributes) => VNode<"iframe">;
