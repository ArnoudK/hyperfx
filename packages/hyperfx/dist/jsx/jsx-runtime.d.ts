import type { Signal } from "../reactive/signal";
import { ComputedSignal } from "../reactive/state";
import { Prettify } from "../tools/type_utils";
/**
 * Execute multiple updates together to reduce DOM manipulation
 */
export declare function batchUpdates<T>(fn: () => T): T;
/**
 * Generate a unique node ID for client-side elements
 */
declare function createClientId(): string;
/**
 * Clean up all signal subscriptions for an element
 */
declare function cleanupElementSubscriptions(element: Element): void;
export type EventHandler<E extends Event = Event> = (event: E) => void;
export type JSXElement = HTMLElement | DocumentFragment | Text | Comment;
export type JSXChildPrimitive = string | number | boolean | null | undefined;
export type JSXChild = Prettify<JSXElement | JSXChildPrimitive | Signal<JSXElement | JSXChildPrimitive> | (() => JSXElement) | (() => JSXElement[]) | ComputedSignal<JSXElement | JSXChildPrimitive>>;
export type JSXChildren = JSXChild | JSXChild[];
export interface EventHandlers {
    onClick?: EventHandler<MouseEvent>;
    onInput?: EventHandler<InputEvent>;
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
export type ReactiveElementAttributes = Record<string, ReactiveValue<any>> & EventHandlers;
export type ComponentProps<P = {}> = P & {
    children?: JSXChildren;
    key?: string | number;
};
export type FunctionComponent<P extends ComponentProps = ComponentProps> = (props: P) => JSXElement;
export type ReactiveValue<T> = T | Signal<T> | (() => T);
export type ReactiveString = ReactiveValue<string>;
export type ReactiveNumber = ReactiveValue<number>;
export type ReactiveBoolean = ReactiveValue<boolean>;
/**
 * Start hydration mode with a map of existing nodes
 */
export declare function startHydration(map: Map<string, Element>): void;
/**
 * End hydration mode
 */
export declare function endHydration(): void;
export declare const FRAGMENT_TAG: unique symbol;
export declare function jsx(type: string | FunctionComponent<any> | typeof FRAGMENT_TAG, props: Record<string, any> | null, key?: string | number | null): JSXElement;
export declare const jsxs: typeof jsx;
export declare const jsxDEV: typeof jsx;
export declare function Fragment(props: {
    children?: JSXChildren;
}): DocumentFragment;
export declare function createJSXElement(type: string | FunctionComponent<any> | typeof FRAGMENT_TAG, props: Record<string, any> | null, ...children: JSXChildren[]): JSXElement;
export declare function template(strings: TemplateStringsArray, ...values: any[]): Signal<string>;
export declare function r<T>(fn: () => T): Signal<T>;
export { createJSXElement as createElement };
/**
 * Reset client node counter (useful for testing)
 */
export declare function resetClientNodeCounter(): void;
export { createClientId, cleanupElementSubscriptions };
export declare namespace JSX {
    type Element = JSXElement;
    interface ElementChildrenAttribute {
        children: JSXChildren;
    }
    type HTMLAttributes<T> = {
        [P in keyof T]?: P extends 'children' ? JSXChildren : ReactiveValue<T[P]>;
    } & {
        class?: string | ReactiveValue<string>;
        ref?: ((el: HTMLElement) => void) | {
            current: HTMLElement | null;
        };
        key?: string | number;
        onclick?: EventHandler<MouseEvent>;
        oninput?: EventHandler<InputEvent>;
        onchange?: EventHandler<Event>;
        onsubmit?: EventHandler<SubmitEvent>;
        onfocus?: EventHandler<FocusEvent>;
        onblur?: EventHandler<FocusEvent>;
        onkeydown?: EventHandler<KeyboardEvent>;
        onkeyup?: EventHandler<KeyboardEvent>;
        onkeypress?: EventHandler<KeyboardEvent>;
        onmouseenter?: EventHandler<MouseEvent>;
        onmouseleave?: EventHandler<MouseEvent>;
        onmousemove?: EventHandler<MouseEvent>;
        onmousedown?: EventHandler<MouseEvent>;
        onmouseup?: EventHandler<MouseEvent>;
        ontouchstart?: EventHandler<TouchEvent>;
        ontouchend?: EventHandler<TouchEvent>;
        ontouchmove?: EventHandler<TouchEvent>;
        onscroll?: EventHandler<Event>;
        onresize?: EventHandler<Event>;
        onload?: EventHandler<Event>;
        onerror?: EventHandler<Event>;
    };
    type IntrinsicElements = {
        [K in keyof HTMLElementTagNameMap]: Prettify<HTMLAttributes<Omit<HTMLElementTagNameMap[K], 'style' | 'onclick' | 'oninput' | 'onchange' | 'onsubmit' | 'onfocus' | 'onblur' | 'onkeydown' | 'onkeyup' | 'onkeypress' | 'onmouseenter' | 'onmouseleave' | 'onmousemove' | 'onmousedown' | 'onmouseup' | 'ontouchstart' | 'ontouchend' | 'ontouchmove' | 'onscroll' | 'onresize' | 'onload' | 'onerror'>> & {
            style?: ReactiveValue<string | Partial<CSSStyleDeclaration>>;
        }>;
    };
}
