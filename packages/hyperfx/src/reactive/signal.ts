/**
 * Custom Signal Implementation for HyperFX
 *
 * A simple, synchronous signal system optimized for reactive DOM updates.
 * 
 */

// Import lifecycle hooks for effect tracking
import { setInsideEffect } from './lifecycle.js';

// Global tracking context for automatic dependency detection
let isTracking = false;
const accessedSignals = new Set<Signal<any>>();

// Global signal registry for SSR serialization
const globalSignalRegistry = new Map<string, Signal<any>>();
let isSSRMode = false;

/**
 * Enable SSR mode for signal tracking
 */
export function enableSSRMode(): void {
  if (!isSSRMode) {
    isSSRMode = true;
    globalSignalRegistry.clear();
  }
}

/**
 * Disable SSR mode
 */
export function disableSSRMode(): void {
  isSSRMode = false;
}

/**
 * Get all registered signals for SSR serialization
 */
export function getRegisteredSignals(): Map<string, Signal<any>> {
  return globalSignalRegistry;
}

/**
 * Register a signal with a key for SSR
 */
export function registerSignal<T>(key: string, signal: Signal<T>): void {
  globalSignalRegistry.set(key, signal);
}

/**
 * Signal function that can be called to get/set values
 * Compatible with both callable API (signal()) and object API (signal.get())
 */
export type Signal<T = unknown> = {
  (): T;
  (value: T): T;
  get(): T;
  set(value: T): T;
  subscribe(callback: (value: T) => void): () => void;
  peek(): T;
  update(updater: (current: T) => T): T;
  subscriberCount: number;
  key?: string; // Optional key for SSR serialization
  [Symbol.iterator](): Iterator<Signal<T>>;
};

/**
 * Extended signal interface for computed signals
 */
interface ComputedSignal<T> extends Signal<T> {
  destroy(): void;
}

class SignalImpl<T = unknown> {
  private _value: T;
  private subscribers: Set<(value: T) => void> = new Set();
  callableSignal!: Signal<T>;

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  /**
   * Get the current signal value
   */
  get(): T {
    // Track access if we're tracking dependencies
    if (isTracking) {
      accessedSignals.add(this.callableSignal);
    }
    return this._value;
  }

  /**
   * Set a new signal value and notify subscribers
   */
  set(newValue: T): T {
    if (Object.is(this._value, newValue)) {
      return newValue; // No change, skip notification
    }

    this._value = newValue;

    // Copy subscribers array before iterating to avoid issues
    // when subscribers modify the subscription list during notification
    const subscribersToNotify = Array.from(this.subscribers);

    subscribersToNotify.forEach((callback) => {
      try {
        callback(newValue);
      } catch (error) {
        console.error('Signal subscriber error:', error);
      }
    });

    return newValue;
  }

  /**
   * Subscribe to signal changes
   * Returns an unsubscribe function
   */
  subscribe(callback: (value: T) => void): () => void {
    this.subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Get current value and subscribe to changes in one call
   * Useful for reactive contexts
   */
  peek(): T {
    return this._value;
  }

  /**
   * Update value using a function
   */
  update(updater: (current: T) => T): T {
    return this.set(updater(this._value));
  }

  /**
   * Get number of active subscribers (for debugging)
   */
  get subscriberCount(): number {
    return this.subscribers.size;
  }
}

/**
 * Options for creating a signal
 */
export interface SignalOptions {
  key?: string; // Unique key for SSR serialization
}

/**
 * Create a new signal with callable API and object methods
 */
export function createSignal<T>(initialValue: T, options?: SignalOptions): Signal<T> {
  const signal = new SignalImpl(initialValue);

  // Create callable function with methods
  const callableSignal = Object.assign(
    (value?: T) => {
      if (value !== undefined) {
        return signal.set(value);
      }
      return signal.get();
    },
    {
      get: () => signal.get(),
      set: (value: T) => signal.set(value),
      subscribe: (callback: (value: T) => void) => signal.subscribe(callback),
      peek: () => signal.peek(),
      update: (updater: (current: T) => T) => signal.update(updater),
      key: options?.key,
      [Symbol.iterator]: function* () {
        yield callableSignal;
        yield callableSignal;
      }
    }
  ) as unknown as Signal<T>;

  // Add subscriberCount getter dynamically
  Object.defineProperty(callableSignal, 'subscriberCount', {
    get() { return signal.subscriberCount; },
    enumerable: true,
    configurable: true
  });

  // Store reference to callable signal
  signal.callableSignal = callableSignal;

  // Register signal if it has a key and we're in SSR mode
  if (options?.key) {
    if (globalSignalRegistry.has(options.key)) {
      console.warn(`Signal with key "${options.key}" already exists. Using existing signal.`);
      return globalSignalRegistry.get(options.key) as Signal<T>;
    }
    registerSignal(options.key, callableSignal);
  }

  return callableSignal;
}

/**
 * Create a computed signal that derives from other signals
 * Automatically tracks dependencies when accessed
 */
export function createComputed<T>(computeFn: () => T): ComputedSignal<T> {
  // Track dependencies during computation
  const oldTracking = isTracking;
  isTracking = true;
  accessedSignals.clear();

  let initialValue: T;
  try {
    initialValue = computeFn();
  } finally {
    isTracking = oldTracking;
  }

  // Create the signal with initial value
  const signal = createSignal(initialValue);

  // Get the dependencies that were accessed
  const deps = Array.from(accessedSignals) as Signal<any>[];

  // Clear accessed signals for future use
  accessedSignals.clear();

  // Make the signal read-only
  const originalSet = signal.set;
  signal.set = () => {
    throw new Error('Cannot set computed signal directly. Computed signals are read-only.');
  };

  // Subscribe to dependencies
  const unsubscribers = deps.map(dep =>
    dep.subscribe(() => {
      // Recompute when dependency changes
      const newValue = computeFn();
      originalSet(newValue);
    })
  );

  // Add destroy method to clean up subscriptions
  const computedSignal = Object.assign(signal, {
    destroy: () => {
      // Unsubscribe from all dependencies
      unsubscribers.forEach(unsub => unsub());
      // Clear the unsubscribers array
      unsubscribers.length = 0;
    }
  }) as ComputedSignal<T>;

  return computedSignal;
}

/**
 * Create an effect that runs when signals change
 * Effects automatically track dependencies and re-subscribe when they change
 */
export function createEffect(effectFn: () => void | (() => void)): () => void {
  let cleanup: (() => void) | void;
  let unsubscribers: Array<() => void> = [];
  let isDisposed = false;
  let isRunning = false; // Prevent re-entrance during signal notifications
  let pendingRun = false; // Track if we should run after current execution

  // Function to run the effect and update subscriptions
  const runEffect = () => {
    if (isDisposed) return;

    // If already running, defer this run until current one completes
    if (isRunning) {
      pendingRun = true;
      return;
    }

    isRunning = true;

    // Loop to stabilize when effects trigger themselves
    let iterations = 0;
    const MAX_ITERATIONS = 100;

    while (iterations < MAX_ITERATIONS) {
      pendingRun = false;

      // Unsubscribe from previous dependencies
      unsubscribers.forEach(unsub => unsub());
      unsubscribers = [];

      // Call previous cleanup if present
      if (typeof cleanup === 'function') {
        cleanup();
        cleanup = undefined;
      }

      // Track dependencies during effect run
      const oldTracking = isTracking;
      isTracking = true;
      accessedSignals.clear();

      // Mark that we're inside an effect for onMount detection
      setInsideEffect(true);

      try {
        // Run effect
        cleanup = effectFn();
      } finally {
        // Reset tracking and effect flag
        isTracking = oldTracking;
        setInsideEffect(false);
      }

      // Subscribe to all accessed signals
  const dependencies = Array.from(accessedSignals) as Signal<any>[];
      accessedSignals.clear();

      unsubscribers = dependencies.map(dep =>
        dep.subscribe(() => {
          // Trigger effect to run (will be deferred if currently running)
          runEffect();
        })
      );

      // If no new run was triggered during execution, we're done
      if (!pendingRun) {
        break;
      }

      iterations++;
    }

    if (iterations >= MAX_ITERATIONS) {
      console.error('createEffect: Maximum iterations reached - possible infinite loop in effect');
      pendingRun = false;
    }

    isRunning = false;
  };

  // Initial run (synchronous)
  runEffect();

  // Return cleanup function that unsubscribes
  return () => {
    isDisposed = true;
    unsubscribers.forEach((unsub) => {
      unsub();
    });
    if (typeof cleanup === 'function') {
      cleanup();
    }
  };
}

/**
 * Batch multiple signal updates
 */
export function batch<T>(fn: () => T): T {
  // Simple implementation - just run the function
  // In a full implementation, this would defer notifications
  return fn();
}

/**
 * Run a function without tracking signal accesses
 * Useful for reading signals inside effects without creating dependencies
 */
export function untrack<T>(fn: () => T): T {
  const wasTracking = isTracking;
  isTracking = false;
  try {
    return fn();
  } finally {
    isTracking = wasTracking;
  }
}

/**
 * Utility to check if a value is a Signal
 */
export function isSignal(value: unknown): value is Signal {
  return typeof value === 'function' && value !== null && 'subscribe' in value && 'get' in value && 'set' in value;
}

/**
 * Get signal value, or return value if not a signal
 */
export function unwrapSignal<T>(value: T | Signal<T>): T {
  return isSignal(value) ? (value as Signal<T>)() : (value as T);
}

/**
 * Legacy compatibility exports
 */
export { Signal as ReactiveSignal };
export { createSignal as signal };
export { createComputed as computed };
export { createComputed as createMemo };
