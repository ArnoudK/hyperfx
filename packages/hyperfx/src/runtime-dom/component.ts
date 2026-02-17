/**
 * Component creation and caching
 */

import { isAccessor } from '../reactive/signal';
import type { Accessor } from '../reactive/signal';

/**
 * Check if a value is a signal accessor
 */
function isSignalValue(value: unknown): value is Accessor<unknown> {
  return isAccessor(value);
}

/**
 * Unwrap component result - handles signals returned from components
 * This ensures components can return memo signals and they render correctly
 */
export function unwrapComponent<T>(result: T): (() => T) | T {
  if (isSignalValue(result)) {
    const accessor = result as Accessor<T>;
    const wrapper = () => accessor();
    // Copy subscribe method so it's treated as an accessor
    if (accessor.subscribe) {
      (wrapper as Accessor<T  >).subscribe = accessor.subscribe.bind(accessor);
    }
    (wrapper as Accessor<T> & { __isComponentResult?: true }).__isComponentResult = true;
    return wrapper;
  }
  return result;
}

/**
 * Component cache for createComponent
 * Maps component function + props key to cached result
 */
type CachedComponentResult = {
  props: Record<string, unknown>;
  result: unknown;
  dispose: (() => void) | null;
};

const componentCache = new WeakMap<Function, Map<string, CachedComponentResult>>();

/**
 * Create a component with proper memoization
 * Components are only re-executed when props change (shallow comparison)
 * This prevents computed signals from being recreated on every parent render
 */
export function createComponent<P extends Record<string, unknown>, R>(
  Component: (props: P) => R,
  props: P
): R {
  // Execute component
  const result = Component(props);

  // Never cache DOM results.
  // Reusing cached nodes across distinct renders (e.g. SSR -> hydration)
  // causes stale component instances and breaks hydration correctness.
  if (typeof Node !== 'undefined' && result instanceof Node) {
    return result;
  }
  
  // Don't cache reactive results (signals/accessors) as they manage their own state
  // and caching would return stale DOM elements on re-render
  if (isSignalValue(result)) {
    return result;
  }
  
  // Get or create cache for this component
  let componentCacheMap = componentCache.get(Component);
  if (!componentCacheMap) {
    componentCacheMap = new Map();
    componentCache.set(Component, componentCacheMap);
  }

  // Create a key from props (shallow comparison)
  const propsKey = JSON.stringify(
    Object.keys(props).sort().map(key => {
      const value = props[key];
      // For signals/functions, use a stable reference key
      if (typeof value === 'function') {
        return [key, 'function'];
      }
      return [key, value];
    })
  );

  // Check if we have a cached result
  const cached = componentCacheMap.get(propsKey);
  if (cached) {
    // Check if props actually changed (shallow comparison)
    let propsChanged = false;
    for (const key in props) {
      if (props[key] !== cached.props[key]) {
        propsChanged = true;
        break;
      }
    }
    if (!propsChanged) {
      return cached.result as R;
    }
    // Props changed, dispose old component
    if (cached.dispose) {
      cached.dispose();
    }
  }

  // Cache result for non-reactive components
  componentCacheMap.set(propsKey, {
    props: { ...props },
    result,
    dispose: null
  });

  return result;
}
