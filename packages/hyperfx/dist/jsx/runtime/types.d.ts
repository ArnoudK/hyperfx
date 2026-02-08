import { Signal } from "../../reactive/signal";
import { ComputedSignal } from "../../reactive/state";
import { Prettify } from "../../tools/type_utils";
import { IntrinsicElements as BaseIntrinsicElements } from "../types/index";
export declare namespace JSX {
    type Element = JSXElement;
    interface ElementChildrenAttribute {
        children: JSXChildren;
    }
    type IntrinsicElements = BaseIntrinsicElements;
}
type NormalizedValue<T> = {
    isReactive: boolean;
    isFunction: boolean;
    getValue: () => T;
    subscribe?: (callback: (v: T) => void) => () => void;
};
export type ReactiveValue<T> = T | Signal<T> | (() => T);
export type ReactiveString = ReactiveValue<string>;
export type ReactiveNumber = ReactiveValue<number>;
export type ReactiveBoolean = ReactiveValue<boolean>;
import type { SSRNode } from "../../ssr/render";
type HTMLelementLike = HTMLElement | DocumentFragment | Text | Comment | SSRNode | null | undefined;
interface RecursiveSignal extends Signal<JSXElement> {
}
interface RecursiveComputed extends ComputedSignal<JSXElement> {
}
export type JSXElement = HTMLelementLike | JSXElement[] | (() => JSXElement) | RecursiveSignal | RecursiveComputed;
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
export type { NormalizedValue };
