import type { Signal } from "../../reactive/signal";
import type { NormalizedValue } from "./types";
export declare function handleReactiveValue(element: HTMLElement, key: string, value: any, setter: (el: HTMLElement, val: any) => void): void;
/**
 * Add a subscription to an element's cleanup list
 */
export declare function addElementSubscription(element: Element, unsubscribe: () => void): void;
/**
 * Track a computed signal for an element so it can be destroyed on cleanup
 */
export declare function addElementComputedSignal(element: Element, computed: {
    destroy: () => void;
}): void;
/**
 * Clean up all signal subscriptions for an element
 */
export declare function cleanupElementSubscriptions(element: Element): void;
export declare function normalizeValue<T>(value: T | Signal<T> | (() => T)): NormalizedValue<T>;
