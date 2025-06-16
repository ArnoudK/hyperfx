import { VNode } from '../elem/elem';
import { ReactiveSignal } from '../reactive/state';
import { JSXChildren, ComponentProps } from './jsx-runtime';
/**
 * Utility type to extract props from a component
 */
export type ComponentPropsOf<T> = T extends (props: infer P) => VNode ? P : never;
/**
 * Utility type to make all props optional except children
 */
export type OptionalProps<T> = Partial<T> & {
    children?: JSXChildren;
};
/**
 * Utility type for components that require children
 */
export type WithChildren<T = {}> = T & {
    children: JSXChildren;
};
/**
 * Utility type for components that explicitly don't accept children
 */
export type WithoutChildren<T = {}> = T & {
    children?: never;
};
/**
 * Utility type for components with a key prop
 */
export type WithKey<T = {}> = T & {
    key?: string | number;
};
/**
 * Utility type to make a prop reactive
 */
export type Reactive<T> = T | ReactiveSignal<T>;
/**
 * Utility type for reactive children that can be used in JSX
 */
export type ReactiveChildren = JSXChildren | ReactiveSignal<string> | ReactiveSignal<number> | ReactiveSignal<boolean> | ReactiveSignal<VNode> | ReactiveSignal<VNode[]>;
/**
 * Utility type to make all props of an object potentially reactive
 */
export type ReactiveProps<T> = {
    [K in keyof T]: Reactive<T[K]>;
};
/**
 * Type guard to check if a value is a VNode
 */
export declare function isVNode(value: unknown): value is VNode;
/**
 * Type guard to check if a value is valid JSX children
 */
export declare function isValidJSXChild(value: unknown): value is JSXChildren;
/**
 * Check if children contain any reactive signals
 */
export declare function hasReactiveChildren(children: JSXChildren): boolean;
/**
 * Utility type for event handler props
 */
export type EventHandlerProps<T extends keyof HTMLElementEventMap = keyof HTMLElementEventMap> = {
    [K in T as `on${Capitalize<K>}`]?: (event: HTMLElementEventMap[K]) => void;
};
/**
 * Utility type for a component that accepts ref
 */
export type WithRef<T, RefType = HTMLElement> = T & {
    ref?: (element: RefType) => void;
};
/**
 * Utility to create a strongly typed component
 */
export declare function defineComponent<P>(component: (props: ComponentProps<P>) => VNode): (props: ComponentProps<P>) => VNode;
