import type { ReactiveValue } from '../jsx-runtime';

// Re-export for convenience
export type { ReactiveValue } from '../jsx-runtime';

// ========================================
// BASE REACTIVE TYPES
// ========================================

/** Reactive string value - can be static, signal, or computed */
export type ReactiveString = ReactiveValue<string>;

/** Reactive number value - can be static, signal, or computed */
export type ReactiveNumber = ReactiveValue<number>;

/** Reactive boolean value - can be static, signal, or computed */
export type ReactiveBoolean = ReactiveValue<boolean>;

/** Reactive object value - can be static, signal, or computed */
export type ReactiveObject<T = Record<string, unknown>> = ReactiveValue<T>;

// ========================================
// ADVANCED REACTIVE UTILITIES
// ========================================

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

// ========================================
// TYPE GUARDS & UTILITIES
// ========================================

/** Type guard to check if a value is reactive */
export function isReactive(value: unknown): value is ReactiveValue<unknown> {
  return typeof value === 'object' && value !== null && 'subscribe' in value;
}

/** Type guard to check if a value is a reactive signal */
export function isSignal(value: unknown): value is ReactiveValue<unknown> {
  return isReactive(value) && typeof (value as { subscribe?: unknown }).subscribe === 'function';
}
