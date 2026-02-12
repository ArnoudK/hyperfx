import { handleReactiveValue } from "./reactive";
import { getAccessor } from "../../reactive/signal";

function toCssProperty(property: string): string {
  if (property.includes('-')) {
    return property;
  }
  return property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function toCamelCaseProperty(property: string): string {
  if (!property.includes('-')) {
    return property;
  }
  return property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

// Simple setAttribute function that handles all attribute types
function setAttribute(element: HTMLElement, key: string, value: unknown): void {
  // Skip children and key props
  if (key === 'children' || key === 'key') {
    return;
  }

  // Handle event handlers
  if (key.startsWith('on') && typeof value === 'function') {
    const eventName = key.slice(2).toLowerCase();
    element.addEventListener(eventName, value as EventListener);
    return;
  }

  // Handle innerHTML and textContent specially (reactive support)
  if (key === 'innerHTML' || key === 'textContent') {
    const acc = getAccessor(value);
    if (acc) {
      handleReactiveValue(element, key, acc, (el, val) => {
        (el as unknown as Record<string, unknown>)[key] = val;
      });
    } else {
      try {
        (element as unknown as Record<string, unknown>)[key] = value;
      } catch {}
    }

    return;
  }

  // Handle accessor-based signals or Signal tuple
  const acc = getAccessor(value);
  if (acc) {
    handleReactiveValue(element, key, acc, (el, val) => setAttribute(el, key, val));
    return;
  }

  // Handle reactive functions (create computed for reactivity)
  if (typeof value === 'function') {
    // console.debug(`[attributes] computed attr ${key}`, { value });
    handleReactiveValue(element, key, value, (el, val) => setAttribute(el, key, val));
    return;
  }

  // Handle class attribute specially
  if (key === 'class') {
    if (value != null) {
      element.className = String(value);
    } else {
      element.removeAttribute('class');
    }
    return;
  }

  // Handle boolean attributes
  const booleanAttrs = new Set([
    'disabled', 'checked', 'readonly', 'readOnly', 'required', 'autofocus', 'autoplay',
    'controls', 'default', 'defer', 'hidden', 'inert', 'loop', 'multiple',
    'muted', 'novalidate', 'open', 'reversed', 'selected'
  ]);

  if (booleanAttrs.has(key)) {
    const boolValue = Boolean(value);

    if (key === 'checked' && element instanceof HTMLInputElement) {
      element.checked = boolValue;
      element.toggleAttribute('checked', boolValue);
    } else if ((key === 'readonly' || key === 'readOnly') && element instanceof HTMLInputElement) {
      element.readOnly = boolValue;
      element.toggleAttribute('readonly', boolValue);
    } else if (key === 'disabled') {
      (element as HTMLInputElement).disabled = boolValue;
      element.toggleAttribute('disabled', boolValue);
    } else {
      element.toggleAttribute(key, boolValue);
    }
    return;
  }

  // Handle style attribute
  if (key === 'style') {
    if (value == null) {
      element.removeAttribute('style');
    } else if (typeof value === 'string') {
      element.setAttribute('style', value);
    } else if (typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([property, styleValue]) => {
        if (styleValue != null) {
          try {
            const cssProperty = toCssProperty(property);
            element.style.setProperty(cssProperty, String(styleValue));
            const camelProperty = toCamelCaseProperty(property);
            if (camelProperty !== cssProperty) {
              (element.style as CSSStyleDeclaration & Record<string, string>)[camelProperty] = String(styleValue);
            }
          } catch (styleError) {
            console.warn(`Failed to set CSS property "${property}":`, styleError);
          }
        }
      });
    } else {
      element.setAttribute('style', String(value));
    }
    return;
  }

  // Handle input properties
  if (key === 'value' && element instanceof HTMLInputElement) {
    element.value = String(value || '');
    return;
  }

  // Handle all other attributes
  if (value != null) {
    console.log(`[attributes] set ${key} ->`, value);
    element.setAttribute(key, String(value));
  } else {
    console.log(`[attributes] remove ${key}`);
    element.removeAttribute(key);
  }
}

// Global attribute manager instance
export const attributeManager = {
  applyAttribute(element: HTMLElement, key: string, value: unknown): void {
    setAttribute(element, key, value);
  },

  applyAttributes(element: HTMLElement, props: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(props)) {
      this.applyAttribute(element, key, value);
    }
  }
};
