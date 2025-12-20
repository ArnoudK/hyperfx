import type { Signal } from "../reactive/signal";
import { ComputedSignal } from "../reactive/state";
import { Prettify } from "../tools/type_utils";
/**
 * Generate a unique node ID for client-side elements
 */
declare function createClientId(): string;
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
export { createClientId };
export declare namespace JSX {
    type Element = JSXElement;
    interface ElementChildrenAttribute {
        children: JSXChildren;
    }
    interface IntrinsicElements {
        div: ReactiveElementAttributes & {
            children?: JSXChildren;
        };
        span: ReactiveElementAttributes & {
            children?: JSXChildren;
        };
        p: ReactiveElementAttributes & {
            children?: JSXChildren;
        };
        h1: ReactiveElementAttributes & {
            children?: JSXChildren;
        };
        h2: ReactiveElementAttributes & {
            children?: JSXChildren;
        };
        h3: ReactiveElementAttributes & {
            children?: JSXChildren;
        };
        h4: ReactiveElementAttributes & {
            children?: JSXChildren;
        };
        h5: ReactiveElementAttributes & {
            children?: JSXChildren;
        };
        h6: ReactiveElementAttributes & {
            children?: JSXChildren;
        };
        button: ReactiveElementAttributes & {
            children?: JSXChildren;
        };
        input: ReactiveElementAttributes & {
            value?: ReactiveString;
            placeholder?: ReactiveString;
        };
        form: ReactiveElementAttributes & {
            children?: JSXChildren;
        };
        label: ReactiveElementAttributes & {
            children?: JSXChildren;
            for?: ReactiveString;
        };
        ul: ReactiveElementAttributes & {
            children?: JSXChildren;
        };
        li: ReactiveElementAttributes & {
            children?: JSXChildren;
        };
        a: ReactiveElementAttributes & {
            children?: JSXChildren;
            href?: ReactiveString;
        };
        img: ReactiveElementAttributes & {
            src?: ReactiveString;
            alt?: ReactiveString;
        };
        [key: string]: ReactiveElementAttributes & {
            children?: JSXChildren;
        };
    }
}
