/**
 * Lifecycle Hooks for HyperFX
 * 
 * Provides onMount and onCleanup hooks for component lifecycle management.
 * Integrates with the reactive system for proper cleanup.
 */

// Context for tracking component lifecycle
interface LifecycleContext {
  cleanups: Set<() => void>;
  mountCallbacks: Set<() => void | (() => void)>;
  mountCleanups: Set<() => void>;
  mounted: boolean;
  isEffect: boolean; // Track if we're inside an effect
}

export type LifecycleAPI = {
  pushLifecycleContext: (isEffectContext?: boolean) => void;
  popLifecycleContext: () => void;
  flushMounts: () => void;
  isInsideEffect: () => boolean;
  onMount: (fn: () => void | (() => void)) => void;
  onCleanup: (fn: () => void) => void;
  setInsideEffect: (value: boolean) => void;
  createRoot: <T>(fn: (dispose: () => void) => T) => { result: T; dispose: () => void };
  runWithContext: <T>(fn: () => T) => T;
};

// Stack to track nested component contexts
const contextStack: LifecycleContext[] = [];

// Track if we're currently inside an effect
let insideEffect = false;

/**
 * Get the current lifecycle context
 */
function getCurrentContext(): LifecycleContext | null {
  if (contextStack.length === 0) {
    return null;
  }
  return contextStack[contextStack.length - 1]!;
}

/**
 * Check if we're currently inside an effect
 */
export function isInsideEffect(): boolean {
  return insideEffect;
}

/**
 * Push a new lifecycle context onto the stack
 * Called when entering a component
 */
export function pushLifecycleContext(isEffectContext = false): void {
  const context: LifecycleContext = {
    cleanups: new Set(),
    mountCallbacks: new Set(),
    mountCleanups: new Set(),
    mounted: false,
    isEffect: isEffectContext,
  };
  contextStack.push(context);
}

/**
 * Pop the current lifecycle context and run all cleanups
 * Called when unmounting a component or disposing an effect
 */
export function popLifecycleContext(): void {
  const context = contextStack.pop();
  if (!context) {
    return;
  }

  // Run mount cleanup functions first (LIFO - last registered, first cleaned)
  if (context.mounted) {
    const mountCleanups = Array.from(context.mountCleanups).reverse();
    for (const cleanup of mountCleanups) {
      try {
        cleanup();
      } catch (error) {
        console.error('onMount cleanup error:', error);
      }
    }
  }

  // Run cleanup functions (LIFO - last registered, first cleaned)
  const cleanups = Array.from(context.cleanups).reverse();
  for (const cleanup of cleanups) {
    try {
      cleanup();
    } catch (error) {
      console.error('onCleanup error:', error);
    }
  }
}

/**
 * Flush all pending mount callbacks
 * Called after a component has been inserted into the DOM
 */
export function flushMounts(): void {
  // Flush mounts for all contexts in the stack (from root to current)
  for (const context of contextStack) {
    if (!context || context.mounted) {
      continue;
    }

    context.mounted = true;

    // Run all mount callbacks
    for (const callback of context.mountCallbacks) {
      try {
        const cleanup = callback();
        if (typeof cleanup === 'function') {
          context.mountCleanups.add(cleanup);
        }
      } catch (error) {
        console.error('onMount error:', error);
      }
    }
  }
}

/**
 * Register a callback to run after the component is mounted to the DOM.
 * 
 * Runs once after initial rendering. The callback can optionally return a cleanup
 * function that will be called when the component unmounts.
 * 
 * @param fn - Callback function to run after mount. Can return a cleanup function.
 * @throws Error if called inside createEffect
 * @throws Error if called outside a component context
 */
export function onMount(fn: () => void | (() => void)): void {
  const context = getCurrentContext();

  if (!context) {
    throw new Error(
      'onMount must be called within a component. ' +
      'Make sure you are calling onMount inside a component function.'
    );
  }

  if (insideEffect) {
    throw new Error(
      'onMount cannot be called inside createEffect. ' +
      'onMount is for component lifecycle. ' +
      'Use the cleanup return value from createEffect for effect cleanup.'
    );
  }

  // Add to mount callbacks - will be executed by flushMounts()
  context.mountCallbacks.add(fn);
}

/**
 * Register a cleanup callback that runs when the component unmounts.
 * 
 * Cleanup callbacks run in LIFO order (last registered = first cleaned).
 * If called inside an effect, the cleanup runs when the effect re-executes
 * or when the containing component unmounts.
 * 
 * @param fn - Cleanup callback function
 * @throws Error if called outside a component context
 */
export function onCleanup(fn: () => void): void {
  const context = getCurrentContext();

  if (!context) {
    throw new Error(
      'onCleanup must be called within a component or effect. ' +
      'Make sure you are calling onCleanup inside a component function or createEffect.'
    );
  }

  // Add to cleanups - will be executed by popLifecycleContext()
  context.cleanups.add(fn);
}

/**
 * Set the effect flag when entering/exiting an effect
 * This is used to prevent onMount from being called inside effects
 */
export function setInsideEffect(value: boolean): void {
  insideEffect = value;
  
  // Mark the current context as an effect context if we're entering an effect
  const context = getCurrentContext();
  if (context && value) {
    context.isEffect = true;
  }
}

/**
 * Create a root scope with its own lifecycle management.
 * Similar to SolidJS createRoot - useful for manual control.
 * 
 * @param fn - Function to run within the root scope
 * @returns The result of the function, plus a dispose function
 */
export function createRoot<T>(fn: (dispose: () => void) => T): { result: T; dispose: () => void } {
  pushLifecycleContext();
  
  let result: T;
  let disposed = false;
  
  const dispose = () => {
    if (!disposed) {
      disposed = true;
      popLifecycleContext();
    }
  };

  try {
    result = fn(dispose);
  } catch (error) {
    dispose();
    throw error;
  }

  return { result, dispose };
}

/**
 * Run a function within a component lifecycle context.
 * Used internally when rendering components.
 * 
 * @param fn - Function to run
 * @returns Result of the function
 */
export function runWithContext<T>(fn: () => T): T {
  pushLifecycleContext();
  
  try {
    const result = fn();
    return result;
  } catch (error) {
    // Clean up on error
    popLifecycleContext();
    throw error;
  }
}
