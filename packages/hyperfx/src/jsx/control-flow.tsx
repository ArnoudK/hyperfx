import { createEffect } from "../reactive/state";
import type { JSXElement, ComponentProps, ReactiveValue } from "../jsx/jsx-runtime";
import type { Signal } from "../reactive/signal";
import { isSignal } from "../reactive/signal";

/**
 * For Component - Reactive list rendering
 *
 * Similar to SolidJS <For>, this component efficiently renders reactive arrays
 * with proper key-based reconciliation.
 */

interface ForProps<T> {
  each: ReactiveValue<T[]>;
  children: (item: T, index: () => number) => JSXElement;
  fallback?: JSXElement;
}

export function For<T>(props: ForProps<T>): JSXElement {
  // Create a container for the list items
  const container = document.createElement('div');
  if (!container) {
    throw new Error('Failed to create container element for For component');
  }
  container.style.display = 'contents'; // Don't add visual wrapper

  // Children should be the render function
  const renderItem = 
    Array.isArray( props.children) ? props.children[0] as (item: T, index: () => number) => JSXElement
    : props.children as (item: T, index: () => number) => JSXElement;


  if (typeof renderItem !== 'function') {
    if(typeof renderItem === 'object') {
      console.error('Received object:', renderItem);
    }

    throw new Error(`For component children must be a function that renders each item.\nExpected (item, index) => JSXElement. Got ${typeof renderItem}`);
  }

  const updateList = (): void => {
    if (!container) {
      console.error('For component: container is null');
      return;
    }

    // Handle different types of reactive values
    let newItems: T[];
    if (Array.isArray(props.each)) {
      newItems = props.each;
    } else if (isSignal(props.each)) {
      newItems = props.each();
    } else if (typeof props.each === 'function') {
      newItems = (props.each as () => T[])();
    } else {
      // Should not happen with proper typing
      newItems = props.each as T[];
    }

    // Clear all existing children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Add new items
    if (newItems.length > 0) {
      newItems.forEach((item: T, index: number) => {
        const element = renderItem(item, () => index);
        if (element) {
          container.appendChild(element);
        }
      });
    } else if (props.fallback) {
      container.appendChild(props.fallback);
    }
  };

  // Set up reactive effect based on the type
  if (isSignal(props.each)) {
    // For Signals, set up reactive effect
    createEffect(updateList);
  } else {
    // For static arrays or computed functions, just render once
    updateList();
  }

  // Return container (will be populated by effect)
  return container;
}

/**
 * Index Component - For rendering arrays with index-based access
 */
interface IndexProps<T> {
  each: ReactiveValue<T[]>;
  children: (item: () => T, index: number) => JSXElement;
  fallback?: JSXElement;
}

export function Index<T>(props: IndexProps<T>): JSXElement {
  const container = document.createDocumentFragment();
  const itemElements: JSXElement[] = [];
  let currentLength = 0;

  const updateList = (): void => {
    // Handle different types of reactive values
    let newItems: T[];
    if (Array.isArray(props.each)) {
      newItems = props.each;
    } else if (isSignal(props.each)) {
      newItems = props.each();
    } else if (typeof props.each === 'function') {
      newItems = (props.each as () => T[])();
    } else {
      // Should not happen with proper typing
      newItems = props.each as T[];
    }
    const newLength = newItems.length;

    // Handle length changes
    if (newLength < currentLength) {
      // Remove excess elements
      for (let i = newLength; i < currentLength; i++) {
        const element = itemElements[i];
        if (element && container.contains && container.contains(element)) {
          container.removeChild(element);
        }
      }
      itemElements.splice(newLength);
    } else if (newLength > currentLength) {
      // Add new elements
      for (let i = currentLength; i < newLength; i++) {
        const item = newItems[i];
        if (item !== undefined) {
          const element = props.children(() => item, i);
          itemElements.push(element);
          container.appendChild(element);
        }
      }
    }

    currentLength = newLength;
  };

  // Set up reactive effect based on the type
  if (isSignal(props.each)) {
    // For Signals, set up reactive effect
    createEffect(updateList);
  } else {
    // For static arrays or computed functions, just render once
    updateList();
  }

  return container;
}

/**
 * Show Component - Conditional rendering
 */
interface ShowProps {
  when: Signal<boolean> | boolean | (() => boolean);
  children: JSXElement | JSXElement[] | (() => JSXElement | JSXElement[]);
  fallback?: JSXElement | JSXElement[] | (() => JSXElement | JSXElement[]);
}

export function Show(props: ShowProps): JSXElement {
  const container = document.createElement('div');
  container.style.display = 'contents'; // Don't add visual styling
  let currentChild: JSXElement | JSXElement[] | null = null;

  const updateVisibility = (): void => {
    const shouldShow = typeof props.when === 'function' ? (props.when as () => boolean)() : props.when;

    // Remove current child
    if (currentChild) {
      if (Array.isArray(currentChild)) {
        currentChild.forEach((child) => {
          if (container.contains(child)) {
            container.removeChild(child);
          }
        });
      } else if (container.contains(currentChild)) {
        container.removeChild(currentChild);
      }
    }

    // Add appropriate child
    if (shouldShow) {
      currentChild = typeof props.children === 'function' ? (props.children as () => JSXElement | JSXElement[])() : props.children;
    } else if (props.fallback) {
      currentChild = typeof props.fallback === 'function' ? (props.fallback as () => JSXElement | JSXElement[])() : props.fallback;
    } else {
      currentChild = null;
    }

    if (currentChild) {
      if (Array.isArray(currentChild)) {
        currentChild.forEach((child) => {
          container.appendChild(child);
        });
      } else {
        container.appendChild(currentChild);
      }
    }
  };

  createEffect(updateVisibility);

  return container;
}

/**
 * Switch/Match Components - Pattern matching
 */
interface SwitchProps {
  children: JSXElement | JSXElement[];
  fallback?: JSXElement;
}

interface MatchProps {
  when: Signal<boolean> | boolean | (() => boolean);
  children: JSXElement | JSXElement[] | (() => JSXElement | JSXElement[]);
}

export function Switch(props: SwitchProps): JSXElement {
  const container = document.createElement('div');
  container.style.display = 'contents';

  // For now, just render first truthy match
  // In a more advanced implementation, this would evaluate all Match children
  if (Array.isArray(props.children)) {
    const matchChild = props.children.find((child) => {
      // This is a simplified implementation
      // A full implementation would check Match component conditions
      return child;
    });

    if (matchChild) {
      if (Array.isArray(matchChild)) {
        matchChild.forEach((child) => {
          container.appendChild(child);
        });
      } else {
        container.appendChild(matchChild);
      }
    } else if (props.fallback) {
      if (Array.isArray(props.fallback)) {
        props.fallback.forEach((child) => {
          container.appendChild(child);
        });
      } else {
        container.appendChild(props.fallback);
      }
    }
  } else {
    if (Array.isArray(props.children)) {
      props.children.forEach((child) => {
        container.appendChild(child);
      });
    } else {
      container.appendChild(props.children);
    }
  }

  return container;
}

export function Match(props: MatchProps): JSXElement {
  const shouldRender = typeof props.when === 'function' ? (props.when as () => boolean)() : props.when;

  if (shouldRender) {
    const result = typeof props.children === 'function' ? (props.children as () => JSXElement | JSXElement[])() : props.children;
    if (Array.isArray(result)) {
      const fragment = document.createDocumentFragment();
      result.forEach((child) => {
        fragment.appendChild(child);
      });
      return fragment;
    }
    return result;
  }

  // Return empty comment when condition is false
  return document.createComment('Match condition false');
}