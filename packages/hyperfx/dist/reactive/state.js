import { signal, computed, effect, startBatch, endBatch } from 'alien-signals';
/**
 * Create a reactive signal
 * @param initialValue The initial value of the signal
 * @returns A reactive signal
 */
export function createSignal(initialValue) {
    return signal(initialValue);
}
/**
 * Create a computed signal based on other signals
 * @param computation The computation function
 * @returns A computed signal
 */
export function createComputed(computation) {
    return computed(computation);
}
/**
 * Create an effect that runs when dependencies change
 * @param effectFn The effect function
 * @returns Cleanup function
 */
export function createEffect(effectFn) {
    return effect(effectFn);
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
     * Define a signal in the store
     * @param key The key for the signal
     * @param initialValue The initial value
     */
    defineSignal(key, initialValue) {
        if (this.signals.has(key)) {
            throw new Error(`Signal with key "${key}" already exists`);
        }
        const sig = signal(initialValue);
        this.signals.set(key, sig);
        return sig;
    }
    /**
     * Get a signal from the store
     * @param key The key for the signal
     */
    getSignal(key) {
        return this.signals.get(key);
    }
    /**
     * Define a computed signal in the store
     * @param key The key for the computed signal
     * @param computation The computation function
     */
    defineComputed(key, computation) {
        if (this.computedSignals.has(key)) {
            throw new Error(`Computed signal with key "${key}" already exists`);
        }
        const comp = computed(computation);
        this.computedSignals.set(key, comp);
        return comp;
    }
    /**
     * Get a computed signal from the store
     * @param key The key for the computed signal
     */
    getComputed(key) {
        return this.computedSignals.get(key);
    }
    /**
     * Add an effect to the store
     * @param effectFn The effect function
     */
    addEffect(effectFn) {
        const cleanup = effect(effectFn);
        this.effects.push(cleanup);
    }
    /**
     * Dispose all effects and clear the store
     */
    dispose() {
        this.effects.forEach(cleanup => cleanup());
        this.effects = [];
        this.signals.clear();
        this.computedSignals.clear();
    }
    /**
     * Get all signal keys
     */
    getSignalKeys() {
        return Array.from(this.signals.keys());
    }
    /**
     * Get all computed signal keys
     */
    getComputedKeys() {
        return Array.from(this.computedSignals.keys());
    }
    /**
     * Get a nested signal by path (e.g., ['user', 'profile', 'name'])
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
                obj[key] = this.defineSignal(path.slice(0, i + 1).join('.'), undefined);
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
        obj[lastKey] = this.defineSignal(path.join('.'), value);
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
    const sig = signal(initialValue);
    const getter = () => sig();
    const setter = (value) => {
        if (typeof value === 'function') {
            sig(value(sig()));
        }
        else {
            sig(value);
        }
    };
    return [getter, setter];
}
/**
 * Reactive computed hook for components
 */
export function useComputed(computation) {
    const comp = computed(computation);
    return () => comp();
}
/**
 * Effect hook for components
 */
export function useEffect(effectFn, deps) {
    if (deps && deps.length > 0) {
        // Create a computed that tracks dependencies
        const depsComputed = computed(() => deps.map(dep => dep()));
        return effect(() => {
            // Access the computed to track its dependencies
            depsComputed();
            return effectFn();
        });
    }
    else {
        return effect(effectFn);
    }
}
/**
 * Batch multiple signal updates
 */
export function batch(updateFn) {
    startBatch();
    try {
        updateFn();
    }
    finally {
        endBatch();
    }
}
/**
 * Utility to create derived state
 */
export function derive(signal, transform) {
    return computed(() => transform(signal()));
}
/**
 * Utility to combine multiple signals
 */
export function combine(...signals) {
    return computed(() => signals.map(sig => sig()));
}
//# sourceMappingURL=state.js.map