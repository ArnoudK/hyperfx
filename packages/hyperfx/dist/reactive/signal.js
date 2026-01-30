/**
 * Custom Signal Implementation for HyperFX
 *
 * A simple, synchronous signal system optimized for reactive DOM updates.
 *
 */
// Global tracking context for automatic dependency detection
let currentComputation = null;
let isTracking = false;
const accessedSignals = new Set();
// Global signal registry for SSR serialization
const globalSignalRegistry = new Map();
let isSSRMode = false;
/**
 * Enable SSR mode for signal tracking
 */
export function enableSSRMode() {
    if (!isSSRMode) {
        isSSRMode = true;
        globalSignalRegistry.clear();
    }
}
/**
 * Disable SSR mode
 */
export function disableSSRMode() {
    isSSRMode = false;
}
/**
 * Get all registered signals for SSR serialization
 */
export function getRegisteredSignals() {
    return globalSignalRegistry;
}
/**
 * Register a signal with a key for SSR
 */
export function registerSignal(key, signal) {
    globalSignalRegistry.set(key, signal);
}
class SignalImpl {
    constructor(initialValue) {
        this.subscribers = new Set();
        this._value = initialValue;
    }
    /**
     * Get the current signal value
     */
    get() {
        // Track access if we're tracking dependencies
        if (isTracking) {
            accessedSignals.add(this.callableSignal);
        }
        return this._value;
    }
    /**
     * Set a new signal value and notify subscribers
     */
    set(newValue) {
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
            }
            catch (error) {
                console.error('Signal subscriber error:', error);
            }
        });
        return newValue;
    }
    /**
     * Subscribe to signal changes
     * Returns an unsubscribe function
     */
    subscribe(callback) {
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
    peek() {
        return this._value;
    }
    /**
     * Update value using a function
     */
    update(updater) {
        return this.set(updater(this._value));
    }
    /**
     * Get number of active subscribers (for debugging)
     */
    get subscriberCount() {
        return this.subscribers.size;
    }
}
/**
 * Create a new signal with callable API and object methods
 */
export function createSignal(initialValue, options) {
    const signal = new SignalImpl(initialValue);
    // Create callable function with methods
    const callableSignal = Object.assign((value) => {
        if (value !== undefined) {
            return signal.set(value);
        }
        return signal.get();
    }, {
        get: () => signal.get(),
        set: (value) => signal.set(value),
        subscribe: (callback) => signal.subscribe(callback),
        peek: () => signal.peek(),
        update: (updater) => signal.update(updater),
        key: options?.key
    });
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
            return globalSignalRegistry.get(options.key);
        }
        registerSignal(options.key, callableSignal);
    }
    return callableSignal;
}
/**
 * Create a computed signal that derives from other signals
 * Automatically tracks dependencies when accessed
 */
export function createComputed(computeFn) {
    // Track dependencies during computation
    const oldTracking = isTracking;
    isTracking = true;
    accessedSignals.clear();
    let initialValue;
    try {
        initialValue = computeFn();
    }
    finally {
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
    const unsubscribers = deps.map(dep => dep.subscribe(() => {
        // Recompute when dependency changes
        const newValue = computeFn();
        originalSet(newValue);
    }));
    // Add destroy method to clean up subscriptions
    const computedSignal = Object.assign(signal, {
        destroy: () => {
            // Unsubscribe from all dependencies
            unsubscribers.forEach(unsub => unsub());
            // Clear the unsubscribers array
            unsubscribers.length = 0;
        }
    });
    return computedSignal;
}
/**
 * Create an effect that runs when signals change
 * Effects automatically track dependencies and re-subscribe when they change
 */
export function createEffect(effectFn) {
    let cleanup;
    let unsubscribers = [];
    let isDisposed = false;
    let isRunning = false; // Prevent re-entrance during signal notifications
    let pendingRun = false; // Track if we should run after current execution
    // Function to run the effect and update subscriptions
    const runEffect = () => {
        if (isDisposed)
            return;
        // If already running, defer this run until current one completes
        if (isRunning) {
            pendingRun = true;
            return;
        }
        // Loop to stabilize when effects trigger themselves
        let iterations = 0;
        const MAX_ITERATIONS = 100;
        while (iterations < MAX_ITERATIONS) {
            pendingRun = false;
            // Unsubscribe from previous dependencies
            unsubscribers.forEach(unsub => unsub());
            unsubscribers = [];
            // Call previous cleanup if any
            if (typeof cleanup === 'function') {
                cleanup();
                cleanup = undefined;
            }
            // Track dependencies during effect run
            const oldTracking = isTracking;
            isTracking = true;
            accessedSignals.clear();
            try {
                // Run effect
                cleanup = effectFn();
            }
            finally {
                // Reset tracking
                isTracking = oldTracking;
            }
            // Subscribe to all accessed signals
            const dependencies = Array.from(accessedSignals);
            accessedSignals.clear();
            unsubscribers = dependencies.map(dep => dep.subscribe(() => {
                // Trigger effect to run (will be deferred if currently running)
                runEffect();
            }));
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
export function batch(fn) {
    // Simple implementation - just run the function
    // In a full implementation, this would defer notifications
    return fn();
}
/**
 * Run a function without tracking signal accesses
 * Useful for reading signals inside effects without creating dependencies
 */
export function untrack(fn) {
    const wasTracking = isTracking;
    isTracking = false;
    try {
        return fn();
    }
    finally {
        isTracking = wasTracking;
    }
}
/**
 * Utility to check if a value is a Signal
 */
export function isSignal(value) {
    return typeof value === 'function' && 'subscribe' in value && 'get' in value && 'set' in value;
}
/**
 * Get signal value, or return value if not a signal
 */
export function unwrapSignal(value) {
    return isSignal(value) ? value() : value;
}
export { createSignal as signal };
export { createComputed as computed };
export { createComputed as createMemo };
//# sourceMappingURL=signal.js.map