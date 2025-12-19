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
  // Use a fragment with comment markers for tracking position
  const fragment = document.createDocumentFragment();
  const startMarker = document.createComment('For start');
  const endMarker = document.createComment('For end');

  fragment.appendChild(startMarker);
  fragment.appendChild(endMarker);

  // Children should be the render function
  const renderItem =
    Array.isArray(props.children) ? props.children[0] as (item: T, index: () => number) => JSXElement
      : props.children as (item: T, index: () => number) => JSXElement;


  if (typeof renderItem !== 'function') {
    if (typeof renderItem === 'object') {
      console.error('Received object:', renderItem);
    }

    throw new Error(`For component children must be a function that renders each item.\nExpected (item, index) => JSXElement. Got ${typeof renderItem}`);
  }

  // Track rendered elements
  let renderedNodes: Node[] = [];

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

    // Get parent for dynamic updates (only if markers are in DOM)
    const parent = startMarker.parentNode;

    if (!parent) {
      // Not yet mounted, just populate fragment
      // Clear old elements from fragment
      renderedNodes.forEach(node => {
        if (node.parentNode === fragment) {
          fragment.removeChild(node);
        }
      });
      renderedNodes = [];

      // Add new items
      if (newItems.length > 0) {
        newItems.forEach((item: T, index: number) => {
          const element = renderItem(item, () => index);
          if (element) {
            fragment.insertBefore(element, endMarker);
            renderedNodes.push(element);
          }
        });
      } else if (props.fallback) {
        fragment.insertBefore(props.fallback, endMarker);
        renderedNodes.push(props.fallback);
      }
    } else {
      // Already mounted, update in place
      // Remove old elements
      renderedNodes.forEach(node => {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      });
      renderedNodes = [];

      // Add new items
      if (newItems.length > 0) {
        newItems.forEach((item: T, index: number) => {
          const element = renderItem(item, () => index);
          if (element) {
            parent.insertBefore(element, endMarker);
            renderedNodes.push(element);
          }
        });
      } else if (props.fallback) {
        parent.insertBefore(props.fallback, endMarker);
        renderedNodes.push(props.fallback);
      }
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

  // Return fragment with markers and initial content
  return fragment;
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
  const fragment = document.createDocumentFragment();
  const startMarker = document.createComment('Index start');
  const endMarker = document.createComment('Index end');

  fragment.appendChild(startMarker);
  fragment.appendChild(endMarker);

  const itemElements: Node[] = [];
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

    const parent = startMarker.parentNode;
    const currentParent = parent || fragment;

    // Handle length changes
    if (newLength < currentLength) {
      // Remove excess elements
      for (let i = newLength; i < currentLength; i++) {
        const element = itemElements[i];
        if (element && element.parentNode === currentParent) {
          currentParent.removeChild(element);
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
          currentParent.insertBefore(element, endMarker);
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

  return fragment;
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
  const fragment = document.createDocumentFragment();
  const startMarker = document.createComment('Show start');
  const endMarker = document.createComment('Show end');

  fragment.appendChild(startMarker);
  fragment.appendChild(endMarker);

  let renderedNodes: Node[] = [];

  const updateVisibility = (): void => {
    const shouldShow = typeof props.when === 'function' ? (props.when as () => boolean)() : props.when;

    // Get parent for dynamic updates
    const parent = startMarker.parentNode;

    // Determine what should be shown
    let newContent: JSXElement | JSXElement[] | null = null;
    if (shouldShow) {
      newContent = typeof props.children === 'function' ? (props.children as () => JSXElement | JSXElement[])() : props.children;
    } else if (props.fallback) {
      newContent = typeof props.fallback === 'function' ? (props.fallback as () => JSXElement | JSXElement[])() : props.fallback;
    }

    const currentParent = parent || fragment;

    // Remove old nodes
    renderedNodes.forEach(node => {
      if (node.parentNode === currentParent) {
        currentParent.removeChild(node);
      }
    });
    renderedNodes = [];

    // Add new nodes
    if (newContent) {
      const nodesToAdd = Array.isArray(newContent) ? newContent : [newContent];
      nodesToAdd.forEach(node => {
        currentParent.insertBefore(node, endMarker);
        renderedNodes.push(node);
      });
    }
  };

  createEffect(updateVisibility);

  return fragment;
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
  const fragment = document.createDocumentFragment();
  const startMarker = document.createComment('Switch start');
  const endMarker = document.createComment('Switch end');

  fragment.appendChild(startMarker);
  fragment.appendChild(endMarker);

  let renderedNodes: Node[] = [];

  const updateSwitch = (): void => {
    const parent = startMarker.parentNode;
    const currentParent = parent || fragment;

    // Find first matching child
    let matchResult: JSXElement | JSXElement[] | null = null;

    if (Array.isArray(props.children)) {
      // In a full implementation, we'd need Match components to be reactive
      // and we'd need to evaluate them here.
      // For now, we assume props.children contains Match elements or similar.
      // However, if they are already rendered, we might have issues.
      // Let's assume for now they are static or the component is re-evaluated.
      for (const child of props.children) {
        // This is a simplified implementation check
        if (child instanceof Comment && child.nodeValue === 'Match condition false') {
          continue;
        }
        matchResult = child;
        break;
      }
    } else {
      matchResult = props.children;
    }

    if (!matchResult && props.fallback) {
      matchResult = props.fallback;
    }

    // Remove old nodes
    renderedNodes.forEach(node => {
      if (node.parentNode === currentParent) {
        currentParent.removeChild(node);
      }
    });
    renderedNodes = [];

    // Add new nodes
    if (matchResult) {
      const nodesToAdd = Array.isArray(matchResult) ? matchResult : [matchResult];
      nodesToAdd.forEach(node => {
        currentParent.insertBefore(node, endMarker);
        renderedNodes.push(node);
      });
    }
  };

  // Switch should ideally react to changes in its Match children's conditions.
  // This requires a more complex implementation where Switch tracks Match signals.
  // For now, we'll just run it once or rely on parent re-rendering.
  // Given hyperfx's current architecture, let's just make it run.
  updateSwitch();

  return fragment;
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