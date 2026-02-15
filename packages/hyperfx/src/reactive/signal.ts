/**
 * Custom Signal Implementation for HyperFX
 *
 * A simple, synchronous signal system optimized for reactive DOM updates.
 *
 */

/**
 * Reactive Context for SSR isolation
 * Each SSR request gets its own context
 */
interface ReactiveContext {
  trackingStack: TrackingFrame[];
  ownerStack: Owner[];
  currentOwner: Owner | null;
  globalSignalRegistry: Map<string, Signal<any>>;
  ownerIdCounter: number;
  templateCounter: number;
  isTracking: boolean;
  insideEffect: boolean;
}

interface TrackingFrame {
  dependencies: Set<Accessor<any>>;
}

let AsyncLocalStorage: typeof import('async_hooks').AsyncLocalStorage | null = null;

try {
  AsyncLocalStorage = require('async_hooks').AsyncLocalStorage;
} catch {
  // Not available in browser
}

const asyncLocalStorage = AsyncLocalStorage ? new AsyncLocalStorage<ReactiveContext>() : null;

function createDefaultContext(): ReactiveContext {
  return {
    trackingStack: [],
    ownerStack: [],
    currentOwner: null,
    globalSignalRegistry: new Map(),
    ownerIdCounter: 0,
    templateCounter: 0,
    isTracking: false,
    insideEffect: false,
  };
}

function getContext(): ReactiveContext {
  if (asyncLocalStorage) {
    let context = asyncLocalStorage.getStore();
    if (!context) {
      context = defaultContext;
      asyncLocalStorage.enterWith(context);
    }
    return context;
  }
  return defaultContext;
}

const defaultContext = createDefaultContext();

// Global tracking context for automatic dependency detection
function getIsTracking(): boolean {
  return getContext().isTracking;
}

function setIsTracking(value: boolean): void {
  getContext().isTracking = value;
}

// Track if we're inside an effect for lifecycle hooks
function getInsideEffect(): boolean {
  return getContext().insideEffect;
}

function setInsideEffect(value: boolean): void {
  getContext().insideEffect = value;
}


// Stack-based dependency tracking for nested computed/effects
// Each frame tracks dependencies independently to avoid conflicts
interface TrackingFrame {
  dependencies: Set<Accessor<any>>;
}

function pushTrackingFrame(): void {
  getContext().trackingStack.push({ dependencies: new Set() });
}

function popTrackingFrame(): Set<Accessor<any>> {
  const frame = getContext().trackingStack.pop();
  return frame?.dependencies ?? new Set();
}

function getCurrentFrame(): TrackingFrame | undefined {
  const stack = getContext().trackingStack;
  return stack[stack.length - 1];
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
function getOwnerStack(): Owner[] {
  return getContext().ownerStack;
}

function getCurrentOwner(): Owner | null {
  return getContext().currentOwner;
}

function setCurrentOwner(owner: Owner | null): void {
  getContext().currentOwner = owner;
}

function incrementOwnerIdCounter(): number {
  return getContext().ownerIdCounter++;
}

export interface Owner {
  id: number;
  parent: Owner | null;
  children: Set<Owner>;
  effects: Set<() => void>;
  signals: Set<() => void>;
  cleanups: Set<() => void>;
  mountCallbacks: Set<() => void | (() => void)>;
  mountCleanups: Set<() => void>;
  mounted: boolean;
  disposed: boolean;
  isRoot: boolean;
}

function createOwner(parent: Owner | null = null, isRoot = false): Owner {
  const owner: Owner = {
    id: incrementOwnerIdCounter(),
    parent,
    children: new Set(),
    effects: new Set(),
    signals: new Set(),
    cleanups: new Set(),
    mountCallbacks: new Set(),
    mountCleanups: new Set(),
    mounted: false,
    disposed: false,
    isRoot,
  };
  return owner;
}

export function getOwner(): Owner | null {
  return getCurrentOwner();
}

export function runWithOwner<T>(owner: Owner, fn: () => T): T {
  const previousOwner = getCurrentOwner();
  setCurrentOwner(owner);
  getOwnerStack().push(owner);
  try {
    return fn();
  } finally {
    getOwnerStack().pop();
    setCurrentOwner(previousOwner);
  }
}

function disposeOwner(owner: Owner): void {
  if (owner.disposed) return;
  owner.disposed = true;

  const safeDispose = (fn: () => void) => {
    try {
      fn();
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  };

  // Dispose all children first (LIFO - last created, first disposed)
  const children = Array.from(owner.children).reverse();
  for (const child of children) {
    disposeOwner(child);
  }
  owner.children.clear();

  // Dispose all effects
  const effects = Array.from(owner.effects).reverse();
  for (const dispose of effects) {
    safeDispose(dispose);
  }
  owner.effects.clear();

  // Dispose all signals (clear subscribers)
  const signals = Array.from(owner.signals).reverse();
  for (const dispose of signals) {
    safeDispose(dispose);
  }
  owner.signals.clear();

  // Run mount cleanup functions first (LIFO - last registered, first cleaned)
  if (owner.mountCleanups.size > 0) {
    const mountCleanups = Array.from(owner.mountCleanups).reverse();
    for (const cleanup of mountCleanups) {
      safeDispose(cleanup);
    }
    owner.mountCleanups.clear();
  }

  // Run cleanup handlers (LIFO)
  const cleanups = Array.from(owner.cleanups).reverse();
  for (const cleanup of cleanups) {
    safeDispose(cleanup);
  }
  owner.cleanups.clear();

  // Remove from parent
  if (owner.parent) {
    owner.parent.children.delete(owner);
  }
}

export interface RootResult<T> {
  result: T;
  dispose: () => void;
}

export function createRoot<T>(fn: (dispose: () => void) => T, options?: { detached?: boolean }): RootResult<T> {
  const parent = options?.detached ? null : getCurrentOwner();
  const owner = createOwner(parent, true);

  setCurrentOwner(owner);
  getOwnerStack().push(owner);

  let disposed = false;
  let cleanupFn: (() => void) | void = undefined;

  const dispose = () => {
    if (!disposed) {
      disposed = true;
      if (typeof cleanupFn === 'function') {
        cleanupFn();
      }
      cleanupFn = undefined;
      disposeOwner(owner);
      getOwnerStack().pop();
      setCurrentOwner(parent);
    }
  };

  let result: T;
  try {
    result = fn(dispose);
    if (typeof result === 'function') {
      cleanupFn = result as () => void;
    }
  } catch (error) {
    dispose();
    throw error;
  }

  // Auto-dispose if callback didn't return a cleanup function
  // This enables automatic cleanup for lifecycle testing while preserving
  // manual cleanup for component mounting (which returns cleanup functions)
  if (typeof result !== 'function' && result !== null) {
    dispose();
  }

  return { result, dispose };
}

// Global signal registry for SSR serialization
function getGlobalSignalRegistry(): Map<string, Signal<any>> {
  return getContext().globalSignalRegistry;
}

let isSSRMode = false;

/**
 * Enable SSR mode for signal tracking
 */
export function enableSSRMode(): void {
  if (!isSSRMode) {
    isSSRMode = true;
    getGlobalSignalRegistry().clear();
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
  return getGlobalSignalRegistry();
}

/**
 * Register a signal with a key for SSR
 */
export function registerSignal<T>(key: string, signal: Signal<T>): void {
  getGlobalSignalRegistry().set(key, signal);
}

/**
 * Unregister a signal by key
 */
export function unregisterSignal(key: string): void {
  getGlobalSignalRegistry().delete(key);
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

  clearSubscribers(): void {
    this.subscribers.clear();
  }

  set(newValue: T): T {
    if (Object.is(this._value, newValue)) {
      return newValue;
    }

    this._value = newValue;

    const subscribersToNotify = Array.from(this.subscribers);

    let error: Error | null = null;

    for (const callback of subscribersToNotify) {
      try {
        callback(newValue);
      } catch (e) {
        error = e as Error;
        break;
      }
    }

    if (error) {
      this.subscribers.clear();
      throw error;
    }

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
  unowned?: boolean; // Don't register with current owner
}

/**
 * Create a new signal that returns [get, set]
 * - `get()` reads the value (and is used for dependency tracking)
 * - `set(value | updater)` sets the value and returns an `undo()` function that restores the previous value
 * - Accessor has `.destroy()` method for cleanup
 */
export function createSignal<T>(initialValue: T, options?: SignalOptions): Signal<T> {
  const registry = getGlobalSignalRegistry();
  if (options?.key && registry.has(options.key)) {
    return registry.get(options.key)!;
  }

  const impl = createRawSignal(initialValue);

  const getter = createGetter(impl);
  const setter = createSetter(impl);

  const signalTuple: Signal<T> = [getter, setter];

  const destroy = () => {
    impl.clearSubscribers();
    registry.delete(options?.key || '');
  };

  getter.destroy = destroy;

  if (!options?.unowned && getCurrentOwner()) {
    getCurrentOwner()!.signals.add(destroy);
  }

  if (options?.key) {
    if (registry.has(options.key)) {
      throw new Error(`Signal with key "${options.key}" already exists.`);
    } else {
      registerSignal(options.key, signalTuple);
    }
  }

  return signalTuple;
}

function createGetter<T>(impl: SignalImpl<T>): Accessor<T> {
  const fn: Accessor<T> = () => {
    // Getter behavior
    if (getIsTracking()) {
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
  const oldTracking = getIsTracking();
  setIsTracking(true);
  pushTrackingFrame();

  let initialValue: T;
  let deps: Set<Accessor<any>>;
  try {
    initialValue = computeFn();
  } finally {
    deps = popTrackingFrame();
    setIsTracking(oldTracking);
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



export function createEffect(effectFn: () => void | (() => void)): () => void {
  let isDisposed = false;
  let isRunning = false;
  let pendingRun = false;

  const childOwner = createOwner(getCurrentOwner(), false);
  let cleanup: (() => void) | void = undefined;
  let unsubscribers: Array<() => void> = [];

  const dispose = () => {
    if (isDisposed) return;
    isDisposed = true;

    if (getCurrentOwner()) {
      getCurrentOwner()!.effects.delete(dispose);
    }

    if (typeof cleanup === 'function') {
      cleanup();
    }
    cleanup = undefined;

    disposeOwner(childOwner);
  };

  if (getCurrentOwner()) {
    getCurrentOwner()!.effects.add(dispose);
  }

  const runEffect = () => {
    if (isDisposed) return;

    if (isRunning) {
      pendingRun = true;
      return;
    }

    isRunning = true;

    let iterations = 0;
    const MAX_ITERATIONS = 100;

    while (iterations < MAX_ITERATIONS) {
      pendingRun = false;

      if (typeof cleanup === 'function') {
        cleanup();
      }
      cleanup = undefined;

      unsubscribers.forEach(u => u());
      unsubscribers = [];

      const previousOwner = getCurrentOwner();
      setCurrentOwner(childOwner);
      getOwnerStack().push(childOwner);

      const oldTracking = getIsTracking();
      setIsTracking(true);
      pushTrackingFrame();

      setInsideEffect(true);

      try {
        cleanup = effectFn();
      } finally {
        setIsTracking(oldTracking);
        setInsideEffect(false);

        getOwnerStack().pop();
        setCurrentOwner(previousOwner);
      }

      const dependencies = Array.from(popTrackingFrame());

      unsubscribers = dependencies.map(dep =>
        dep.subscribe(() => {
          runEffect();
        })
      );

      if (!pendingRun) {
        break;
      }

      iterations++;
    }

    if (iterations >= MAX_ITERATIONS) {
      throw new Error('createEffect: Maximum iterations reached - possible infinite loop in effect');
    }

    isRunning = false;
  };

  runEffect();

  return dispose;
}

/**
 * Run a function without tracking signal accesses
 * Useful for reading signals inside effects without creating dependencies
 */
export function untrack<T>(fn: () => T): T {
  const wasTracking = getIsTracking();
  setIsTracking(false);
  try {
    return fn();
  } finally {
    setIsTracking(wasTracking);
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
  if (Array.isArray(value) && value.length >= 2 && typeof value[0] === 'function' && typeof value[1] === 'function') {
    return value[0] as Accessor<T>;
  }
  if (isAccessor(value)) return value;
  return undefined;
}

export function getSetter<T>(value: Signal<T>): (v: T | ((prev: T) => T)) => () => void;
export function getSetter(value: unknown): ((v: unknown | ((prev: unknown) => unknown)) => () => void) | undefined;
export function getSetter<T>(value: Signal<T> | unknown): ((v: T | ((prev: T) => T)) => () => void) | ((v: unknown | ((prev: unknown) => unknown)) => () => void) | undefined {
  if (Array.isArray(value) && value.length >= 2 && typeof value[0] === 'function' && typeof value[1] === 'function') {
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
  if (Array.isArray(value) && value.length >= 2 && typeof value[0] === 'function' && typeof value[1] === 'function') {
    return (value[0] as Accessor<T>)();
  }
  if (isAccessor(value)) return value();
  return value;
}

export function isInsideEffect(): boolean {
  return getInsideEffect();
}

export function onMount(fn: () => void | (() => void)): void {
  const owner = getOwner();
  if (!owner) {
    throw new Error(
      'onMount must be called within a component. ' +
      'Make sure you are calling onMount inside a component function.'
    );
  }

  if (getInsideEffect()) {
    throw new Error(
      'onMount cannot be called inside createEffect. ' +
      'onMount is for component lifecycle. ' +
      'Use the cleanup return value from createEffect for effect cleanup.'
    );
  }

  owner.mountCallbacks.add(fn);
}

export function onCleanup(fn: () => void): void {
  const owner = getOwner();
  if (owner) {
    owner.cleanups.add(fn);
  }
}

export function runWithContext<T>(fn: () => T): T {
  const owner = getOwner();
  if (owner) {
    return runWithOwner(owner, fn);
  }
  return fn();
}

export function flushMounts(): void {
  const safeRun = (fn: () => void | (() => void), mountCleanups: Set<() => void>) => {
    try {
      const cleanup = fn();
      if (typeof cleanup === 'function') {
        mountCleanups.add(cleanup);
      }
    } catch (error) {
      console.error('onMount error:', error);
    }
  };

  for (const owner of getOwnerStack()) {
    if (!owner.mounted) {
      owner.mounted = true;
      for (const callback of owner.mountCallbacks) {
        safeRun(callback, owner.mountCleanups);
      }
    }
  }
}

/**
 * Run a function within an SSR request context
 * Creates isolated state for each request
 */
export function runWithSSRContext<T>(fn: () => T): T {
  if (!asyncLocalStorage) {
    return fn();
  }

  const context = createDefaultContext();
  return asyncLocalStorage.run(context, fn);
}

/**
 * Reset the reactive context (for testing)
 */
export function resetReactiveContext(): void {
  const ctx = getContext();
  ctx.trackingStack = [];
  ctx.ownerStack = [];
  ctx.currentOwner = null;
  ctx.globalSignalRegistry.clear();
  ctx.ownerIdCounter = 0;
  ctx.templateCounter = 0;
  ctx.isTracking = false;
  ctx.insideEffect = false;
}
