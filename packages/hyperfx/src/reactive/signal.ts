/**
 * Custom Signal Implementation for HyperFX
 *
 * A simple, synchronous signal system optimized for reactive DOM updates.
 * Replaces alien-signals with a more direct approach for JSX reactive attributes.
 */

// Global tracking context for automatic dependency detection
let currentComputation: Signal | null = null;
let isTracking = false;
const accessedSignals = new Set<Signal>();

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
};

/**
 * Extended signal interface for computed signals
 */
interface ComputedSignal<T> extends Signal<T> {
  destroy(): void;
}

class SignalImpl<T = any> {
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

    // Immediately notify all subscribers
    this.subscribers.forEach((callback) => {
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
 * Create a new signal with callable API and object methods
 */
export function createSignal<T>(initialValue: T): Signal<T> {
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
      get subscriberCount() { return signal.subscriberCount; }
    }
  ) as Signal<T>;

  // Store reference to callable signal
  signal.callableSignal = callableSignal;

  return callableSignal;
}

/**
 * Create a computed signal that derives from other signals
 * Automatically tracks dependencies when accessed
 */
export function createComputed<T>(computeFn: () => T): Signal<T> {
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
  const deps = Array.from(accessedSignals);

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

  // Store unsubscribers for cleanup
  (signal as any)._unsubscribers = unsubscribers;

  return signal;
}

/**
 * Create an effect that runs when signals change
 */
export function createEffect(effectFn: () => void | (() => void)): () => void {
  // Track dependencies during initial effect run
  const oldTracking = isTracking;
  isTracking = true;
  accessedSignals.clear();

  let cleanup: (() => void) | void;

  // Run effect and track dependencies
  cleanup = effectFn();

  // Subscribe to all accessed signals
  const dependencies = Array.from(accessedSignals);
  const unsubscribers = dependencies.map(dep =>
    dep.subscribe(() => {
      // Re-run effect when dependency changes
      const oldTrack = isTracking;
      isTracking = true;
      accessedSignals.clear();
      // Call previous cleanup if any
      if (typeof cleanup === 'function') {
        cleanup();
      }
      // Re-run effect
      cleanup = effectFn();
      isTracking = oldTrack;
      accessedSignals.clear();
    })
  );

  // Reset tracking
  isTracking = oldTracking;
  accessedSignals.clear();

  // Return cleanup function that unsubscribes
  return () => {
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
 * Utility to check if a value is a Signal
 */
export function isSignal(value: any): value is Signal {
  return typeof value === 'function' && 'subscribe' in value && 'get' in value && 'set' in value;
}

/**
 * Get signal value, or return value if not a signal
 */
export function unwrapSignal<T>(value: T | Signal<T>): T {
  return isSignal(value) ? value() : (value as T);
}

/**
 * Legacy compatibility exports
 */
export { Signal as ReactiveSignal };
export { createSignal as signal };
export { createComputed as computed };
export { createComputed as createMemo };