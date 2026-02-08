import { createSignal, isSignal, unwrapSignal, createComputed as signal_createComputed, createEffect as signal_createEffect, batch as signal_batch } from "./signal.js";
/** Re-export utilities */
export { createSignal, isSignal, unwrapSignal };
/**
 * Create a computed signal based on other signals
 * @param computation The computation function
 * @returns A computed signal
 */
export function createComputed(computation) {
    return signal_createComputed(computation);
}
/**
 * Create a memoized signal (alias for createComputed)
 * @param computation The computation function
 * @returns A computed signal
 */
export function createMemo(computation) {
    return signal_createComputed(computation);
}
/**
 * Create an signal_createEffect that runs when dependencies change
 * @param effectFn The signal_createEffect function
 * @returns Cleanup function
 */
export function createEffect(effectFn) {
    return signal_createEffect(effectFn);
}
/**
 * State store class for managing related state
 */
export class StateStore {
    constructor() {
        this.signals = new Map();
        this.computedSignals = new Map();
        this.effects = [];
    }
    /**
     * Define a signal_createSignal in the store
     * @param key The key for the signal_createSignal
     * @param initialValue The initial value
     */
    defineSignal(key, initialValue) {
        if (this.signals.has(key)) {
            throw new Error(`Signal with key "${key}" already exists`);
        }
        const sig = createSignal(initialValue);
        this.signals.set(key, sig);
        return sig;
    }
    /**
     * Get a signal_createSignal from the store
     * @param key The key for the signal_createSignal
     */
    getSignal(key) {
        return this.signals.get(key);
    }
    /**
     * Define a signal_createComputed signal_createSignal in the store
     * @param key The key for the signal_createComputed signal_createSignal
     * @param computation The computation function
     */
    defineComputed(key, computation) {
        if (this.computedSignals.has(key)) {
            throw new Error(`Computed signal_createSignal with key "${key}" already exists`);
        }
        const comp = signal_createComputed(computation);
        this.computedSignals.set(key, comp);
        return comp;
    }
    /**
     * Get a signal_createComputed signal_createSignal from the store
     * @param key The key for the signal_createComputed signal_createSignal
     */
    getComputed(key) {
        return this.computedSignals.get(key);
    }
    /**
     * Add an signal_createEffect to the store
     * @param effectFn The signal_createEffect function
     */
    addEffect(effectFn) {
        const cleanup = signal_createEffect(effectFn);
        this.effects.push(cleanup);
    }
    /**
     * Dispose all effects and clear the store
     */
    dispose() {
        this.effects.forEach(cleanup => { cleanup(); });
        this.effects = [];
        this.signals.clear();
        this.computedSignals.clear();
    }
    /**
     * Get all signal_createSignal keys
     */
    getSignalKeys() {
        return Array.from(this.signals.keys());
    }
    /**
     * Get all signal_createComputed signal_createSignal keys
     */
    getComputedKeys() {
        return Array.from(this.computedSignals.keys());
    }
    /**
     * Get a nested signal_createSignal by path (e.g., ['user', 'profile', 'name'])
     */
    getNestedSignal(root, path) {
        let current = root;
        for (const key of path) {
            if (key === undefined || key === null)
                return undefined;
            if (!current || typeof current !== 'function')
                return undefined;
            const value = current();
            if (typeof value === 'object' && value !== null && key in value) {
                current = value[key];
            }
            else {
                return undefined;
            }
        }
        return typeof current === 'function' ? current : undefined;
    }
    /**
     * Set a nested value by path (will create signals as needed)
     */
    setNestedSignal(root, path, value) {
        let current = root;
        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i];
            if (key === undefined || key === null)
                return;
            let obj = current();
            if (typeof obj !== 'object' || obj === null) {
                obj = {};
                current(obj);
            }
            if (!(key in obj) || typeof obj[key] !== 'function') {
                const newSig = createSignal(undefined);
                obj[key] = newSig;
                current(obj);
            }
            current = obj[key];
        }
        // Set the value at the final key
        let obj = current();
        const lastKey = path[path.length - 1];
        if (lastKey === undefined || lastKey === null)
            return;
        if (typeof obj !== 'object' || obj === null) {
            obj = {};
        }
        const finalSig = createSignal(value);
        obj[lastKey] = finalSig;
        current(obj);
    }
}
/**
 * Global state store instance
 */
export const globalStore = new StateStore();
/**
 * Create a scoped state store
 */
export function createStore() {
    return new StateStore();
}
/**
 * Reactive state hook for components
 */
export function useState(initialValue) {
    return createSignal(initialValue);
}
/**
 * Reactive signal_createComputed hook for components
 */
export function useComputed(computation) {
    const comp = signal_createComputed(computation);
    return () => comp();
}
/**
 * Memoized value hook for components (alias for useComputed)
 */
export function useMemo(computation) {
    const comp = signal_createComputed(computation);
    return () => comp();
}
/**
 * Effect hook for components
 */
export function useEffect(effectFn, deps) {
    if (deps && deps.length > 0) {
        // Create a signal_createComputed that tracks dependencies
        const depsComputed = signal_createComputed(() => deps.map(dep => dep()));
        return signal_createEffect(() => {
            // Access the signal_createComputed to track its dependencies
            depsComputed();
            return effectFn();
        });
    }
    else {
        return signal_createEffect(effectFn);
    }
}
/**
 * Batch multiple signal_createSignal updates
 */
export function batch(updateFn) {
    signal_batch(updateFn);
}
/**
 * Utility to create derived state
 */
export function derive(signal_createSignal, transform) {
    return signal_createComputed(() => transform(signal_createSignal()));
}
/**
 * Utility to combine multiple signals
 */
export function combine(...signals) {
    return signal_createComputed(() => signals.map(sig => sig()));
}
// Re-export types from elsewhere if needed
// export type { NormalizedValue } from "../jsx/runtime/types.js";
//# sourceMappingURL=state.js.map