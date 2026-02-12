import { createSignal, createComputed, createEffect, Accessor, getSetter, isAccessor } from "./signal.js";
import { batchUpdates } from "../jsx/runtime/batching.js";
export { createComputed, createEffect };

/**
 * State management utilities using custom Signal implementation
 */

/** Type for effect cleanup function */
export type EffectCleanup = () => void;

/** Create a computed signal based on other signals (re-exported from ./signal.js) */

/** Effect creator re-exported from ./signal.js (no wrapper) */

/**
 * State store class for managing related state
 */
export class StateStore {
  private signals = new Map<string, Accessor<unknown>>();
  private Signals = new Map<string, Accessor<unknown>>();
  private effects: EffectCleanup[] = [];

  /**
   * Define a signal in the store
   * @param key The key for the signal
   * @param initialValue The initial value
   */
  defineSignal<T>(key: string, initialValue: T): Accessor<T> {
    if (this.signals.has(key)) {
      throw new Error(`Signal with key "${key}" already exists`);
    }

    const [sig] = createSignal(initialValue);
    this.signals.set(key, sig);
    return sig;
  }

  /**
   * Get a signal from the store
   * @param key The key for the signal
   */
  getSignal<T>(key: string): Accessor<T> | undefined {
    const signal = this.signals.get(key);
    return signal ? (signal as Accessor<T>) : undefined;
  }

  /**
   * Define a computed signal in the store
   * @param key The key for the computed signal
   * @param computation The computation function
   */
  defineComputed<T>(key: string, computation: () => T): Accessor<T> {
    if (this.Signals.has(key)) {
      throw new Error(`Computed createSignal with key "${key}" already exists`);
    }

    const comp = createComputed(computation);
    this.Signals.set(key, comp);
    return comp;
  }

  /**
   * Get a computed signal from the store
   * @param key The key for the computed signal
   */
  getComputed<T>(key: string): Accessor<T> | undefined {
    const computed = this.Signals.get(key);
    return computed ? (computed as Accessor<T>) : undefined;
  }

  /**
   * Add an effect to the store
   * @param effectFn The effect function
   */
  addEffect(effectFn: () => void | (() => void)): void {
    const cleanup = createEffect(effectFn);
    this.effects.push(cleanup);
  }

  /**
   * Dispose all effects and clear the store
   */
  dispose(): void {
    this.effects.forEach(cleanup => { cleanup(); });
    this.effects = [];
    this.signals.clear();
    this.Signals.clear();
  }

  /**
   * Get all signal keys
   */
  getSignalKeys(): string[] {
    return Array.from(this.signals.keys());
  }

  /**
   * Get all computed signal keys
   */
  getComputedKeys(): string[] {
    return Array.from(this.Signals.keys());
  }

  /**
   * Get a nested signal by path (e.g., ['user', 'profile', 'name'])
   */
  getNestedSignal<T>(root: Accessor<unknown>, path: (string | number)[]): Accessor<T> | undefined {
    let current: unknown = root;
    for (const key of path) {
      if (key === undefined || key === null) return undefined;
      if (!isAccessor(current)) return undefined;
      const value = current();
      if (typeof value === 'object' && value !== null && key in value) {
        current = (value as Record<string | number, unknown>)[key];
      } else {
        return undefined;
      }
    }
    if (!isAccessor(current)) return undefined;
    return current as Accessor<T>;
  }

  /**
   * Set a nested value by path (will create signals as needed)
   */
  setNestedSignal<T>(root: Accessor<unknown>, path: (string | number)[], value: T): void {
    let current: unknown = root;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (key === undefined || key === null) return;
      if (!isAccessor(current)) return;
      let obj = current();
      if (typeof obj !== 'object' || obj === null) {
        obj = {};
        const setter = getSetter(current);
        if (setter) setter(obj as unknown);
        else return;
      }
      const objRecord = obj as Record<string | number, unknown>;
      if (!(key in objRecord) || typeof objRecord[key] !== 'function') {
        const [newSig] = createSignal(undefined);
        objRecord[key] = newSig;
        const setter = getSetter(current);
        if (setter) setter(obj as unknown);
        else return;
      }
      current = objRecord[key];
    }
    // Set the value at the final key
    if (!isAccessor(current)) return;
    let obj = current();
    const lastKey = path[path.length - 1];
    if (lastKey === undefined || lastKey === null) return;
    if (typeof obj !== 'object' || obj === null) {
      obj = {};
    }
    const [finalSig] = createSignal(value);
    (obj as Record<string | number, unknown>)[lastKey] = finalSig;
    const finalSetter = getSetter(current);
    if (finalSetter) finalSetter(obj as unknown);
    else return;
  }
}

/**
 * Global state store instance
 */
export const globalStore = new StateStore();

/**
 * Create a scoped state store
 */
export function createStore(): StateStore {
  return new StateStore();
}

/**
 * Reactive state hook for components
 */
export function useState<T>(
  initialValue: T
): Accessor<T> {
  return createSignal(initialValue)[0];
}

/**
 * Reactive computed hook for components
 */
export function useComputed<T>(computation: () => T): () => T {
  const comp = createComputed(computation);
  return () => comp();
}

/**
 * Memoized value hook for components (alias for useComputed)
 */
export function useMemo<T>(computation: () => T): () => T {
  const comp = createComputed(computation);
  return () => comp();
}

/**
 * Effect hook for components
 */
export function useEffect(
  effectFn: () => void | (() => void),
  deps?: (() => unknown)[]
): EffectCleanup {
  if (deps && deps.length > 0) {
    // Create a computed that tracks dependencies
    const depsComputed = createComputed(() => deps.map(dep => dep()));

    return createEffect(() => {
      // Access the computed to track its dependencies
      depsComputed();
      return effectFn();
    });
  } else {
    return createEffect(effectFn);
  }
}

/**
 * Batch multiple signal updates
 */
export function batch<T>(fn: () => T): T {
  return batchUpdates(fn);
}

/**
 * Utility to create derived state
 */
export function derive<T, R>(
  signal: Accessor<T>,
  transform: (value: T) => R
): Accessor<R> {
  return createComputed(() => transform(signal()));
}

/**
 * Utility to combine multiple signals
 */
export function combine<T extends readonly unknown[]>(
  ...signals: { readonly [K in keyof T]: Accessor<T[K]> }
): Accessor<T> {
  return createComputed(() => {
    const values: unknown[] = [];
    for (let i = 0; i < signals.length; i++) {
      const signal = signals[i]!;
      values.push(signal());
    }
    return values as unknown as T;
  });
}
