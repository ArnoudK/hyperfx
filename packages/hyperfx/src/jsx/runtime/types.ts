import { Signal } from "../../reactive/signal";
import { ComputedSignal } from "../../reactive/state";
import { Prettify } from "../../tools/type_utils";
import { IntrinsicElements as BaseIntrinsicElements } from "../types/index";

// JSX namespace for TypeScript
export namespace JSX {
  export type Element = JSXElement;
  export interface ElementChildrenAttribute {
    children: JSXChildren;
  }
  export type IntrinsicElements = BaseIntrinsicElements;
}

type NormalizedValue<T> = {
  isReactive: boolean;
  isFunction: boolean;
  getValue: () => T;
  subscribe?: (callback: (v: T) => void) => () => void;
};

// Core reactive prop type - allows unknown values to be reactive
export type ReactiveValue<T> = T | Signal<T> | (() => T);

// Specific reactive types for common use cases
export type ReactiveString = ReactiveValue<string>;
export type ReactiveNumber = ReactiveValue<number>;
export type ReactiveBoolean = ReactiveValue<boolean>;

import type { SSRNode } from "../../ssr/render";
type HTMLelementLike =
  | HTMLElement
  | DocumentFragment
  | Text
  | Comment
  | SSRNode
  | null
  | undefined;

  // Bridges to break circularity
  interface RecursiveSignal extends Signal<JSXElement> {}
  interface RecursiveComputed extends ComputedSignal<JSXElement> {}
  
  export type JSXElement =
    | HTMLelementLike
    | JSXElement[]
    | (() => JSXElement)
    | RecursiveSignal // Explanatory: Using the interface here breaks the circular reference loop
    | RecursiveComputed;

export type JSXChildPrimitive = string | number | boolean | null | undefined;

// JSX children types
export type JSXChild = Prettify<
  | JSXElement
  | JSXChildPrimitive
  | Signal<JSXElement | JSXChildPrimitive>
  | (() => JSXElement)
  | (() => JSXElement[])
  | ComputedSignal<JSXElement | JSXChildPrimitive>
>;

export type JSXChildren = JSXChild | JSXChild[];

// Event handler types (these should NOT be reactive)
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

// Component props type
export type ComponentProps<P = {}> = P & {
  children?: JSXChildren;
  key?: string | number;
};

// Function component type
export type FunctionComponent<P extends ComponentProps = ComponentProps> = (props: P) => JSXElement;

// Re-export for backwards compatibility
export type { NormalizedValue };
