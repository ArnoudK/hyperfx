/**
 * Runtime DOM helpers for compiled HyperFX code
 * 
 * These functions are used by the compiler output to efficiently
 * create and update DOM elements.
 */

import { createEffect, isAccessor, getAccessor } from '../reactive/signal';
import type { Accessor } from '../reactive/signal';
import type { JSXElement } from '../jsx/runtime/types';
import { addElementSubscription, addElementSignal } from '../jsx/runtime/reactive';
import { isHydrationEnabled } from '../jsx/runtime/hydration';

type TemplateNode = Node & { t?: string; __ssr?: boolean; cloneNode: (deep?: boolean) => Node };
  
export type InsertableValue = Node | string | number | boolean | null | undefined | DocumentFragment;
export type Insertable =
  | JSXElement
  | InsertableValue
  | InsertableValue[]
  | (() => InsertableValue | JSXElement | InsertableValue[] | JSXElement[])
  | Accessor<InsertableValue>
  | Accessor<JSXElement>;
type InsertResult = InsertableValue | Node | { _node: Text; toString: () => string; _cleanup?: () => void } | InsertResult[] | null;

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
      (wrapper as Accessor<T>).subscribe = accessor.subscribe.bind(accessor);
    }
    (wrapper as any).__isComponentResult = true;
    return wrapper;
  }
  return result;
}

/**
 * Component cache for createComponent
 * Maps component function + props key to cached result
 */
const componentCache = new WeakMap<Function, Map<string, { props: any; result: any; dispose: (() => void) | null }>>();

/**
 * Create a component with proper memoization
 * Components are only re-executed when props change (shallow comparison)
 * This prevents computed signals from being recreated on every parent render
 */
export function createComponent<P extends Record<string, any>>(
  Component: (props: P) => any,
  props: P
): any {
  // Execute component
  const result = Component(props);
  
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
      return cached.result;
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

const TEMPLATE_CACHE_MAX_SIZE = 1000;

interface LRUNode<T> {
  value: T;
  next?: LRUNode<T>;
  prev?: LRUNode<T>;
}

class LRUCache<T> {
  private cache = new Map<string, LRUNode<T>>();
  private head?: LRUNode<T>;
  private tail?: LRUNode<T>;
  private currentSize = 0;

  constructor(private maxSize: number) {}

  get(key: string): T | undefined {
    const node = this.cache.get(key);
    if (!node) return undefined;
    this.moveToFront(node);
    return node.value;
  }

  set(key: string, value: T): void {
    const existing = this.cache.get(key);
    if (existing) {
      existing.value = value;
      this.moveToFront(existing);
      return;
    }

    const node: LRUNode<T> = { value };
    this.cache.set(key, node);
    this.addToFront(node);
    this.currentSize++;

    if (this.currentSize > this.maxSize) {
      this.removeLast();
    }
  }

  private addToFront(node: LRUNode<T>): void {
    node.next = this.head;
    node.prev = undefined;
    if (this.head) {
      this.head.prev = node;
    }
    this.head = node;
    if (!this.tail) {
      this.tail = node;
    }
  }

  private moveToFront(node: LRUNode<T>): void {
    if (node === this.head) return;

    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
    if (node === this.tail) {
      this.tail = node.prev;
    }

    this.addToFront(node);
  }

  private removeLast(): void {
    if (!this.tail) return;

    this.cache.delete(this.tail.value as unknown as string);
    if (this.tail.prev) {
      this.tail.prev.next = undefined;
    }
    this.tail = this.tail.prev;
    this.currentSize--;
  }

  clear(): void {
    this.cache.clear();
    this.head = undefined;
    this.tail = undefined;
    this.currentSize = 0;
  }

  get size(): number {
    return this.currentSize;
  }
}

// Cache for parsed templates
const templateCache = new LRUCache<Node>(TEMPLATE_CACHE_MAX_SIZE);

/**
 * Create a template from HTML string
 * Templates are cached and cloned for reuse
 * 
 * Note: On server, this creates a mock node structure
 */
export function template(html: string): Node {
  // Server-side: return a simple mock that works with the string-based SSR
  if (typeof document === 'undefined') {
    const mockNode: TemplateNode = {
      t: html,
      __ssr: true,
      cloneNode: function () { return { ...this } as TemplateNode; }
    } as TemplateNode;
    return mockNode;
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
function insertExpression(
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
    // For accessors, we need to create an effect that updates the text node
    const textNode = document.createTextNode(String(value()));
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

/**
 * Spread attributes onto an element
 */
export function spread<T extends Element>(
  element: T,
  accessor: () => Record<string, unknown>,
  _isSVG?: boolean,
  skipChildren?: boolean
): void {
  const props = accessor();

  for (const prop in props) {
    if (skipChildren && prop === 'children') {
      continue;
    }
    bindProp(element, prop, props[prop]);
  }
}

/**
 * Event delegation system
 * 
 * Uses document-level listeners for performance with numerous elements
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
  value: unknown
): void {
  if (prop in element) {
    (element as Record<string, unknown>)[prop] = value;
  } else {
    element.setAttribute(prop, String(value));
  }
}

/**
 * Check if a value is a signal (has signal-specific properties)
 */
// legacy compatibility: prefer `getAccessor`/`isAccessor` for runtime checks
// This function is intentionally removed and replaced by `isSignalValue` usage


export function unwrapProps<T extends Record<string, unknown>>(props: T): T {
  return new Proxy(props, {
    get(target, prop, receiver) {
      if (prop === 'children') {
        return Reflect.get(target, prop, receiver);
      }
      const value = Reflect.get(target, prop, receiver);
      if (isAccessor(value)) return value();
      return value;
    }
  });
}

export function bindProp<T extends Element>(
  element: T,
  prop: string,
  value: unknown
): void {
  try {
    const isEvent = prop.startsWith('on');

    if (!isEvent) {
      const acc = getAccessor(value);
      if (acc) {
        const hasDestroy = typeof acc.destroy === 'function';
        if (hasDestroy) {
          addElementSignal(element, acc);
        }

        const update = () => {
          const resolved = acc();
          setProp(element, prop, resolved);
        };

        let unsubscribe: (() => void) | null = null;
        try {
          unsubscribe = acc.subscribe ? acc.subscribe(() => update()) : null;
        } catch (error) {
          console.error(`Error setting up reactivity for ${prop}:`, error);
          return;
        }

        if (unsubscribe) addElementSubscription(element, unsubscribe);
        try {
          update();
        } catch (error) {
          console.error(`Error during initial update for ${prop}:`, error);
        }
        return;
      }

      if (typeof value === 'function') {
        const update = () => {
          setProp(element, prop, (value)());
        };
        const stop = createEffect(update);
        addElementSubscription(element, stop);
        return;
      }
    }

    setProp(element, prop, value);
  } catch (error) {
    console.error(`Error setting up reactivity for ${prop}:`, error);
  }
}

/**
 * Set a property on an element with special handling for common attributes
 */
export function setProp<T extends Element>(
  element: T,
  prop: string,
  value: unknown
): void {
  // If value is a signal accessor or tuple, call it to get the actual value
  const acc = getAccessor ? getAccessor(value) : undefined;
  let actualValue = acc ? acc() : value;

  // Note: we intentionally DO NOT call function-valued attribute values here.
  // Function-valued attributes should be handled at a higher level (e.g., via createComputed or handleReactiveValue).
  // This avoids accidentally invoking Accessor functions or other function values that should not be executed here.
  if (!prop.startsWith('on') && typeof actualValue === 'function') {
    // keep actualValue as the function (will be stringified below)
  }
  
  // Handle null/undefined - remove attribute
  if (actualValue == null) {
    if (prop === 'style') {
      element.removeAttribute('style');
    } else if (prop in element && !(element instanceof SVGElement)) {
      (element as Record<string, unknown>)[prop] = null;
      element.removeAttribute(prop);
    } else {
      element.removeAttribute(prop);
    }
    return;
  }

  const isDataOrAria = prop.startsWith('data-') || prop.startsWith('aria-');

  if (isDataOrAria) {
    element.setAttribute(prop, String(actualValue));
  } else if (prop === 'class') {
    if (element instanceof HTMLElement || element instanceof SVGElement) {
      element.setAttribute('class', String(actualValue));
    }
  } else if (prop === 'style') {
    if (typeof actualValue === 'object' && element instanceof HTMLElement) {
      const styles = actualValue as Record<string, unknown>;
      for (const key in styles) {
        if (!Object.prototype.hasOwnProperty.call(styles, key)) continue;
        const styleValue = styles[key];
        if (styleValue == null) continue;
        const cssKey = key.includes('-') ? key : key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
        element.style.setProperty(cssKey, String(styleValue));
        const camelKey = key.includes('-') ? key.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()) : key;
        if (camelKey !== cssKey) {
          (element.style as CSSStyleDeclaration & Record<string, string>)[camelKey] = String(styleValue);
        }
      }
    } else {
      element.setAttribute('style', String(actualValue));
    }
  } else if (prop === 'value' && element instanceof HTMLInputElement) {
    // Special handling for input value
    element.value = String(actualValue);
  } else if (prop === 'checked' && element instanceof HTMLInputElement) {
    element.checked = Boolean(actualValue);
    element.toggleAttribute('checked', Boolean(actualValue));
  } else if (prop in element && !(element instanceof SVGElement) && !(prop.startsWith('data-') || prop.startsWith('aria-'))) {
    // Set as property for HTML elements
    (element as Record<string, unknown>)[prop] = actualValue;
  } else {
    // Set as attribute
    if (typeof actualValue === 'boolean') {
      if (actualValue) {
        element.setAttribute(prop, '');
      } else {
        element.removeAttribute(prop);
      }
    } else {
      element.setAttribute(prop, String(actualValue));
    }
  }
}

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

/**
 * Find a marker node by its ID (comment content)
 * Uses TreeWalker to traverse deep structures
 */
export function findMarker(
  root: Node,
  markerId: string
): Node | null {
  // If root itself is the marker
  if (root.nodeType === 8 && root.textContent === markerId) {
    return root;
  }

  // Use TreeWalker to find the comment node
  // 128 is NodeFilter.SHOW_COMMENT
  const walker = document.createTreeWalker(
    root,
    128,
    null
  );

  while (walker.nextNode()) {
    if (walker.currentNode.textContent === markerId) {
      return walker.currentNode;
    }
  }

  return null;
}
