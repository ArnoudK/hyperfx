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
