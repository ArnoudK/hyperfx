import type { ReactiveValue } from '../jsx-runtime';
export type { ReactiveValue } from '../jsx-runtime';
/** Reactive string value - can be static, signal, or computed */
export type ReactiveString = ReactiveValue<string>;
/** Reactive number value - can be static, signal, or computed */
export type ReactiveNumber = ReactiveValue<number>;
/** Reactive boolean value - can be static, signal, or computed */
export type ReactiveBoolean = ReactiveValue<boolean>;
/** Reactive object value - can be static, signal, or computed */
export type ReactiveObject<T = Record<string, unknown>> = ReactiveValue<T>;
/** Union type for mixed static/reactive values */
export type MaybeReactive<T> = T | ReactiveValue<T>;
/** Extract the inner type from a reactive value */
export type UnwrapReactive<T> = T extends ReactiveValue<infer U> ? U : T;
/** Make all properties of an object potentially reactive */
export type ReactiveProps<T> = {
    [K in keyof T]: MaybeReactive<T[K]>;
};
/** Create a reactive version of a type with optional reactivity */
export type Reactive<T> = T | ReactiveValue<T>;
/** Type guard to check if a value is reactive */
export declare function isReactive(value: unknown): value is ReactiveValue<unknown>;
/** Type guard to check if a value is a reactive signal */
export declare function isSignal(value: unknown): value is ReactiveValue<unknown>;
