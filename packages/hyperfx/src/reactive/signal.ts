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


// Stack-based dependency tracking for nested computed/effects
// Each frame tracks dependencies independently to avoid conflicts
interface TrackingFrame {
  dependencies: Set<Accessor<any>>;
}

const trackingStack: TrackingFrame[] = [];

function pushTrackingFrame(): void {
  trackingStack.push({ dependencies: new Set() });
}

function popTrackingFrame(): Set<Accessor<any>> {
  const frame = trackingStack.pop();
  return frame?.dependencies ?? new Set();
}

function getCurrentFrame(): TrackingFrame | undefined {
  return trackingStack[trackingStack.length - 1];
}

type AccessorDeps = Accessor<any> & { __deps?: Set<Accessor<any>> };

function trackSignal(signal: Accessor<any>): void {
  const frame = getCurrentFrame();
  if (!frame) return;
  const deps = (signal as AccessorDeps).__deps;
  if (deps && deps.size > 0) {
    deps.forEach((dep) => frame.dependencies.add(dep));
    return;
  }
  frame.dependencies.add(signal);
}

// Owner stack for nested effect tracking
// When an effect runs, it becomes the owner for any child effects created within it
const ownerStack: EffectContext[] = [];
let currentOwner: EffectContext | null = null;

interface EffectContext {
  children: Set<() => void>;
  dispose: () => void;
}

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


export type Accessor<T> = (() => T) & {
  subscribe: (cb: (v: T) => void) => () => void;
  destroy?: () => void;
  subscriberCount?: number;
};

export type Signal<T> = [Accessor<T>, (v: T | ((prev: T) => T)) => () => void];



class SignalImpl<T = unknown> {
  private _value: T;
  private subscribers: Set<(value: T) => void> = new Set();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get(): T {
    return this._value;
  }

  getSubscriberCount(): number {
    return this.subscribers.size;
  }

  set(newValue: T): T {
    if (Object.is(this._value, newValue)) {
      return newValue;
    }

    this._value = newValue;

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

  subscribe(callback: (value: T) => void): () => void {
    this.subscribers.add(callback);

    return () => {
      this.subscribers.delete(callback);
    };
  }
}

/** Internal helper to create a raw implementation for computed/registry */
function createRawSignal<T>(initialValue: T): SignalImpl<T> {
  return new SignalImpl(initialValue);
}

export interface SignalOptions {
  key?: string; // Unique key for SSR serialization
}

/**
 * Create a new signal that returns [get, set]
 * - `get()` reads the value (and is used for dependency tracking)
 * - `set(value | updater)` sets the value and returns an `undo()` function that restores the previous value
 */
export function createSignal<T>(initialValue: T, options?: SignalOptions): Signal<T> {
  // Support SSR registry: if already registered with key, return existing tuple
  if (options?.key && globalSignalRegistry.has(options.key)) {
    return globalSignalRegistry.get(options.key)!;
  }

  const impl = createRawSignal(initialValue);

  // Build public getter function that participates in tracking
  const getter = createGetter(impl);
  const setter = createSetter(impl);

  const signalTuple: Signal<T> = [getter, setter];

  // Register tuple for SSR if requested
  if (options?.key) {
    if (globalSignalRegistry.has(options.key)) {
      console.warn(`Signal with key "${options.key}" already exists. Using existing signal.`);
    } else {
      registerSignal(options.key, signalTuple);
    }
  }

  // Return the signal tuple
  return signalTuple;
}

function createGetter<T>(impl: SignalImpl<T>): Accessor<T> {
  const fn: Accessor<T> = () => {
    // Getter behavior
    if (isTracking) {
      trackSignal(fn);
    }
    return impl.get();
  };

  // Attach subscribe for convenience
  fn.subscribe = (cb: (v: T) => void) => {
    const unsubscribe = impl.subscribe(cb);
    fn.subscriberCount = impl.getSubscriberCount();
    return () => {
      unsubscribe();
      fn.subscriberCount = impl.getSubscriberCount();
    };
  };

  // Expose subscriberCount for tests
  fn.subscriberCount = impl.getSubscriberCount();

  return fn;
}

function createSetter<T>(impl: SignalImpl<T>) {
  return (valueOrUpdater: T | ((prev: T) => T)) => {
    const prev = impl.get();
    const newValue = typeof valueOrUpdater === 'function' ? (valueOrUpdater as (prev: T) => T)(prev) : (valueOrUpdater as T);
    impl.set(newValue);
    // Return undo function
    return () => {
      impl.set(prev);
    };
  };
}

/**
 * Create a computed signal that derives from other signals
 * Automatically tracks dependencies when accessed
 */
export function createComputed<T>(computeFn: () => T): Accessor<T> {
  // Track dependencies during initial computation
  const oldTracking = isTracking;
  isTracking = true;
  pushTrackingFrame();

  let initialValue: T;
  let deps: Set<Accessor<any>>;
  try {
    initialValue = computeFn();
  } finally {
    deps = popTrackingFrame();
    isTracking = oldTracking;
  }

  const impl = createRawSignal(initialValue);
  const getter = createGetter(impl);
  (getter as AccessorDeps).__deps = deps;

  let isRecomputing = false;

  const recompute = () => {
    if (isRecomputing) return;
    isRecomputing = true;
    const newValue = computeFn();
    if (!Object.is(newValue, impl.get())) {
      impl.set(newValue);
    }
    isRecomputing = false;
  };

  const unsubscribers = Array.from(deps).map((dep) => dep.subscribe(recompute));

  getter.destroy = () => {
    for (let i = 0; i < unsubscribers.length; i++) {
      unsubscribers[i]!();
    }
    unsubscribers.length = 0;
    (getter as AccessorDeps).__deps = undefined;
  };

  return getter;
}



/**
 * Create an effect that runs when signals change
 * Effects automatically track dependencies and re-subscribe when they change
 * Nested effects are tracked and disposed when parent re-runs
 */
export function createEffect(effectFn: () => void | (() => void)): () => void {
  let cleanup: (() => void) | void;
  let unsubscribers: Array<() => void> = [];
  let isDisposed = false;
  let isRunning = false; // Prevent re-entrance during signal notifications
  let pendingRun = false; // Track if we should run after current execution

  // Create effect context for tracking children
  const context: EffectContext = {
    children: new Set(),
    dispose: () => {
      // This will be set below
    }
  };

  // Dispose function that cleans up this effect and all children
  const dispose = () => {
    if (isDisposed) return;
    isDisposed = true;
    
    // Dispose all child effects first
    context.children.forEach(childDispose => {
      childDispose();
    });
    context.children.clear();

    // Unsubscribe from dependencies
    unsubscribers.forEach((unsub) => {
      unsub();
    });
    unsubscribers = [];
    
    // Call cleanup function
    if (typeof cleanup === 'function') {
      cleanup();
    }

    // Remove from parent's children set if we have an owner
    if (currentOwner) {
      currentOwner.children.delete(dispose);
    }
  };
  context.dispose = dispose;

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

      // Dispose all child effects before re-running
      context.children.forEach(childDispose => {
        childDispose();
      });
      context.children.clear();

      // Unsubscribe from previous dependencies
      for (let i = 0; i < unsubscribers.length; i++) {
        unsubscribers[i]!();
      }
      unsubscribers = [];

      // Call previous cleanup if present
      if (typeof cleanup === 'function') {
        cleanup();
        cleanup = undefined;
      }

      // Push this effect onto the owner stack
      const previousOwner = currentOwner;
      currentOwner = context;
      ownerStack.push(context);

      // Track dependencies during effect run
      const oldTracking = isTracking;
      isTracking = true;
      pushTrackingFrame();

      // Mark that we're inside an effect for onMount detection
      setInsideEffect(true);

      try {
        // Run effect
        cleanup = effectFn();
      } finally {
        // Reset tracking and effect flag
        isTracking = oldTracking;
        setInsideEffect(false);
        
        // Pop this effect from the owner stack
        ownerStack.pop();
        currentOwner = previousOwner;
      }

      // Subscribe to all accessed signals
      const dependencies = Array.from(popTrackingFrame());

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

  // Register this effect with the current owner (if any)
  if (currentOwner) {
    currentOwner.children.add(dispose);
  }

  // Initial run (synchronous)
  runEffect();

  // Return cleanup function
  return dispose;
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
 * Check if a value is an Accessor (callable accessor)
 */
export function isAccessor(value: unknown): value is Accessor<any> {
  return typeof value === 'function' && 'subscribe' in value && typeof value.subscribe === 'function';
}

export function getAccessor<T>(value: Signal<T>): Accessor<T>;
export function getAccessor<T>(value: Accessor<T>): Accessor<T>;
export function getAccessor(value: unknown): Accessor<unknown> | undefined;
export function getAccessor<T>(value: Signal<T> | Accessor<T> | unknown): Accessor<T> | Accessor<unknown> | undefined {
  if (Array.isArray(value) && value.length === 2 && typeof value[0] === 'function' && typeof value[1] === 'function') {
    return value[0] as Accessor<T>;
  }
  if (isAccessor(value)) return value;
  return undefined;
}

export function getSetter<T>(value: Signal<T>): (v: T | ((prev: T) => T)) => () => void;
export function getSetter(value: unknown): ((v: unknown | ((prev: unknown) => unknown)) => () => void) | undefined;
export function getSetter<T>(value: Signal<T> | unknown): ((v: T | ((prev: T) => T)) => () => void) | ((v: unknown | ((prev: unknown) => unknown)) => () => void) | undefined {
  if (Array.isArray(value) && value.length === 2 && typeof value[0] === 'function' && typeof value[1] === 'function') {
    return value[1] as (v: T | ((prev: T) => T)) => () => void;
  }
  return undefined;
}

/**
 * Get signal value from a tuple, or return value if not a signal tuple
 */
export function unwrapSignal<T>(value: Signal<T>): T;
export function unwrapSignal<T>(value: Accessor<T>): T;
export function unwrapSignal<T>(value: T): T;
export function unwrapSignal(value: unknown): unknown;
export function unwrapSignal<T>(value: T | Signal<T> | Accessor<T>): unknown {
  if (Array.isArray(value) && value.length === 2 && typeof value[0] === 'function' && typeof value[1] === 'function') {
    return (value[0] as Accessor<T>)();
  }
  if (isAccessor(value)) return value();
  return value;
}
