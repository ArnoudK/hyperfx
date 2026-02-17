/**
 * DOM insertion and manipulation functions
 */

import { createEffect, isAccessor } from '../reactive/signal';
import type { Accessor } from '../reactive/signal';
import type { JSXElement } from '../jsx/runtime/types';
import { addElementSubscription, addElementSignal } from '../jsx/runtime/reactive';
import { isHydrationEnabled } from '../jsx/runtime/hydration';

export type InsertableValue = Node | string | number | boolean | null | undefined | DocumentFragment;
export type Insertable =
  | JSXElement
  | InsertableValue
  | InsertableValue[]
  | (() => InsertableValue | JSXElement | InsertableValue[] | JSXElement[])
  | Accessor<InsertableValue>
  | Accessor<JSXElement>;
export type InsertResult = InsertableValue | Node | { _node: Text; toString: () => string; _cleanup?: () => void } | InsertResult[] | null;

/**
 * Check if a value is a signal accessor
 */
function isSignalValue(value: unknown): value is Accessor<unknown> {
  return isAccessor(value);
}

/**
 * Insert reactive content into a DOM node
 * Automatically subscribes to signals and updates the content
 */
export function insert(
  parent: Node,
  accessor: Accessor<InsertableValue> | Insertable,
  marker?: Node | null,
  init?: InsertResult
): InsertResult {
  if (isSignalValue(accessor)) {
    return insertExpression(parent, accessor, init, marker);
  }
  // If accessor is not a function, it's a static value
  if (typeof accessor !== 'function') {
    return insertExpression(parent, accessor, init, marker);
  }

  let parentNode: Node = parent;
  let current = init;

  const resolveParent = (): Node | null => {
    if (marker && marker.parentNode) {
      return marker.parentNode;
    }

    if (Array.isArray(current)) {
      for (let i = 0; i < current.length; i++) {
        const entry = current[i];
        if (entry instanceof Node && entry.parentNode) {
          return entry.parentNode;
        }
        if (entry && typeof entry === 'object') {
          const node = (entry as { _node?: Text })._node;
          if (node && node.parentNode) {
            return node.parentNode;
          }
        }
      }
      return null;
    }

    if (current instanceof Node && current.parentNode) {
      return current.parentNode;
    }

    if (current && typeof current === 'object') {
      const node = (current as { _node?: Text })._node;
      if (node && node.parentNode) {
        return node.parentNode;
      }
    }

    return null;
  };

  // For reactive values, create an effect that updates on change
  const stop = createEffect(() => {
    if (typeof DocumentFragment !== 'undefined' && parentNode instanceof DocumentFragment) {
      const resolved = resolveParent();
      if (resolved) {
        parentNode = resolved;
      }
    }

    current = insertExpression(parentNode, accessor(), current, marker);

    if (typeof DocumentFragment !== 'undefined' && parentNode instanceof DocumentFragment) {
      const resolved = resolveParent();
      if (resolved) {
        parentNode = resolved;
      }
    }
  });

  if (parent instanceof Element) {
    addElementSubscription(parent, stop);
  }

  return current;
}

export function markerSlot(
  accessor: Accessor<InsertableValue> | Insertable,
  markerId = 'hfx:slot'
): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const startMarker = document.createComment(markerId);
  const endMarker = document.createComment(`${markerId}:end`);
  fragment.appendChild(startMarker);
  fragment.appendChild(endMarker);

  const resolveValue = (): InsertableValue | JSXElement => {
    if (isSignalValue(accessor)) {
      return (accessor as Accessor<InsertableValue | JSXElement>)();
    }

    if (typeof accessor === 'function') {
      return (accessor as () => InsertableValue | JSXElement)();
    }

    return accessor as InsertableValue | JSXElement;
  };

  const wrapped = () => {
    const parent = endMarker.parentNode;
    if (parent) {
      let node = startMarker.nextSibling;
      while (node && node !== endMarker) {
        const next = node.nextSibling;
        parent.removeChild(node);
        node = next;
      }
    }
    return resolveValue();
  };

  insert(fragment, wrapped, endMarker);
  return fragment;
}

/**
 * Insert an expression value into the DOM
 */
export function insertExpression(
  parent: Node,
  value: Insertable,
  current: InsertResult,
  marker?: Node | null,
  unwrapArray = true
): InsertResult {
  const hydrating = isHydrationEnabled();
  if (hydrating && marker && marker.nodeType === 8 && marker.textContent && (marker.textContent === 'hfx:dyn' || marker.textContent.startsWith('hfx:dyn:') || marker.textContent.startsWith('#'))) {
    const prev = marker.previousSibling;
    const next = marker.nextSibling;
    const reuse = (prev && prev.nodeType === 3) ? prev : (next && next.nodeType === 3 ? next : null);
    if (reuse && current === undefined) {
      const textNode = reuse as Text;
      const valueText = value == null ? '' : String(value);
      if (textNode.data !== valueText) {
        textNode.data = valueText;
      }
      return { _node: textNode, toString: () => textNode.data };
    }
  }
  // Handle null/undefined
  if (value == null) {
    if (current !== null && current !== undefined) {
      cleanChildren(parent, current, marker);
    }
    return null;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    if (unwrapArray) {
      if (current != null) {
        cleanChildren(parent, current, marker);
      }
      return insertArray(parent, value, current, marker);
    }
    value = String(value);
  }

  if (typeof DocumentFragment !== 'undefined' && value instanceof DocumentFragment) {
    if (current != null) {
      cleanChildren(parent, current, marker);
    }
    const nodes = Array.from(value.childNodes);
    const insertBeforeNode = (marker && marker.parentNode === parent) ? marker : null;
    for (let i = 0; i < nodes.length; i++) {
      parent.insertBefore(nodes[i]!, insertBeforeNode);
    }
    return nodes;
  }

  // Handle DOM nodes
  if (value instanceof Node) {
    if (current !== value) {
      if (current != null) {
        cleanChildren(parent, current, marker);
      }
      // Check if marker is still in the DOM, otherwise append at the end
      const insertBeforeNode = (marker && marker.parentNode === parent) ? marker : null;
      parent.insertBefore(value, insertBeforeNode);
    }
    return value;
  }

  // Handle accessors (callable signals) - create reactive effect for accessor values
  if (isAccessor(value)) {
    const initialResult = value();
    
    // Check if accessor returns DOM nodes
    if (initialResult instanceof Node) {
      // Accessor returns DOM nodes - need to handle insertion/replacement
      const insertBeforeNode = (marker && marker.parentNode === parent) ? marker : null;
      parent.insertBefore(initialResult, insertBeforeNode);
      
      let currentNode: Node = initialResult;
      
      // Create effect to handle node replacement when accessor changes
      const stop = createEffect(() => {
        const newResult = value();
        if (newResult !== currentNode) {
          if (newResult instanceof Node) {
            // Replace with new DOM node
            if (currentNode.parentNode === parent) {
              parent.replaceChild(newResult, currentNode);
            } else {
              parent.insertBefore(newResult, insertBeforeNode);
            }
            currentNode = newResult;
          } else {
            // Accessor now returns primitive - convert to text node
            const textNode = document.createTextNode(String(newResult));
            if (currentNode.parentNode === parent) {
              parent.replaceChild(textNode, currentNode);
            } else {
              parent.insertBefore(textNode, insertBeforeNode);
            }
            currentNode = textNode;
          }
        }
      });
      
      if (parent instanceof Element) {
        addElementSubscription(parent, stop);
      }

      const hasDestroy = typeof value.destroy === 'function';
      if (hasDestroy && parent instanceof Element) {
        addElementSignal(parent, value);
      }
      
      return currentNode;
    } else {
      // Accessor returns primitives - use text node approach
      const textNode = document.createTextNode(String(initialResult));
      const insertBeforeNode = (marker && marker.parentNode === parent) ? marker : null;
      parent.insertBefore(textNode, insertBeforeNode);
      
      // Create effect to update when accessor changes
      const stop = createEffect(() => {
        textNode.data = String(value());
      });
      
      if (parent instanceof Element) {
        addElementSubscription(parent, stop);
      }

      const hasDestroy = typeof value.destroy === 'function';
      if (hasDestroy && parent instanceof Element) {
        addElementSignal(parent, value);
      }
      
      return { _node: textNode, toString: () => textNode.data, _cleanup: stop };
    }
  }

  // Handle primitives (string, number, boolean)
  const stringValue = String(value);

  if (current && typeof current === 'object' && (current as { _node?: Text })._node instanceof Text) {
    const node = (current as { _node: Text })._node;
    node.data = stringValue;
    return current;
  }

  if (hydrating) {
    const existing = marker && marker.parentNode === parent ? marker.previousSibling : parent.lastChild;
    if (existing instanceof Text) {
      if (current === undefined || existing.data === stringValue) {
        existing.data = stringValue;
        return { _node: existing, toString: () => stringValue };
      }
    }
  }

  const textNode = document.createTextNode(stringValue);
  if (current != null) {
    cleanChildren(parent, current, marker);
  }
  const insertBeforeNode = (marker && marker.parentNode === parent) ? marker : null;
  parent.insertBefore(textNode, insertBeforeNode);
  return { _node: textNode, toString: () => stringValue };

  return stringValue;
}

/**
 * Insert an array of values
 */
function insertArray(
  parent: Node,
  array: Insertable[],
  _current: InsertResult,
  marker?: Node | null
): InsertResult[] {
  const normalized: InsertResult[] = [];

  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    normalized.push(insertExpression(parent, value, null, marker, false));
  }

  return normalized;
}

/**
 * Clean up children between current and marker
 */
function cleanChildren(parent: Node, current: InsertResult, marker?: Node | null): void {
  if (Array.isArray(current)) {
    for (let i = 0; i < current.length; i++) {
      cleanChildren(parent, current[i], marker);
    }
  } else if (current && typeof current === 'object' && (current as { _node?: Text })._node instanceof Text) {
    const node = (current as { _node: Text })._node;
    if (node.parentNode === parent) {
      parent.removeChild(node);
    }
  } else if (current instanceof Node) {
    if (current.parentNode === parent) {
      parent.removeChild(current);
    }
  } else {
    // Remove text node
    const node = marker ? marker.previousSibling : parent.lastChild;
    if (node && node.parentNode === parent) {
      parent.removeChild(node);
    }
  }
}
