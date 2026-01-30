/**
 * Custom Signal Implementation for HyperFX
 *
 * A simple, synchronous signal system optimized for reactive DOM updates.
 *
 */
/**
 * Enable SSR mode for signal tracking
 */
export declare function enableSSRMode(): void;
/**
 * Disable SSR mode
 */
export declare function disableSSRMode(): void;
/**
 * Get all registered signals for SSR serialization
 */
export declare function getRegisteredSignals(): Map<string, Signal>;
/**
 * Register a signal with a key for SSR
 */
export declare function registerSignal(key: string, signal: Signal): void;
/**
 * Signal function that can be called to get/set values
 * Compatible with both callable API (signal()) and object API (signal.get())
 */
export type Signal<T = any> = {
    (): T;
    (value: T): T;
    get(): T;
    set(value: T): T;
    subscribe(callback: (value: T) => void): () => void;
    peek(): T;
    update(updater: (current: T) => T): T;
    subscriberCount: number;
    key?: string;
};
/**
 * Extended signal interface for computed signals
 */
interface ComputedSignal<T> extends Signal<T> {
    destroy(): void;
}
/**
 * Options for creating a signal
 */
export interface SignalOptions {
    key?: string;
}
/**
 * Create a new signal with callable API and object methods
 */
export declare function createSignal<T>(initialValue: T, options?: SignalOptions): Signal<T>;
/**
 * Create a computed signal that derives from other signals
 * Automatically tracks dependencies when accessed
 */
export declare function createComputed<T>(computeFn: () => T): ComputedSignal<T>;
/**
 * Create an effect that runs when signals change
 * Effects automatically track dependencies and re-subscribe when they change
 */
export declare function createEffect(effectFn: () => void | (() => void)): () => void;
/**
 * Batch multiple signal updates
 */
export declare function batch<T>(fn: () => T): T;
/**
 * Run a function without tracking signal accesses
 * Useful for reading signals inside effects without creating dependencies
 */
export declare function untrack<T>(fn: () => T): T;
/**
 * Utility to check if a value is a Signal
 */
export declare function isSignal(value: any): value is Signal;
/**
 * Get signal value, or return value if not a signal
 */
export declare function unwrapSignal<T>(value: T | Signal<T>): T;
/**
 * Legacy compatibility exports
 */
export { Signal as ReactiveSignal };
export { createSignal as signal };
export { createComputed as computed };
export { createComputed as createMemo };
