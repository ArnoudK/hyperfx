import { isSignal, createComputed as signal_createComputed } from "../../reactive/signal";
import type { Signal } from "../../reactive/signal";
import { addToBatch } from "./batching";
import type { NormalizedValue } from "./types";

// Track signal subscriptions for each element for cleanup
// Use globalThis to avoid multiple instances in mono-repos
const elementSubscriptions = (globalThis as any).__HYPERFX_ELEMENT_SUBSCRIPTIONS__ ||
  ((globalThis as any).__HYPERFX_ELEMENT_SUBSCRIPTIONS__ = new WeakMap<Element, Set<() => void>>());

// Track computed signals for each element so we can destroy them
const elementComputedSignals = (globalThis as any).__HYPERFX_ELEMENT_COMPUTED_SIGNALS__ ||
  ((globalThis as any).__HYPERFX_ELEMENT_COMPUTED_SIGNALS__ = new WeakMap<Element, Set<{ destroy: () => void }>>());

// Helper to handle reactive values (signals or functions)
export function handleReactiveValue(
  element: HTMLElement,
  key: string,
  value: any,
  setter: (el: HTMLElement, val: any) => void
): void {
  try {
    if (isSignal(value)) {
      // Check if this is a computed signal (has destroy method)
      const isComputed = typeof (value as any).destroy === 'function';
      if (isComputed) {
        addElementComputedSignal(element, value as any);
      }

      const update = () => {
        try {
          setter(element, value());
        } catch (error) {
          console.error(`Error updating ${key}:`, error);
          setter(element, ''); // Clear on error
        }
      };
      const unsubscribe = value.subscribe(() => addToBatch(update));
      addElementSubscription(element, unsubscribe);
      update(); // initial
    } else if (typeof value === 'function') {
      const computed = signal_createComputed(value as () => any);

      // Track the computed signal for cleanup
      addElementComputedSignal(element, computed);

      const update = () => {
        try {
          setter(element, computed());
        } catch (error) {
          console.error(`Error updating computed ${key}:`, error);
          setter(element, ''); // Clear on error
        }
      };
      const unsubscribe = computed.subscribe(() => addToBatch(update));
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

// Automatic cleanup using MutationObserver
if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver((mutations) => {
    try {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (typeof Element !== 'undefined' && node instanceof Element && (elementSubscriptions.has(node) || elementComputedSignals.has(node))) {
            cleanupElementSubscriptions(node);
          }
          // Also check child nodes recursively
          if (typeof Element !== 'undefined' && node instanceof Element) {
            node.querySelectorAll('*').forEach((child) => {
              if (elementSubscriptions.has(child) || elementComputedSignals.has(child)) {
                cleanupElementSubscriptions(child);
              }
            });
          }
        });
      });
    } catch (error) {
      // Ignore errors during test teardown when Element may be undefined
      if (typeof Element === 'undefined') return;
      console.error('Error in mutation observer:', error);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
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
}

/**
 * Track a computed signal for an element so it can be destroyed on cleanup
 */
export function addElementComputedSignal(element: Element, computed: { destroy: () => void }): void {
  const computedSignals = elementComputedSignals.get(element);
  if (!computedSignals) {
    elementComputedSignals.set(element, new Set([computed]));
  } else {
    computedSignals.add(computed);
  }
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
  const computedSignals = elementComputedSignals.get(element);
  if (computedSignals) {
    computedSignals.forEach((computed: { destroy: () => void }) => {
      try {
        computed.destroy();
      } catch (error) {
        console.error('Error destroying computed signal:', error);
      }
    });
    computedSignals.clear();
    elementComputedSignals.delete(element);
  }
}

// Normalize reactive values (utility function)
export function normalizeValue<T>(value: T | Signal<T> | (() => T)): NormalizedValue<T> {
  // Handle signals
  if (isSignal(value)) {
    return {
      isReactive: true,
      isFunction: false,
      getValue: () => {
        try {
          return value();
        } catch (error) {
          console.error('Error accessing signal value:', error);
          return undefined as T;
        }
      },
      subscribe: (callback: (v: T) => void) => {
        try {
          return value.subscribe(callback);
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