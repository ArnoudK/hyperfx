import type { JSXElement, ReactiveValue } from "../jsx/jsx-runtime";
import type { Signal } from "../reactive/signal";
interface ForProps<T> {
    each: ReactiveValue<T[]>;
    children: (item: T, index: Signal<number>) => JSXElement;
    fallback?: JSXElement;
}
export declare function For<T>(props: ForProps<T>): JSXElement;
export declare function Index<T>(props: {
    each: ReactiveValue<T[]>;
    children: (item: () => T, index: number) => JSXElement;
}): JSXElement;
export declare function Show<T>(props: {
    when: T;
    children: JSXElement | ((data: T) => JSXElement);
    fallback?: JSXElement | (() => JSXElement);
}): JSXElement;
/**
 * ErrorBoundary component for catching and handling errors
 * Can run an Effect when an error occurs
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error) => <div>Error: {error.message}</div>}
 *   onError={(error) => Effect.sync(() => console.error(error))}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export declare function ErrorBoundary(props: {
    fallback: (error: unknown) => JSXElement;
    onError?: (error: unknown) => void;
    children: JSXElement;
}): JSXElement;
export {};
