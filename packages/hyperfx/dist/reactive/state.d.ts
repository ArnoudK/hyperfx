import { createSignal, isSignal, unwrapSignal, Signal, ReactiveSignal } from "./signal.js";
/**
 * State management utilities using custom Signal implementation
 */
/** Re-export types */
export type { Signal, ReactiveSignal };
/** Re-export utilities */
export { createSignal, isSignal, unwrapSignal };
/** Type for a computed signal */
export type ComputedSignal<T> = ReactiveSignal<T>;
/** Type for signal_createEffect cleanup function */
export type EffectCleanup = () => void;
/**
 * Create a computed signal based on other signals
 * @param computation The computation function
 * @returns A computed signal
 */
export declare function createComputed<T>(computation: () => T): ComputedSignal<T>;
/**
 * Create a memoized signal (alias for createComputed)
 * @param computation The computation function
 * @returns A computed signal
 */
export declare function createMemo<T>(computation: () => T): ComputedSignal<T>;
/**
 * Create an signal_createEffect that runs when dependencies change
 * @param effectFn The signal_createEffect function
 * @returns Cleanup function
 */
export declare function createEffect(effectFn: () => void | (() => void)): EffectCleanup;
/**
 * State store class for managing related state
 */
export declare class StateStore {
    private signals;
    private computedSignals;
    private effects;
    /**
     * Define a signal_createSignal in the store
     * @param key The key for the signal_createSignal
     * @param initialValue The initial value
     */
    defineSignal<T>(key: string, initialValue: T): ReactiveSignal<T>;
    /**
     * Get a signal_createSignal from the store
     * @param key The key for the signal_createSignal
     */
    getSignal<T>(key: string): ReactiveSignal<T> | undefined;
    /**
     * Define a signal_createComputed signal_createSignal in the store
     * @param key The key for the signal_createComputed signal_createSignal
     * @param computation The computation function
     */
    defineComputed<T>(key: string, computation: () => T): ComputedSignal<T>;
    /**
     * Get a signal_createComputed signal_createSignal from the store
     * @param key The key for the signal_createComputed signal_createSignal
     */
    getComputed<T>(key: string): ComputedSignal<T> | undefined;
    /**
     * Add an signal_createEffect to the store
     * @param effectFn The signal_createEffect function
     */
    addEffect(effectFn: () => void | (() => void)): void;
    /**
     * Dispose all effects and clear the store
     */
    dispose(): void;
    /**
     * Get all signal_createSignal keys
     */
    getSignalKeys(): string[];
    /**
     * Get all signal_createComputed signal_createSignal keys
     */
    getComputedKeys(): string[];
    /**
     * Get a nested signal_createSignal by path (e.g., ['user', 'profile', 'name'])
     */
    getNestedSignal<T>(root: ReactiveSignal<any>, path: (string | number)[]): ReactiveSignal<T> | undefined;
    /**
     * Set a nested value by path (will create signals as needed)
     */
    setNestedSignal<T>(root: ReactiveSignal<any>, path: (string | number)[], value: T): void;
}
/**
 * Global state store instance
 */
export declare const globalStore: StateStore;
/**
 * Create a scoped state store
 */
export declare function createStore(): StateStore;
/**
 * Reactive state hook for components
 */
export declare function useState<T>(initialValue: T): Signal<T>;
/**
 * Reactive signal_createComputed hook for components
 */
export declare function useComputed<T>(computation: () => T): () => T;
/**
 * Memoized value hook for components (alias for useComputed)
 */
export declare function useMemo<T>(computation: () => T): () => T;
/**
 * Effect hook for components
 */
export declare function useEffect(effectFn: () => void | (() => void), deps?: (() => any)[]): EffectCleanup;
/**
 * Batch multiple signal_createSignal updates
 */
export declare function batch(updateFn: () => void): void;
/**
 * Utility to create derived state
 */
export declare function derive<T, R>(signal_createSignal: ReactiveSignal<T>, transform: (value: T) => R): ComputedSignal<R>;
/**
 * Utility to combine multiple signals
 */
export declare function combine<T extends readonly unknown[]>(...signals: {
    readonly [K in keyof T]: ReactiveSignal<T[K]>;
}): ComputedSignal<T>;
