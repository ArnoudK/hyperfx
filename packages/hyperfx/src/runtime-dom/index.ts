/**
 * Runtime DOM helpers for compiled HyperFX code
 * 
 * These functions are used by the compiler output to efficiently
 * create and update DOM elements.
 */

import { createEffect } from '../reactive/signal';

// Cache for parsed templates
const templateCache = new Map<string, Node>();

/**
 * Create a template from HTML string
 * Templates are cached and cloned for reuse
 * 
 * Note: On server, this creates a mock node structure
 */
export function template(html: string): Node {
  // Server-side: create a minimal mock that works with SSR
  if (typeof document === 'undefined') {
    // Return a mock node that has the HTML as innerHTML
    const mock: any = {
      nodeType: 1,
      nodeName: 'TEMPLATE',
      innerHTML: html,
      textContent: '',
      childNodes: [],
      children: [],
      cloneNode: function() {
        // On server, we don't actually clone - just return a similar mock
        return {
          ...this,
          innerHTML: html
        };
      }
    };
    return mock as Node;
  }
  
  // Client-side: use real template caching
  let node = templateCache.get(html);
  
  if (!node) {
    const template = document.createElement('template');
    template.innerHTML = html;
    node = template.content.firstChild!;
    templateCache.set(html, node);
  }
  
  return node.cloneNode(true);
}

/**
 * Insert reactive content into a DOM node
 * Automatically subscribes to signals and updates the content
 */
export function insert(
  parent: Node,
  accessor: (() => any) | any,
  marker?: Node | null,
  init?: any
): any {
  // If accessor is not a function, it's a static value
  if (typeof accessor !== 'function') {
    return insertExpression(parent, accessor, init, marker);
  }

  // For reactive values, create an effect that updates on change
  let current = init;
  createEffect(() => {
    current = insertExpression(parent, accessor(), current, marker);
  });
  
  return current;
}

/**
 * Insert an expression value into the DOM
 */
function insertExpression(
  parent: Node,
  value: any,
  current: any,
  marker?: Node | null,
  unwrapArray = true
): any {
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
      return insertArray(parent, value, current, marker);
    }
    value = String(value);
  }

  // Handle DOM nodes
  if (value instanceof Node) {
    if (current !== value) {
      if (current != null) {
        cleanChildren(parent, current, marker);
      }
      parent.insertBefore(value, marker || null);
    }
    return value;
  }

  // Handle primitives (string, number, boolean)
  const stringValue = String(value);
  
  if (current !== null && typeof current !== 'object') {
    // Update existing text node
    const node = marker ? marker.previousSibling : parent.lastChild;
    if (node instanceof Text) {
      node.data = stringValue;
    } else {
      const textNode = document.createTextNode(stringValue);
      parent.insertBefore(textNode, marker || null);
    }
  } else {
    // Create new text node
    const textNode = document.createTextNode(stringValue);
    if (current != null) {
      cleanChildren(parent, current, marker);
    }
    parent.insertBefore(textNode, marker || null);
  }

  return stringValue;
}

/**
 * Insert an array of values
 */
function insertArray(
  parent: Node,
  array: any[],
  current: any,
  marker?: Node | null
): any[] {
  const normalized: any[] = [];
  
  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    normalized.push(insertExpression(parent, value, null, marker, false));
  }
  
  return normalized;
}

/**
 * Clean up children between current and marker
 */
function cleanChildren(parent: Node, current: any, marker?: Node | null): void {
  if (Array.isArray(current)) {
    for (let i = 0; i < current.length; i++) {
      cleanChildren(parent, current[i], marker);
    }
  } else if (current instanceof Node) {
    parent.removeChild(current);
  } else {
    // Remove text node
    const node = marker ? marker.previousSibling : parent.lastChild;
    if (node) {
      parent.removeChild(node);
    }
  }
}

/**
 * Spread attributes onto an element
 */
export function spread<T extends Element>(
  element: T,
  accessor: () => Record<string, any>,
  isSVG?: boolean,
  skipChildren?: boolean
): void {
  const props = accessor();
  
  for (const prop in props) {
    const value = props[prop];
    
    // Skip children if requested
    if (skipChildren && prop === 'children') {
      continue;
    }
    
    // Handle special props
    if (prop === 'style') {
      if (typeof value === 'object' && element instanceof HTMLElement) {
        Object.assign(element.style, value);
      } else {
        element.setAttribute('style', value);
      }
    } else if (prop === 'class' || prop === 'className') {
      element.setAttribute('class', value);
    } else if (prop.startsWith('on')) {
      // Event handler - will be handled by delegate
      const eventName = prop.slice(2).toLowerCase();
      (element as any)[`on${eventName}`] = value;
    } else if (prop in element && !isSVG) {
      // Set as property
      (element as any)[prop] = value;
    } else {
      // Set as attribute
      element.setAttribute(prop, value);
    }
  }
}

/**
 * Event delegation system
 * 
 * Uses document-level listeners for better performance with many elements
 */

// Map of event types to their delegated listeners
const delegatedEvents = new Map<string, Set<Element>>();

// WeakMap to store element -> handler mappings
const elementHandlers = new WeakMap<Element, Map<string, EventListener>>();

/**
 * Events that should NOT be delegated (don't bubble or need special handling)
 */
const NON_DELEGATED_EVENTS = new Set([
  'blur',
  'focus',
  'load',
  'unload',
  'scroll',
  'error',
  'resize',
]);

/**
 * Setup document-level listener for an event type
 */
function setupDelegation(eventName: string): void {
  if (delegatedEvents.has(eventName)) return;
  
  const elements = new Set<Element>();
  delegatedEvents.set(eventName, elements);

  // Add document-level listener
  document.addEventListener(eventName, (event: Event) => {
    let target = event.target as Element | null;
    
    // Bubble up to find element with handler
    while (target && target !== document.documentElement) {
      if (elements.has(target)) {
        const handlers = elementHandlers.get(target);
        const handler = handlers?.get(eventName);
        
        if (handler) {
          handler.call(target, event);
          
          // Stop if handler called stopPropagation
          if (event.cancelBubble) break;
        }
      }
      
      target = target.parentElement;
    }
  }, { capture: false });
}

/**
 * Create a delegated event listener
 * Uses document-level delegation for better performance
 */
export function delegate<T extends Event>(
  element: Element,
  eventName: string,
  handler: (event: T) => void
): void {
  // Use direct binding for non-delegated events
  if (NON_DELEGATED_EVENTS.has(eventName)) {
    element.addEventListener(eventName, handler as EventListener);
    return;
  }

  // Setup delegation if needed
  setupDelegation(eventName);

  // Store handler for this element
  let handlers = elementHandlers.get(element);
  if (!handlers) {
    handlers = new Map();
    elementHandlers.set(element, handlers);
  }
  handlers.set(eventName, handler as EventListener);

  // Register element for this event type
  const elements = delegatedEvents.get(eventName)!;
  elements.add(element);
}

/**
 * Remove delegated event listener
 */
export function undelegate(element: Element, eventName: string): void {
  const handlers = elementHandlers.get(element);
  if (handlers) {
    handlers.delete(eventName);
    if (handlers.size === 0) {
      elementHandlers.delete(element);
    }
  }

  const elements = delegatedEvents.get(eventName);
  if (elements) {
    elements.delete(element);
  }
}

/**
 * Remove all delegated events for an element
 */
export function undelegateAll(element: Element): void {
  const handlers = elementHandlers.get(element);
  if (!handlers) return;

  for (const eventName of handlers.keys()) {
    const elements = delegatedEvents.get(eventName);
    if (elements) {
      elements.delete(element);
    }
  }

  elementHandlers.delete(element);
}

/**
 * Assign a property to an element
 */
export function assign<T extends Element>(
  element: T,
  prop: string,
  value: any
): void {
  if (prop in element) {
    (element as any)[prop] = value;
  } else {
    element.setAttribute(prop, value);
  }
}

/**
 * Set a property on an element with special handling for common attributes
 */
export function setProp<T extends Element>(
  element: T,
  prop: string,
  value: any
): void {
  // Handle null/undefined - remove attribute
  if (value == null) {
    if (prop in element && !(element instanceof SVGElement)) {
      (element as any)[prop] = null;
    } else {
      element.removeAttribute(prop);
    }
    return;
  }

  // Special handling for common attributes
  if (prop === 'class' || prop === 'className') {
    if (element instanceof HTMLElement || element instanceof SVGElement) {
      element.setAttribute('class', String(value));
    }
  } else if (prop === 'style') {
    if (typeof value === 'object' && element instanceof HTMLElement) {
      // Style object
      Object.assign(element.style, value);
    } else {
      element.setAttribute('style', String(value));
    }
  } else if (prop === 'value' && element instanceof HTMLInputElement) {
    // Special handling for input value
    element.value = value;
  } else if (prop === 'checked' && element instanceof HTMLInputElement) {
    element.checked = Boolean(value);
  } else if (prop in element && !(element instanceof SVGElement)) {
    // Set as property for HTML elements
    (element as any)[prop] = value;
  } else {
    // Set as attribute
    if (typeof value === 'boolean') {
      if (value) {
        element.setAttribute(prop, '');
      } else {
        element.removeAttribute(prop);
      }
    } else {
      element.setAttribute(prop, String(value));
    }
  }
}

/**
 * Create an effect wrapper (re-export from signal system)
 */
export function effect(fn: () => void | (() => void)): () => void {
  return createEffect(fn);
}

/**
 * Conditional rendering helper
 * Efficiently switches between two branches based on a condition
 */
export function show<T, U>(
  parent: Node,
  condition: () => boolean,
  whenTrue: () => T,
  whenFalse: () => U,
  marker?: Node | null
): void {
  let current: any = undefined;
  let currentBranch: 'true' | 'false' | null = null;

  createEffect(() => {
    const value = condition();
    const nextBranch = value ? 'true' : 'false';

    // Only update if branch changed
    if (currentBranch !== nextBranch) {
      currentBranch = nextBranch;
      const result = value ? whenTrue() : whenFalse();
      current = insertExpression(parent, result, current, marker);
    }
  });
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
  let items: readonly T[] = [];
  let mapped: any[] = [];
  let nodes: Node[] = [];

  createEffect(() => {
    const newItems = accessor();
    
    // Full rebuild for now - can be optimized with diffing later
    const newMapped: any[] = [];
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

    items = newItems;
    mapped = newMapped;
    nodes = newNodes;
  });
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

  createEffect(() => {
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
      const index = newKeys.indexOf(key);
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
    fallback?: () => any;
  },
  marker?: Node | null
): void {
  let items: readonly T[] = [];
  let mapped: any[] = [];
  let nodes: Node[] = [];

  createEffect(() => {
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
      
      items = [];
      mapped = [];
      return;
    }

    // TODO: Implement efficient keyed diffing
    // For now, simple rebuild
    mapArray(parent, accessor, mapFn, marker);
  });
}
