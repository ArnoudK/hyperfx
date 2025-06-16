/**
 * State management utilities using alien-signals
 */
/** Type for a reactive signal function */
export type ReactiveSignal<T> = {
    (): T;
    (value: T): void;
};
/** Type for a computed signal function */
export type ComputedSignal<T> = () => T;
/** Type for effect cleanup function */
export type EffectCleanup = () => void;
/**
 * Create a reactive signal
 * @param initialValue The initial value of the signal
 * @returns A reactive signal
 */
export declare function createSignal<T>(initialValue: T): ReactiveSignal<T>;
/**
 * Create a computed signal based on other signals
 * @param computation The computation function
 * @returns A computed signal
 */
export declare function createComputed<T>(computation: () => T): ComputedSignal<T>;
/**
 * Create an effect that runs when dependencies change
 * @param effectFn The effect function
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
     * Define a signal in the store
     * @param key The key for the signal
     * @param initialValue The initial value
     */
    defineSignal<T>(key: string, initialValue: T): ReactiveSignal<T>;
    /**
     * Get a signal from the store
     * @param key The key for the signal
     */
    getSignal<T>(key: string): ReactiveSignal<T> | undefined;
    /**
     * Define a computed signal in the store
     * @param key The key for the computed signal
     * @param computation The computation function
     */
    defineComputed<T>(key: string, computation: () => T): ComputedSignal<T>;
    /**
     * Get a computed signal from the store
     * @param key The key for the computed signal
     */
    getComputed<T>(key: string): ComputedSignal<T> | undefined;
    /**
     * Add an effect to the store
     * @param effectFn The effect function
     */
    addEffect(effectFn: () => void | (() => void)): void;
    /**
     * Dispose all effects and clear the store
     */
    dispose(): void;
    /**
     * Get all signal keys
     */
    getSignalKeys(): string[];
    /**
     * Get all computed signal keys
     */
    getComputedKeys(): string[];
    /**
     * Get a nested signal by path (e.g., ['user', 'profile', 'name'])
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
export declare function useState<T>(initialValue: T): [() => T, (value: T | ((prev: T) => T)) => void];
/**
 * Reactive computed hook for components
 */
export declare function useComputed<T>(computation: () => T): () => T;
/**
 * Effect hook for components
 */
export declare function useEffect(effectFn: () => void | (() => void), deps?: (() => any)[]): EffectCleanup;
/**
 * Batch multiple signal updates
 */
export declare function batch(updateFn: () => void): void;
/**
 * Utility to create derived state
 */
export declare function derive<T, R>(signal: ReactiveSignal<T>, transform: (value: T) => R): ComputedSignal<R>;
/**
 * Utility to combine multiple signals
 */
export declare function combine<T extends readonly unknown[]>(...signals: {
    readonly [K in keyof T]: ReactiveSignal<T[K]>;
}): ComputedSignal<T>;
