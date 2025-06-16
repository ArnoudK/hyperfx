import { signal, computed, effect, startBatch, endBatch } from 'alien-signals';

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
export function createSignal<T>(initialValue: T): ReactiveSignal<T> {
  return signal(initialValue);
}

/**
 * Create a computed signal based on other signals
 * @param computation The computation function
 * @returns A computed signal
 */
export function createComputed<T>(computation: () => T): ComputedSignal<T> {
  return computed(computation);
}

/**
 * Create an effect that runs when dependencies change
 * @param effectFn The effect function
 * @returns Cleanup function
 */
export function createEffect(effectFn: () => void | (() => void)): EffectCleanup {
  return effect(effectFn);
}

/**
 * State store class for managing related state
 */
export class StateStore {
  private signals = new Map<string, ReactiveSignal<any>>();
  private computedSignals = new Map<string, ComputedSignal<any>>();
  private effects: EffectCleanup[] = [];

  /**
   * Define a signal in the store
   * @param key The key for the signal
   * @param initialValue The initial value
   */
  defineSignal<T>(key: string, initialValue: T): ReactiveSignal<T> {
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
  getSignal<T>(key: string): ReactiveSignal<T> | undefined {
    return this.signals.get(key) as ReactiveSignal<T>;
  }

  /**
   * Define a computed signal in the store
   * @param key The key for the computed signal
   * @param computation The computation function
   */
  defineComputed<T>(key: string, computation: () => T): ComputedSignal<T> {
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
  getComputed<T>(key: string): ComputedSignal<T> | undefined {
    return this.computedSignals.get(key) as ComputedSignal<T>;
  }

  /**
   * Add an effect to the store
   * @param effectFn The effect function
   */
  addEffect(effectFn: () => void | (() => void)): void {
    const cleanup = effect(effectFn);
    this.effects.push(cleanup);
  }

  /**
   * Dispose all effects and clear the store
   */
  dispose(): void {
    this.effects.forEach(cleanup => cleanup());
    this.effects = [];
    this.signals.clear();
    this.computedSignals.clear();
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
    return Array.from(this.computedSignals.keys());
  }

  /**
   * Get a nested signal by path (e.g., ['user', 'profile', 'name'])
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
  const sig = signal(initialValue);
  
  const getter = () => sig();
  const setter = (value: T | ((prev: T) => T)) => {
    if (typeof value === 'function') {
      sig((value as (prev: T) => T)(sig()));
    } else {
      sig(value);
    }
  };
  
  return [getter, setter];
}

/**
 * Reactive computed hook for components
 */
export function useComputed<T>(computation: () => T): () => T {
  const comp = computed(computation);
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
    // Create a computed that tracks dependencies
    const depsComputed = computed(() => deps.map(dep => dep()));
    
    return effect(() => {
      // Access the computed to track its dependencies
      depsComputed();
      return effectFn();
    });
  } else {
    return effect(effectFn);
  }
}

/**
 * Batch multiple signal updates
 */
export function batch(updateFn: () => void): void {
  startBatch();
  try {
    updateFn();
  } finally {
    endBatch();
  }
}

/**
 * Utility to create derived state
 */
export function derive<T, R>(
  signal: ReactiveSignal<T>,
  transform: (value: T) => R
): ComputedSignal<R> {
  return computed(() => transform(signal()));
}

/**
 * Utility to combine multiple signals
 */
export function combine<T extends readonly unknown[]>(
  ...signals: { readonly [K in keyof T]: ReactiveSignal<T[K]> }
): ComputedSignal<T> {
  return computed(() => signals.map(sig => sig()) as unknown as T);
}
