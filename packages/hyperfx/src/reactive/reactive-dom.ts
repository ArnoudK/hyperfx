import { createSignal, createEffect, createComputed, ReactiveSignal } from "../reactive/state";
import type { JSXElement, ComponentProps } from "../jsx/jsx-runtime";

/**
 * Direct DOM Reactive Helpers for HyperFX
 * 
 * These helpers work with actual DOM elements instead of VNodes,
 * providing reactive functionality with direct DOM manipulation.
 */

// Reactive text node that updates when signal changes
export function ReactiveText(initialValue: string): {
  node: Text;
  signal: ReactiveSignal<string>;
} {
  const text = createSignal(initialValue);
  const node = document.createTextNode(initialValue);

  createEffect(() => {
    node.textContent = text();
  });

  return { node, signal: text };
}

// Reactive element attribute binding
export function bindAttribute<T>(
  element: HTMLElement,
  attribute: string,
  signal: ReactiveSignal<T>
): void {
  createEffect(() => {
    const value = signal();
    
    if (attribute === 'disabled' && typeof value === 'boolean') {
      if (value) {
        element.setAttribute('disabled', '');
      } else {
        element.removeAttribute('disabled');
      }
    } else if (attribute === 'checked' && element instanceof HTMLInputElement) {
      element.checked = !!value;
      if (value) {
        element.setAttribute('checked', '');
      } else {
        element.removeAttribute('checked');
      }
    } else if (attribute === 'value' && element instanceof HTMLInputElement) {
      element.value = String(value);
    } else if (attribute === 'textContent') {
      element.textContent = String(value);
    } else if (attribute === 'innerHTML') {
      element.innerHTML = String(value);
    } else {
      element.setAttribute(attribute, String(value));
    }
  });
}

// Reactive style binding
export function bindStyle(
  element: HTMLElement,
  styleProperty: string,
  signal: ReactiveSignal<string | number>
): void {
  createEffect(() => {
    const value = signal();
    (element.style as unknown as Record<string, string>)[styleProperty] = String(value);
  });
}

// Reactive class binding
export function bindClass(
  element: HTMLElement,
  className: string,
  signal: ReactiveSignal<boolean>
): void {
  createEffect(() => {
    if (signal()) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  });
}

// Reactive CSS variable binding
export function bindCSSVariable(
  element: HTMLElement,
  variableName: string,
  signal: ReactiveSignal<string | number>
): void {
  createEffect(() => {
    const value = signal();
    element.style.setProperty(variableName, String(value));
  });
}

// Reactive event listener that can be enabled/disabled
export function bindEvent(
  element: HTMLElement,
  eventType: string,
  handler: (event: Event) => void,
  enabledSignal?: ReactiveSignal<boolean>
): void {
  const eventHandler = (event: Event) => {
    if (!enabledSignal || enabledSignal()) {
      handler(event);
    }
  };

  if (enabledSignal) {
    createEffect(() => {
      if (enabledSignal()) {
        element.addEventListener(eventType, eventHandler);
      } else {
        element.removeEventListener(eventType, eventHandler);
      }
    });
  } else {
    element.addEventListener(eventType, eventHandler);
  }
}

// Reactive list rendering with direct DOM manipulation
export function ReactiveList<T>(
  items: ReactiveSignal<T[]>,
  renderItem: (item: T, index: number) => JSXElement,
  container?: HTMLElement
): {
  container: HTMLElement;
  update: () => void;
} {
  const listContainer = container || document.createElement('div');
  const currentElements: JSXElement[] = [];

  const update = (): void => {
    const currentItems = items();

    // Clear existing elements
    // Note: ReactiveList only runs on client, so elements are always DOM Nodes
    currentElements.forEach((element) => {
      const domElement = element as Node;
      if (domElement && domElement.parentNode === listContainer) {
        listContainer.removeChild(domElement);
      }
    });
    currentElements.length = 0;

    // Add new elements
    const itemsArray = currentItems; // Get the array value
    itemsArray.forEach((item, index) => {
      const element = renderItem(item, index);
      listContainer.appendChild(element as Node);
      currentElements.push(element);
    });
  };

  createEffect(update);

  return { container: listContainer, update };
}

// Reactive conditional rendering
export function ReactiveIf(
  condition: ReactiveSignal<boolean>,
  renderTrue: () => JSXElement,
  renderFalse?: () => JSXElement,
  container?: HTMLElement
): {
  container: HTMLElement;
  update: () => void;
} {
  const wrapperContainer = container || document.createElement('span');
  let currentElement: JSXElement | null = null;

  const update = (): void => {
    // Remove current element
    // Note: ReactiveIf only runs on client, so elements are always DOM Nodes
    if (currentElement) {
      const domElement = currentElement as Node;
      if (domElement.parentNode === wrapperContainer) {
        wrapperContainer.removeChild(domElement);
      }
    }

    // Add appropriate element
    if (condition()) {
      currentElement = renderTrue();
    } else if (renderFalse) {
      currentElement = renderFalse();
    } else {
      currentElement = null;
    }

    if (currentElement) {
      wrapperContainer.appendChild(currentElement as Node);
    }
  };

  createEffect(update);

  return { container: wrapperContainer, update };
}

// Reactive two-way binding for form inputs
export function bindTwoWay<T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
  element: T,
  signal: ReactiveSignal<string>
): {
  element: T;
  signal: ReactiveSignal<string>;
  destroy: () => void;
} {
  // Set initial value
  element.value = signal();

  // Update signal when element value changes
  const handleChange = (): void => {
    signal(element.value);
  };

  element.addEventListener('input', handleChange);
  element.addEventListener('change', handleChange);

  // Update element when signal changes
  const unsubscribe = createEffect(() => {
    if (element.value !== signal()) {
      element.value = signal();
    }
  });

  const destroy = (): void => {
    element.removeEventListener('input', handleChange);
    element.removeEventListener('change', handleChange);
    unsubscribe();
  };

  return { element, signal, destroy };
}

// Reactive template string helper
export function reactiveTemplate(
  strings: TemplateStringsArray,
  ...values: (ReactiveSignal<unknown> | unknown)[]
): ReactiveSignal<string> {
  return createComputed(() => {
    let result = strings[0] || '';
    
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      
      if (typeof value === 'function') {
        // It's a signal
        try {
          result += String(value());
        } catch {
          result += String(value);
        }
      } else {
        result += String(value);
      }
      
      result += strings[i + 1] || '';
    }
    
    return result;
  });
}

// Batch DOM updates for performance
export function batchDOMUpdates<T>(updates: (() => T)[]): T[] {
  // Use DocumentFragment for batching DOM operations
  const results: T[] = [];

  // Prevent layout thrashing by batching reads/writes
  updates.forEach(update => {
    results.push(update());
  });

  return results;
}

// Debounced DOM updates
export function debounceDOMUpdate<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 16 // ~60fps
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Performance monitoring for reactive updates
export function measureReactivePerformance<T>(
  name: string,
  fn: () => T,
  enabled = false
): T {
  if (!enabled) return fn();

  const start = performance.now();
  const result = fn();
  const end = performance.now();

  console.log(`[HyperFX] ${name}: ${(end - start).toFixed(2)}ms`);
  return result;
}

// Utility to create reactive components easily
export function createReactiveComponent<P extends ComponentProps>(
  renderFn: (props: P, createReactive: <T>(initial: T) => ReactiveSignal<T>) => JSXElement
): (props: P) => JSXElement {
  return (props: P): JSXElement => {
    return renderFn(props, createSignal);
  };
}

// Legacy exports for backward compatibility
export { bindAttribute as bindProp };
export { bindEvent as bindEventWithSignal };
export { ReactiveList as ReactiveElementList };
export { ReactiveIf as ReactiveConditional };