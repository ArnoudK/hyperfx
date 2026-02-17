/**
 * Control flow helpers - conditionals and loops
 */

import { createEffect } from '../reactive/signal';
import { addElementSubscription } from '../jsx/runtime/reactive';
import type { Insertable, InsertResult } from './insert';

/**
 * Create an effect wrapper (re-export from signal system)
 */
export function effect(fn: () => void | (() => void)): () => void {
  return createEffect(fn);
}

export function effectOn(element: Element, fn: () => void | (() => void)): () => void {
  const stop = createEffect(fn);
  addElementSubscription(element, stop);
  return stop;
}

/**
 * Conditional rendering helper
 * Efficiently switches between two branches based on a condition
 */
export function show<T extends Insertable, U extends Insertable>(
  parent: Node,
  condition: () => boolean,
  whenTrue: () => T,
  whenFalse: () => U,
  marker?: Node | null
): void {
  let current: InsertResult = null;
  let currentBranch: 'true' | 'false' | null = null;

  const stop = createEffect(() => {
    const value = condition();
    const nextBranch = value ? 'true' : 'false';

    // Only update if branch changed
    if (currentBranch !== nextBranch) {
      currentBranch = nextBranch;
      const result = value ? whenTrue() : whenFalse();
      // insertExpression is imported from insert.ts
      current = insertExpression(parent, result, current, marker);
    }
  });

  if (parent instanceof Element) {
    addElementSubscription(parent, stop);
  }
}

/**
 * List rendering helper with keyed updates
 * Maps an array to DOM elements efficiently
 */
export function mapArray<T, U>(
  parent: Node,
  accessor: () => readonly T[],
  mapFn: (item: T, index: () => number) => U,
  marker?: Node | null
): void {
  let nodes: Node[] = [];

  const stop = createEffect(() => {
    const newItems = accessor();

    // Full rebuild for now - can be optimized with diffing later
    const newMapped: unknown[] = [];
    const newNodes: Node[] = [];

    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i]!;
      const index = () => i;
      const result = mapFn(item, index);
      newMapped.push(result);

      // Create node from result
      if (result instanceof Node) {
        newNodes.push(result);
      } else {
        const textNode = document.createTextNode(String(result));
        newNodes.push(textNode);
      }
    }

    // Remove old nodes
    for (const node of nodes) {
      node.parentNode?.removeChild(node);
    }

    // Insert new nodes
    const insertBefore = marker || null;
    for (const node of newNodes) {
      parent.insertBefore(node, insertBefore);
    }


    nodes = newNodes;
  });

  if (parent instanceof Element) {
    addElementSubscription(parent, stop);
  }
}

/**
 * Keyed list rendering with efficient diffing
 * Only updates/moves/adds/removes items that changed
 */
export function mapArrayKeyed<T, U>(
  parent: Node,
  accessor: () => readonly T[],
  mapFn: (item: T, index: () => number) => U,
  keyFn: (item: T, index: number) => string | number,
  marker?: Node | null
): void {
  // Track items by key
  let keyToNode = new Map<string | number, Node>();
  let keyToItem = new Map<string | number, T>();
  let keyToIndex = new Map<string | number, () => number>();
  let keys: (string | number)[] = [];

  const stop = createEffect(() => {
    const newItems = accessor();
    const newKeys: (string | number)[] = [];
    const newKeyToNode = new Map<string | number, Node>();
    const newKeyToItem = new Map<string | number, T>();
    const newKeyToIndex = new Map<string | number, () => number>();

    // Build key map for new items
    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i]!;
      const key = keyFn(item, i);
      newKeys.push(key);
      newKeyToItem.set(key, item);
    }

    // Find operations needed
    const toRemove: (string | number)[] = [];
    const toAdd: (string | number)[] = [];
    const toMove: Array<{ key: string | number; from: number; to: number }> = [];

    // Detect removals
    for (const oldKey of keys) {
      if (!newKeys.includes(oldKey)) {
        toRemove.push(oldKey);
      }
    }

    // Detect additions and moves
    for (let newIndex = 0; newIndex < newKeys.length; newIndex++) {
      const key = newKeys[newIndex]!;
      const oldIndex = keys.indexOf(key);

      if (oldIndex === -1) {
        // New item
        toAdd.push(key);
      } else if (oldIndex !== newIndex) {
        // Moved item
        toMove.push({ key, from: oldIndex, to: newIndex });
      }
    }

    // Remove deleted items
    for (const key of toRemove) {
      const node = keyToNode.get(key);
      if (node?.parentNode) {
        node.parentNode.removeChild(node);
      }
      keyToNode.delete(key);
      keyToItem.delete(key);
      keyToIndex.delete(key);
    }

    // Create nodes for new items
    for (const key of toAdd) {
      const item = newKeyToItem.get(key)!;
      const indexGetter = () => newKeys.indexOf(key);
      const result = mapFn(item, indexGetter);

      let node: Node;
      if (result instanceof Node) {
        node = result;
      } else {
        node = document.createTextNode(String(result));
      }

      newKeyToNode.set(key, node);
      newKeyToIndex.set(key, indexGetter);
    }

    // Reuse existing nodes
    for (const key of newKeys) {
      if (keyToNode.has(key) && !toAdd.includes(key)) {
        newKeyToNode.set(key, keyToNode.get(key)!);
        newKeyToIndex.set(key, keyToIndex.get(key)!);
      }
    }

    // Apply moves and insertions in correct order
    // We need to insert nodes in their final positions
    const insertBefore = marker || null;
    const nodesToInsert: Node[] = [];

    for (const key of newKeys) {
      const node = newKeyToNode.get(key)!;
      nodesToInsert.push(node);
    }

    // Remove all nodes from DOM temporarily (only the ones that need repositioning)
    for (const node of nodesToInsert) {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }

    // Insert in correct order
    for (const node of nodesToInsert) {
      parent.insertBefore(node, insertBefore);
    }

    // Update state
    keys = newKeys;
    keyToNode = newKeyToNode;
    keyToItem = newKeyToItem;
    keyToIndex = newKeyToIndex;
  });

  if (parent instanceof Element) {
    addElementSubscription(parent, stop);
  }
}

/**
 * Optimized For loop with keyed diffing
 * Similar to SolidJS <For> component
 */
export function forLoop<T, U>(
  parent: Node,
  accessor: () => readonly T[],
  mapFn: (item: T, index: () => number) => U,
  options?: {
    fallback?: () => Insertable;
  },
  marker?: Node | null
): void {

  let nodes: Node[] = [];

  const stop = createEffect(() => {
    const newItems = accessor();

    // Handle empty array
    if (newItems.length === 0 && options?.fallback) {
      // Remove all nodes
      for (const node of nodes) {
        node.parentNode?.removeChild(node);
      }

      const fallbackResult = options.fallback();
      if (fallbackResult instanceof Node) {
        parent.insertBefore(fallbackResult, marker || null);
        nodes = [fallbackResult];
      }

      return;
    }

    // Use a simple rebuild for now
    mapArray(parent, accessor, mapFn, marker);
  });

  if (parent instanceof Element) {
    addElementSubscription(parent, stop);
  }
}

// Import insertExpression - this will be resolved when we update the main index.ts
import { insertExpression } from './insert';
