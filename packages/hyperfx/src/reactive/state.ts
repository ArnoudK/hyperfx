import { ReactiveSignal, createSignal, createSignal as signal_createSignal, createComputed as signal_createComputed, createEffect as signal_createEffect, batch as signal_batch } from "./signal";

/**
 * State management utilities using custom Signal implementation
 */

/** Type for a computed signal */
export type ComputedSignal<T> = ReactiveSignal<T>;

/** Re-export ReactiveSignal */
export type { ReactiveSignal };

/** Re-export createSignal */
export { createSignal };

/** Type for signal_createEffect cleanup function */
export type EffectCleanup = () => void;

/**
 * Create a computed signal based on other signals
 * @param computation The computation function
 * @returns A computed signal
 */
export function createComputed<T>(computation: () => T): ComputedSignal<T> {
  return signal_createComputed(computation);
}

/**
 * Create an signal_createEffect that runs when dependencies change
 * @param effectFn The signal_createEffect function
 * @returns Cleanup function
 */
export function createEffect(effectFn: () => void | (() => void)): EffectCleanup {
  return signal_createEffect(effectFn);
}

/**
 * State store class for managing related state
 */
export class StateStore {
  private signals = new Map<string, ReactiveSignal<any>>();
  private computedSignals = new Map<string, ComputedSignal<any>>();
  private effects: EffectCleanup[] = [];

  /**
   * Define a signal_createSignal in the store
   * @param key The key for the signal_createSignal
   * @param initialValue The initial value
   */
  defineSignal<T>(key: string, initialValue: T): ReactiveSignal<T> {
    if (this.signals.has(key)) {
      throw new Error(`Signal with key "${key}" already exists`);
    }
    
    const sig = signal_createSignal(initialValue);
    this.signals.set(key, sig);
    return sig;
  }

  /**
   * Get a signal_createSignal from the store
   * @param key The key for the signal_createSignal
   */
  getSignal<T>(key: string): ReactiveSignal<T> | undefined {
    return this.signals.get(key) as ReactiveSignal<T>;
  }

  /**
   * Define a signal_createComputed signal_createSignal in the store
   * @param key The key for the signal_createComputed signal_createSignal
   * @param computation The computation function
   */
  defineComputed<T>(key: string, computation: () => T): ComputedSignal<T> {
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
  getComputed<T>(key: string): ComputedSignal<T> | undefined {
    return this.computedSignals.get(key) as ComputedSignal<T>;
  }

  /**
   * Add an signal_createEffect to the store
   * @param effectFn The signal_createEffect function
   */
  addEffect(effectFn: () => void | (() => void)): void {
    const cleanup = signal_createEffect(effectFn);
    this.effects.push(cleanup);
  }

  /**
   * Dispose all effects and clear the store
   */
  dispose(): void {
    this.effects.forEach(cleanup => { cleanup(); });
    this.effects = [];
    this.signals.clear();
    this.computedSignals.clear();
  }

  /**
   * Get all signal_createSignal keys
   */
  getSignalKeys(): string[] {
    return Array.from(this.signals.keys());
  }

  /**
   * Get all signal_createComputed signal_createSignal keys
   */
  getComputedKeys(): string[] {
    return Array.from(this.computedSignals.keys());
  }

  /**
   * Get a nested signal_createSignal by path (e.g., ['user', 'profile', 'name'])
   */
  getNestedSignal<T>(root: ReactiveSignal<any>, path: (string | number)[]): ReactiveSignal<T> | undefined {
    let current: any = root;
    for (const key of path) {
      if (key === undefined || key === null) return undefined;
      if (!current || typeof current !== 'function') return undefined;
      const value = current();
      if (typeof value === 'object' && value !== null && key in value) {
        current = value[key];
      } else {
        return undefined;
      }
    }
    return typeof current === 'function' ? current : undefined;
  }

  /**
   * Set a nested value by path (will create signals as needed)
   */
  setNestedSignal<T>(root: ReactiveSignal<any>, path: (string | number)[], value: T): void {
    let current: any = root;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (key === undefined || key === null) return;
      let obj = current();
      if (typeof obj !== 'object' || obj === null) {
        obj = {};
        current(obj);
      }
      if (!(key in obj) || typeof obj[key] !== 'function') {
        obj[key as string | number] = this.defineSignal(path.slice(0, i + 1).join('.'), undefined);
        current(obj);
      }
      current = obj[key as string | number];
    }
    // Set the value at the final key
    let obj = current();
    const lastKey = path[path.length - 1];
    if (lastKey === undefined || lastKey === null) return;
    if (typeof obj !== 'object' || obj === null) {
      obj = {};
    }
    obj[lastKey as string | number] = this.defineSignal(path.join('.'), value);
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
export function createStore(): StateStore {
  return new StateStore();
}

/**
 * Reactive state hook for components
 */
export function useState<T>(
  initialValue: T
): [() => T, (value: T | ((prev: T) => T)) => void] {
  const sig = signal_createSignal(initialValue);
  

  
  return [sig, sig];
}

/**
 * Reactive signal_createComputed hook for components
 */
export function useComputed<T>(computation: () => T): () => T {
  const comp = signal_createComputed(computation);
  return () => comp();
}

/**
 * Effect hook for components
 */
export function useEffect(
  effectFn: () => void | (() => void),
  deps?: (() => any)[]
): EffectCleanup {
  if (deps && deps.length > 0) {
    // Create a signal_createComputed that tracks dependencies
    const depsComputed = signal_createComputed(() => deps.map(dep => dep()));
    
    return signal_createEffect(() => {
      // Access the signal_createComputed to track its dependencies
      depsComputed();
      return effectFn();
    });
  } else {
    return signal_createEffect(effectFn);
  }
}

/**
 * Batch multiple signal_createSignal updates
 */
export function batch(updateFn: () => void): void {
  signal_batch(updateFn);
}

/**
 * Utility to create derived state
 */
export function derive<T, R>(
  signal_createSignal: ReactiveSignal<T>,
  transform: (value: T) => R
): ComputedSignal<R> {
  return signal_createComputed(() => transform(signal_createSignal()));
}

/**
 * Utility to combine multiple signals
 */
export function combine<T extends readonly unknown[]>(
  ...signals: { readonly [K in keyof T]: ReactiveSignal<T[K]> }
): ComputedSignal<T> {
  return signal_createComputed(() => signals.map(sig => sig()) as unknown as T);
}
