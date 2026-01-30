import { isSignal, createComputed as signal_createComputed } from "../../reactive/signal";
import { Signal } from "../../reactive/signal";
import { Fragment, FRAGMENT_TAG } from "./elements";
import { renderChildren } from "./children";
import { attributeManager } from "./attributes";
import type { JSXElement, FunctionComponent, JSXChildren } from "./types";

// Create a DOM element with reactive attributes
function createElement(tag: string, props?: Record<string, any> | null): HTMLElement {
  // Simple element creation - hydration is handled separately via structural matching
  const element = document.createElement(tag);

  // Apply all attributes using the unified attribute manager
  if (props) {
    attributeManager.applyAttributes(element, props);
  }

  return element;
}

// JSX Factory Function - creates actual DOM elements
export function jsx(
  type: string | FunctionComponent<any> | typeof FRAGMENT_TAG,
  props: Record<string, any> | null,
  _key?: string | number | null
): JSXElement {
  // Handle fragments
  if (type === FRAGMENT_TAG || type === Fragment) {
    const allChildren = props?.children;
    const fragment = document.createDocumentFragment();
    renderChildren(fragment, allChildren);
    return fragment;
  }

  // Handle function components
  if (typeof type === 'function') {
    // Wrap props in a proxy to auto-unwrap signals
    const proxyProps = new Proxy(props || {}, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (isSignal(value)) {
          return value();
        }
        return value;
      }
    });
    return type(proxyProps);
  }

  // Handle regular HTML elements
  const element = createElement(type as string, props);

  // Handle children
  if (props?.children) {
    renderChildren(element, props.children);
  }

  return element;
}

// jsxs is used for multiple children in automatic runtime, same logic for us
export const jsxs = jsx;
export const jsxDEV = jsx;

// Classic JSX Factory (for transform runtime)
export function createJSXElement(
  type: string | FunctionComponent<any> | typeof FRAGMENT_TAG,
  props: Record<string, any> | null,
  ...children: JSXChildren[]
): JSXElement {
  const allProps = { ...props, children: children.length > 0 ? children.flat() : props?.children };
  return jsx(type, allProps);
}

// Template literal helpers for reactive strings
export function template(strings: TemplateStringsArray, ...values: any[]): Signal<string> {
  return signal_createComputed(() => {
    let result = strings[0] || '';
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      const resolvedValue = isSignal(value) ? value() : value;
      result += String(resolvedValue) + (strings[i + 1] || '');
    }
    return result;
  });
}

export function r<T>(fn: () => T): Signal<T> {
  return signal_createComputed(fn);
}

// Classic JSX Factory (for backwards compatibility)
export { createJSXElement as createElement };