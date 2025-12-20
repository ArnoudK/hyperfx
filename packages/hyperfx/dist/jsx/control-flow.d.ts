import type { JSXElement, ReactiveValue } from "../jsx/jsx-runtime";
interface ForProps<T> {
    each: ReactiveValue<T[]>;
    children: (item: T, index: () => number) => JSXElement;
    fallback?: JSXElement;
}
export declare function For<T>(props: ForProps<T>): JSXElement;
export declare function Index<T>(props: {
    each: ReactiveValue<T[]>;
    children: (item: () => T, index: number) => JSXElement;
}): JSXElement;
export declare function Show(props: {
    when: any;
    children: JSXElement | (() => JSXElement);
    fallback?: JSXElement | (() => JSXElement);
}): JSXElement;
export {};
