import type { Signal } from "../reactive/signal";
import { ComputedSignal } from "../reactive/state";
import { Prettify } from "../tools/type_utils";
type VoidElements = 'area' | 'base' | 'br' | 'col' | 'embed' | 'hr' | 'img' | 'input' | 'link' | 'meta' | 'param' | 'source' | 'track' | 'wbr';
export declare namespace JSX {
    type Element = JSXElement;
    interface ElementChildrenAttribute {
        children: JSXChildren;
    }
    type IntrinsicElements = {
        [K in keyof HTMLElementTagNameMap]: (K extends 'a' ? import('./types/structural-attributes').AHTMLAttributes : K extends 'area' ? import('./types/media-attributes').AreaHTMLAttributes : K extends 'audio' ? import('./types/media-attributes').AudioHTMLAttributes : K extends 'base' ? import('./types/semantic-attributes').BaseHTMLAttributes : K extends 'blockquote' ? import('./types/structural-attributes').BlockquoteHTMLAttributes : K extends 'body' ? import('./types/semantic-attributes').BodyHTMLAttributes : K extends 'br' ? import('./types/structural-attributes').BrHTMLAttributes : K extends 'button' ? import('./types/form-attributes').ButtonHTMLAttributes : K extends 'canvas' ? import('./types/semantic-attributes').CanvasHTMLAttributes : K extends 'caption' ? import('./types/structural-attributes').CaptionHTMLAttributes : K extends 'cite' ? import('./types/structural-attributes').CiteHTMLAttributes : K extends 'code' ? import('./types/structural-attributes').CodeHTMLAttributes : K extends 'col' ? import('./types/structural-attributes').ColHTMLAttributes : K extends 'colgroup' ? import('./types/structural-attributes').ColgroupHTMLAttributes : K extends 'data' ? import('./types/semantic-attributes').DataHTMLAttributes : K extends 'datalist' ? import('./types/form-attributes').DatalistHTMLAttributes : K extends 'dd' ? import('./types/structural-attributes').DdHTMLAttributes : K extends 'del' ? import('./types/structural-attributes').DelHTMLAttributes : K extends 'details' ? import('./types/structural-attributes').DetailsHTMLAttributes : K extends 'dfn' ? import('./types/structural-attributes').DfnHTMLAttributes : K extends 'dialog' ? import('./types/structural-attributes').DialogHTMLAttributes : K extends 'div' ? import('./types/structural-attributes').DivHTMLAttributes : K extends 'dl' ? import('./types/structural-attributes').DlHTMLAttributes : K extends 'dt' ? import('./types/structural-attributes').DtHTMLAttributes : K extends 'em' ? import('./types/structural-attributes').EmHTMLAttributes : K extends 'embed' ? import('./types/media-attributes').EmbedHTMLAttributes : K extends 'fieldset' ? import('./types/form-attributes').FieldsetHTMLAttributes : K extends 'figcaption' ? import('./types/structural-attributes').FigcaptionHTMLAttributes : K extends 'figure' ? import('./types/structural-attributes').FigureHTMLAttributes : K extends 'footer' ? import('./types/semantic-attributes').FooterHTMLAttributes : K extends 'form' ? import('./types/form-attributes').FormHTMLAttributes : K extends 'h1' ? import('./types/semantic-attributes').H1HTMLAttributes : K extends 'h2' ? import('./types/semantic-attributes').H2HTMLAttributes : K extends 'h3' ? import('./types/semantic-attributes').H3HTMLAttributes : K extends 'h4' ? import('./types/semantic-attributes').H4HTMLAttributes : K extends 'h5' ? import('./types/semantic-attributes').H5HTMLAttributes : K extends 'h6' ? import('./types/semantic-attributes').H6HTMLAttributes : K extends 'head' ? import('./types/semantic-attributes').HeadHTMLAttributes : K extends 'header' ? import('./types/semantic-attributes').HeaderHTMLAttributes : K extends 'hgroup' ? import('./types/semantic-attributes').HgroupHTMLAttributes : K extends 'hr' ? import('./types/structural-attributes').HrHTMLAttributes : K extends 'html' ? import('./types/semantic-attributes').HtmlHTMLAttributes : K extends 'i' ? import('./types/structural-attributes').IHTMLAttributes : K extends 'iframe' ? import('./types/media-attributes').IframeHTMLAttributes : K extends 'img' ? import('./types/media-attributes').ImgHTMLAttributes : K extends 'input' ? import('./types/form-attributes').InputHTMLAttributes : K extends 'ins' ? import('./types/structural-attributes').InsHTMLAttributes : K extends 'kbd' ? import('./types/structural-attributes').KbdHTMLAttributes : K extends 'label' ? import('./types/form-attributes').LabelHTMLAttributes : K extends 'legend' ? import('./types/form-attributes').LegendHTMLAttributes : K extends 'li' ? import('./types/structural-attributes').LiHTMLAttributes : K extends 'link' ? import('./types/semantic-attributes').LinkHTMLAttributes : K extends 'main' ? import('./types/semantic-attributes').MainHTMLAttributes : K extends 'map' ? import('./types/media-attributes').MapHTMLAttributes : K extends 'mark' ? import('./types/structural-attributes').MarkHTMLAttributes : K extends 'menu' ? import('./types/semantic-attributes').MenuHTMLAttributes : K extends 'meta' ? import('./types/semantic-attributes').MetaHTMLAttributes : K extends 'meter' ? import('./types/form-attributes').MeterHTMLAttributes : K extends 'nav' ? import('./types/semantic-attributes').NavHTMLAttributes : K extends 'noscript' ? import('./types/semantic-attributes').NoscriptHTMLAttributes : K extends 'object' ? import('./types/media-attributes').ObjectHTMLAttributes : K extends 'ol' ? import('./types/structural-attributes').OlHTMLAttributes : K extends 'optgroup' ? import('./types/form-attributes').OptgroupHTMLAttributes : K extends 'option' ? import('./types/form-attributes').OptionHTMLAttributes : K extends 'output' ? import('./types/form-attributes').OutputHTMLAttributes : K extends 'p' ? import('./types/structural-attributes').PHTMLAttributes : K extends 'picture' ? import('./types/global-attributes').GlobalHTMLAttributes : K extends 'portal' ? import('./types/semantic-attributes').PortalHTMLAttributes : K extends 'pre' ? import('./types/structural-attributes').PreHTMLAttributes : K extends 'progress' ? import('./types/form-attributes').ProgressHTMLAttributes : K extends 'q' ? import('./types/structural-attributes').QHTMLAttributes : K extends 'rp' ? import('./types/semantic-attributes').RpHTMLAttributes : K extends 'rt' ? import('./types/semantic-attributes').RtHTMLAttributes : K extends 'ruby' ? import('./types/semantic-attributes').RubyHTMLAttributes : K extends 's' ? import('./types/structural-attributes').SHTMLAttributes : K extends 'samp' ? import('./types/structural-attributes').SampHTMLAttributes : K extends 'script' ? import('./types/semantic-attributes').ScriptHTMLAttributes : K extends 'section' ? import('./types/semantic-attributes').SectionHTMLAttributes : K extends 'select' ? import('./types/form-attributes').SelectHTMLAttributes : K extends 'slot' ? import('./types/semantic-attributes').SlotHTMLAttributes : K extends 'small' ? import('./types/structural-attributes').SmallHTMLAttributes : K extends 'source' ? import('./types/media-attributes').SourceHTMLAttributes : K extends 'span' ? import('./types/structural-attributes').SpanHTMLAttributes : K extends 'strong' ? import('./types/structural-attributes').StrongHTMLAttributes : K extends 'style' ? import('./types/semantic-attributes').StyleHTMLAttributes : K extends 'sub' ? import('./types/structural-attributes').SubHTMLAttributes : K extends 'summary' ? import('./types/structural-attributes').SummaryHTMLAttributes : K extends 'sup' ? import('./types/structural-attributes').SupHTMLAttributes : K extends 'table' ? import('./types/structural-attributes').TableHTMLAttributes : K extends 'tbody' ? import('./types/structural-attributes').TbodyHTMLAttributes : K extends 'td' ? import('./types/structural-attributes').TdHTMLAttributes : K extends 'template' ? import('./types/semantic-attributes').TemplateHTMLAttributes : K extends 'textarea' ? import('./types/form-attributes').TextareaHTMLAttributes : K extends 'tfoot' ? import('./types/structural-attributes').TfootHTMLAttributes : K extends 'th' ? import('./types/structural-attributes').ThHTMLAttributes : K extends 'thead' ? import('./types/structural-attributes').TheadHTMLAttributes : K extends 'time' ? import('./types/structural-attributes').TimeHTMLAttributes : K extends 'title' ? import('./types/semantic-attributes').TitleHTMLAttributes : K extends 'tr' ? import('./types/structural-attributes').TrHTMLAttributes : K extends 'track' ? import('./types/media-attributes').TrackHTMLAttributes : K extends 'u' ? import('./types/structural-attributes').UHTMLAttributes : K extends 'ul' ? import('./types/structural-attributes').UlHTMLAttributes : K extends 'var' ? import('./types/structural-attributes').VarHTMLAttributes : K extends 'video' ? import('./types/media-attributes').VideoHTMLAttributes : K extends 'wbr' ? import('./types/semantic-attributes').WbrHTMLAttributes : import('./types/global-attributes').GlobalHTMLAttributes) & (K extends VoidElements ? {} : {
            children?: JSXChildren;
        });
    };
}
/**
 * Execute multiple updates together to reduce DOM manipulation
 */
export declare function batchUpdates<T>(fn: () => T): T;
/**
 * Generate a unique node ID for client-side elements
 */
export declare function createClientId(): string;
/**
 * Clean up all signal subscriptions for an element
 */
export declare function cleanupElementSubscriptions(element: Element): void;
export type ReactiveValue<T> = T | Signal<T> | (() => T);
export type ReactiveString = ReactiveValue<string>;
export type ReactiveNumber = ReactiveValue<number>;
export type ReactiveBoolean = ReactiveValue<boolean>;
export type JSXElement = HTMLElement | DocumentFragment | Text | Comment;
export type JSXChildPrimitive = string | number | boolean | null | undefined;
export type JSXChild = Prettify<JSXElement | JSXChildPrimitive | Signal<JSXElement | JSXChildPrimitive> | (() => JSXElement) | (() => JSXElement[]) | ComputedSignal<JSXElement | JSXChildPrimitive>>;
export type JSXChildren = JSXChild | JSXChild[];
export type EventHandler<E extends Event = Event> = (event: E) => void;
export interface EventHandlers {
    onclick?: EventHandler<MouseEvent>;
    oninput?: EventHandler<InputEvent>;
    onChange?: EventHandler<Event>;
    onSubmit?: EventHandler<SubmitEvent>;
    onFocus?: EventHandler<FocusEvent>;
    onBlur?: EventHandler<FocusEvent>;
    onKeyDown?: EventHandler<KeyboardEvent>;
    onKeyUp?: EventHandler<KeyboardEvent>;
    onKeyPress?: EventHandler<KeyboardEvent>;
    onMouseEnter?: EventHandler<MouseEvent>;
    onMouseLeave?: EventHandler<MouseEvent>;
    onMouseMove?: EventHandler<MouseEvent>;
    onMouseDown?: EventHandler<MouseEvent>;
    onMouseUp?: EventHandler<MouseEvent>;
    onTouchStart?: EventHandler<TouchEvent>;
    onTouchEnd?: EventHandler<TouchEvent>;
    onTouchMove?: EventHandler<TouchEvent>;
    onScroll?: EventHandler<Event>;
    onResize?: EventHandler<Event>;
    onLoad?: EventHandler<Event>;
    onError?: EventHandler<Event>;
}
export type ComponentProps<P = {}> = P & {
    children?: JSXChildren;
    key?: string | number;
};
export type FunctionComponent<P extends ComponentProps = ComponentProps> = (props: P) => JSXElement;
/**
 * Start hydration mode with a map of existing nodes
 */
export declare function startHydration(map: Map<string, Element>): void;
/**
 * End hydration mode
 */
export declare function endHydration(): void;
export declare const FRAGMENT_TAG: unique symbol;
export declare function Fragment(props: {
    children?: JSXChildren;
}): DocumentFragment;
export declare function jsx(type: string | FunctionComponent<any> | typeof FRAGMENT_TAG, props: Record<string, any> | null, key?: string | number | null): JSXElement;
export declare const jsxs: typeof jsx;
export declare const jsxDEV: typeof jsx;
export declare function createJSXElement(type: string | FunctionComponent<any> | typeof FRAGMENT_TAG, props: Record<string, any> | null, ...children: JSXChildren[]): JSXElement;
export declare function template(strings: TemplateStringsArray, ...values: any[]): Signal<string>;
export declare function r<T>(fn: () => T): Signal<T>;
export { createJSXElement as createElement };
/**
 * Reset client node counter (useful for testing)
 */
export declare function resetClientNodeCounter(): void;
