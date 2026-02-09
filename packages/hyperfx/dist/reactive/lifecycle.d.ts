/**
 * Lifecycle Hooks for HyperFX
 *
 * Provides onMount and onCleanup hooks for component lifecycle management.
 * Integrates with the reactive system for proper cleanup.
 */
/**
 * Check if we're currently inside an effect
 */
export declare function isInsideEffect(): boolean;
/**
 * Push a new lifecycle context onto the stack
 * Called when entering a component
 */
export declare function pushLifecycleContext(isEffectContext?: boolean): void;
/**
 * Pop the current lifecycle context and run all cleanups
 * Called when unmounting a component or disposing an effect
 */
export declare function popLifecycleContext(): void;
/**
 * Flush all pending mount callbacks
 * Called after a component has been inserted into the DOM
 */
export declare function flushMounts(): void;
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
export declare function onMount(fn: () => void | (() => void)): void;
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
export declare function onCleanup(fn: () => void): void;
/**
 * Set the effect flag when entering/exiting an effect
 * This is used to prevent onMount from being called inside effects
 */
export declare function setInsideEffect(value: boolean): void;
/**
 * Create a root scope with its own lifecycle management.
 * Similar to SolidJS createRoot - useful for manual control.
 *
 * @param fn - Function to run within the root scope
 * @returns The result of the function, plus a dispose function
 */
export declare function createRoot<T>(fn: (dispose: () => void) => T): {
    result: T;
    dispose: () => void;
};
/**
 * Run a function within a component lifecycle context.
 * Used internally when rendering components.
 *
 * @param fn - Function to run
 * @returns Result of the function
 */
export declare function runWithContext<T>(fn: () => T): T;
