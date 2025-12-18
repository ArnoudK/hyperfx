import { ReactiveSignal } from "../reactive/state";
import type { JSXElement, ComponentProps } from "../jsx/jsx-runtime";
/**
 * Direct DOM Reactive Helpers for HyperFX
 *
 * These helpers work with actual DOM elements instead of VNodes,
 * providing reactive functionality with direct DOM manipulation.
 */
export declare function ReactiveText(initialValue: string): {
    node: Text;
    signal: ReactiveSignal<string>;
};
export declare function bindAttribute<T>(element: HTMLElement, attribute: string, signal: ReactiveSignal<T>): void;
export declare function bindStyle(element: HTMLElement, styleProperty: string, signal: ReactiveSignal<string | number>): void;
export declare function bindClass(element: HTMLElement, className: string, signal: ReactiveSignal<boolean>): void;
export declare function bindCSSVariable(element: HTMLElement, variableName: string, signal: ReactiveSignal<string | number>): void;
export declare function bindEvent(element: HTMLElement, eventType: string, handler: (event: Event) => void, enabledSignal?: ReactiveSignal<boolean>): void;
export declare function ReactiveList<T>(items: ReactiveSignal<T[]>, renderItem: (item: T, index: number) => JSXElement, container?: HTMLElement): {
    container: HTMLElement;
    update: () => void;
};
export declare function ReactiveIf(condition: ReactiveSignal<boolean>, renderTrue: () => JSXElement, renderFalse?: () => JSXElement, container?: HTMLElement): {
    container: HTMLElement;
    update: () => void;
};
export declare function bindTwoWay<T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(element: T, signal: ReactiveSignal<string>): {
    element: T;
    signal: ReactiveSignal<string>;
    destroy: () => void;
};
export declare function reactiveTemplate(strings: TemplateStringsArray, ...values: (ReactiveSignal<unknown> | unknown)[]): ReactiveSignal<string>;
export declare function batchDOMUpdates<T>(updates: (() => T)[]): T[];
export declare function debounceDOMUpdate<T extends (...args: unknown[]) => unknown>(fn: T, delay?: number): (...args: Parameters<T>) => void;
export declare function measureReactivePerformance<T>(name: string, fn: () => T, enabled?: boolean): T;
export declare function createReactiveComponent<P extends ComponentProps>(renderFn: (props: P, createReactive: <T>(initial: T) => ReactiveSignal<T>) => JSXElement): (props: P) => JSXElement;
export { bindAttribute as bindProp };
export { bindEvent as bindEventWithSignal };
export { ReactiveList as ReactiveElementList };
export { ReactiveIf as ReactiveConditional };
