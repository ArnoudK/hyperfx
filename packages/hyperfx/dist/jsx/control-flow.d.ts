import type { JSXElement, ReactiveValue } from "../jsx/jsx-runtime";
import type { Signal } from "../reactive/signal";
/**
 * For Component - Reactive list rendering
 *
 * Similar to SolidJS <For>, this component efficiently renders reactive arrays
 * with proper key-based reconciliation.
 */
interface ForProps<T> {
    each: ReactiveValue<T[]>;
    children: (item: T, index: () => number) => JSXElement;
    fallback?: JSXElement;
}
export declare function For<T>(props: ForProps<T>): JSXElement;
/**
 * Index Component - For rendering arrays with index-based access
 */
interface IndexProps<T> {
    each: ReactiveValue<T[]>;
    children: (item: () => T, index: number) => JSXElement;
    fallback?: JSXElement;
}
export declare function Index<T>(props: IndexProps<T>): JSXElement;
/**
 * Show Component - Conditional rendering
 */
interface ShowProps {
    when: Signal<boolean> | boolean | (() => boolean);
    children: JSXElement | JSXElement[] | (() => JSXElement | JSXElement[]);
    fallback?: JSXElement | JSXElement[] | (() => JSXElement | JSXElement[]);
}
export declare function Show(props: ShowProps): JSXElement;
/**
 * Switch/Match Components - Pattern matching
 */
interface SwitchProps {
    children: JSXElement | JSXElement[];
    fallback?: JSXElement;
}
interface MatchProps {
    when: Signal<boolean> | boolean | (() => boolean);
    children: JSXElement | JSXElement[] | (() => JSXElement | JSXElement[]);
}
export declare function Switch(props: SwitchProps): JSXElement;
export declare function Match(props: MatchProps): JSXElement;
export {};
