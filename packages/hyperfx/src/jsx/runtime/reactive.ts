import { getAccessor, createComputed, createEffect } from "../../reactive/signal";
import type { Accessor } from "../../reactive/signal";
import { addToBatch } from "./batching";
import type { NormalizedValue } from "./types";

// Track signal subscriptions for each element for cleanup
// Use module-scoped singletons (do not rely on globalThis)
const elementSubscriptions = new WeakMap<Element, Set<() => void>>();
type Destroyable = { destroy?: () => void };

const elementSignals = new WeakMap<Element, Set<Destroyable>>();
const elementSubscriptionSet = new Set<Element>();

let cleanupInterval: ReturnType<typeof setInterval> | null = null;

// MutationObserver ref-counting for proper cleanup
let observer: MutationObserver | null = null;
let mountCount = 0;

function ensureObserver(): MutationObserver | null {
  if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') {
    return null;
  }

  if (!observer) {
    observer = new MutationObserver((mutations) => {
      try {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (typeof Element !== 'undefined' && node instanceof Element) {
              if (elementSubscriptions.has(node) || elementSignals.has(node)) {
                cleanupElementSubscriptions(node);
              }
              node.querySelectorAll('*').forEach((child) => {
                if (elementSubscriptions.has(child) || elementSignals.has(child)) {
                  cleanupElementSubscriptions(child);
                }
              });
            }
          });
        });
      } catch (error) {
        if (typeof Element === 'undefined') return;
        console.error('Error in mutation observer:', error);
      }
    });

    const observeTarget = () => {
      if (typeof document === 'undefined') return;
      if (document.body) {
        observer!.observe(document.body, { childList: true, subtree: true });
        return;
      }

      const retry = () => {
        if (!document.body) {
          setTimeout(retry, 0);
          return;
        }
        observer!.observe(document.body, { childList: true, subtree: true });
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', retry, { once: true });
      } else {
        setTimeout(retry, 0);
      }
    };

    observeTarget();
  }

  return observer;
}

function ensureCleanupInterval(): void {
  if (cleanupInterval || typeof window === 'undefined' || typeof Element === 'undefined') {
    return;
  }

  cleanupInterval = setInterval(() => {
    const elementsToCheck = Array.from(elementSubscriptionSet);
    for (const element of elementsToCheck) {
      if (!element.isConnected) {
        cleanupElementSubscriptions(element);
      }
    }

    if (elementSubscriptionSet.size === 0 && cleanupInterval) {
      clearInterval(cleanupInterval);
      cleanupInterval = null;
    }
  }, 10);
}

/**
 * Increment mount count and ensure observer is running
 */
export function incrementMountCount(): void {
  mountCount++;
  ensureObserver();
}

/**
 * Decrement mount count and disconnect observer when no components are mounted
 */
export function decrementMountCount(): void {
  mountCount--;
  if (mountCount <= 0 && observer) {
    observer.disconnect();
    observer = null;
    mountCount = 0;
  }
}

/**
 * Force cleanup the observer immediately (for SSR or testing)
 */
export function forceCleanupObserver(): void {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  mountCount = 0;
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

// Helper to handle reactive values (signals or functions)
export function handleReactiveValue(
  element: HTMLElement,
  key: string,
  value: unknown,
  setter: (el: HTMLElement, val: unknown) => void
): void {
  try {
    const acc = getAccessor(value);
    // console.debug(`[reactive] handleReactiveValue key=${key} has acc=${!!acc}`);
    if (acc) {
      // Check if this is a computed signal (has destroy method)
      const isComputed = typeof acc.destroy === 'function';
      if (isComputed) {
        addElementSignal(element, acc);
      }

      // Use an effect to track dependencies and update the element when value changes
      const stop = createEffect(() => {
        try {
          const val = acc();
          setter(element, val);
        } catch (error) {
          console.error(`Error updating ${key}:`, error);
          try { setter(element, ''); } catch {}
        }
      });
      addElementSubscription(element, stop);
      // initial update handled by createEffect automatically
    } else if (typeof value === 'function') {
      const computed = createComputed(value as () => unknown);

      // Track the computed signal for cleanup
      addElementSignal(element, computed);

      const update = () => {
        try {
          const val = computed();
          setter(element, val);
        } catch (error) {
          console.error(`Error updating computed ${key}:`, error);
          setter(element, ''); // Clear on error
        }
      };
      const unsubscribe = computed.subscribe ? computed.subscribe(() => addToBatch(update)) : () => {};
      addElementSubscription(element, unsubscribe);
      update(); // initial
    } else {
      setter(element, value);
    }
  } catch (error) {
    console.error(`Error setting up reactivity for ${key}:`, error);
    // No fallback value set
  }
}

/**
 * Add a subscription to an element's cleanup list
 */
export function addElementSubscription(element: Element, unsubscribe: () => void): void {
  const subscriptions = elementSubscriptions.get(element);
  if (!subscriptions) {
    elementSubscriptions.set(element, new Set([unsubscribe]));
  } else {
    subscriptions.add(unsubscribe);
  }

  elementSubscriptionSet.add(element);
  ensureCleanupInterval();
}

/**
 * Track a computed signal for an element so it can be destroyed on cleanup
 */
export function addElementSignal<T>(element: Element, computed: Accessor<T> | { destroy?: () => void }): void {
  const Signals = elementSignals.get(element);
  if (!Signals) {
    elementSignals.set(element, new Set([computed]));
  } else {
    Signals.add(computed);
  }

  elementSubscriptionSet.add(element);
  ensureCleanupInterval();
}

/**
 * Clean up all signal subscriptions for an element
 */
export function cleanupElementSubscriptions(element: Element): void {
  // Clean up regular subscriptions
  const subscriptions = elementSubscriptions.get(element);
  if (subscriptions) {
    subscriptions.forEach((unsubscribe: () => void) => {
      try {
        unsubscribe();
      } catch (error) {
        console.error('Error during subscription cleanup:', error);
      }
    });
    subscriptions.clear();
    elementSubscriptions.delete(element);
  }

  // Clean up computed signals
  const Signals = elementSignals.get(element);
  if (Signals) {
    Signals.forEach((computed: { destroy?: () => void }) => {
      try {
        if (typeof computed.destroy === 'function') {
          computed.destroy();
        }
      } catch (error) {
        console.error('Error destroying computed signal:', error);
      }
    });
    Signals.clear();
    elementSignals.delete(element);
  }

  elementSubscriptionSet.delete(element);
}

// Normalize reactive values (utility function)
export function normalizeValue<T>(value: T | Accessor<T> | (() => T)): NormalizedValue<T> {
  // Handle signals (accessor or tuple)
  const acc = getAccessor(value);
  if (acc) {
    return {
      isReactive: true,
      isFunction: false,
      getValue: () => {
        try {
          return acc() as T;
        } catch (error) {
          console.error('Error accessing signal value:', error);
          return undefined as T;
        }
      },
      subscribe: (callback: (v: T) => void) => {
        try {
          return acc.subscribe ? acc.subscribe((v: unknown) => callback(v as T)) : () => {};
        } catch (error) {
          console.error('Error subscribing to signal:', error);
          return () => { };
        }
      }
    };
  }

  // Handle functions (non-signal)
  if (typeof value === 'function') {
    return {
      isReactive: false,
      isFunction: true,
      getValue: () => {
        try {
          return (value as () => T)();
        } catch (error) {
          console.error('Error executing function value:', error);
          return undefined as T;
        }
      },
      subscribe: undefined
    };
  }

  // Handle static values
  return {
    isReactive: false,
    isFunction: false,
    getValue: () => value,
    subscribe: undefined
  };
}
