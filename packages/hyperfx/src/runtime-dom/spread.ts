/**
 * Property spreading and binding
 */

import { createEffect, getAccessor } from '../reactive/signal';
import { addElementSubscription, addElementSignal } from '../jsx/runtime/reactive';

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
