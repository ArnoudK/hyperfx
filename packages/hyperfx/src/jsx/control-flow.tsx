import { createEffect } from "../reactive/state";
import type { JSXElement, ComponentProps, ReactiveValue } from "../jsx/jsx-runtime";
import type { Signal } from "../reactive/signal";
import { isSignal, createSignal } from "../reactive/signal";

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

  // Track rendered items and their DOM nodes
  // We handle duplicates by storing a list of instances for each value
  type ItemInstance = {
    nodes: Node[];
    indexSignal: Signal<number>;
  };

  const instanceMap = new Map<T, ItemInstance[]>();

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
      newItems = props.each as T[];
    }



    // Ensure newItems is an array

    // Ensure newItems is an array
    if (!Array.isArray(newItems)) {
      newItems = [];
    }

    const parent = startMarker.parentNode || fragment;

    // 1. Allocation Phase
    // Assign instances to new items (reusing old ones where possible)
    const newInstances: ItemInstance[] = [];
    const availableInstances = new Map<T, ItemInstance[]>();

    // Clone currently active instances to available map
    instanceMap.forEach((instances, item) => {
      availableInstances.set(item, [...instances]);
    });

    // Allocate
    newItems.forEach((item, index) => {
      let instance: ItemInstance;
      // Cast item to T to satisfy Map.get if item is inferred as T | undefined
      const stack = availableInstances.get(item as T);

      if (stack && stack.length > 0) {
        // Reuse existing
        instance = stack.shift()!;
        // Update index signal
        instance.indexSignal(index);
      } else {
        // Create new
        const indexSignal = createSignal(index);
        const element = renderItem(item, indexSignal);

        let nodes: Node[] = [];
        if (element instanceof DocumentFragment) {
          nodes = Array.from(element.childNodes);
        } else if (element) {
          nodes = [element as Node];
        }

        instance = { nodes, indexSignal };
      }
      newInstances.push(instance);
    });

    // 2. Cleanup Phase
    // Remove nodes for instances that weren't reused
    availableInstances.forEach((stack) => {
      stack.forEach(instance => {
        instance.nodes.forEach(node => {
          if (node.parentNode === parent) {
            parent.removeChild(node);
          }
        });
      });
    });

    // 3. Insertion/Reordering Phase
    // Sync DOM with new order
    // We use a marker cursor strategy
    let cursor = startMarker.nextSibling;

    newInstances.forEach(instance => {
      const nodes = instance.nodes;
      if (nodes.length === 0) return;

      // Check if the first node is at the cursor
      const firstNode = nodes[0];

      if (firstNode === cursor) {
        // Already in place, advance cursor past these nodes
        // (Assuming nodes are contiguous and in order, which strict DOM manipulation maintains)
        let lastNode = nodes[nodes.length - 1]!;
        cursor = lastNode.nextSibling;
      } else {
        // Not in place (or new), insert before cursor
        // Note: insertBefore moves the node if it's already elsewhere in DOM
        nodes.forEach(node => {
          parent.insertBefore(node, cursor); // cursor can be null (end) or endMarker
        });
        // Cursor stays waiting for the *next* item, 
        // because we just inserted *before* it. 
        // Wait: if we inserted, the inserted nodes are now *before* the cursor.
        // The cursor still points to the node that was effectively "pushed right".
        // So we don't update cursor. We move on to the next instance, 
        // which will be checked against the SAME cursor.
      }
    });

    // Update instance map for next render
    instanceMap.clear();
    newInstances.forEach((instance, i) => {
      const item = newItems[i] as T;
      const stack = instanceMap.get(item) || [];
      stack.push(instance);
      instanceMap.set(item, stack);
    });
  };

  // Set up reactive effect based on the type
  if (typeof props.each === 'function') {
    createEffect(updateList);
  } else {
    updateList();
  }

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