// Direct DOM JSX Factory - Performance Optimized
import { attributeManager } from "./attributes";
import { FRAGMENT_TAG } from "./constants";
import { isHydrationEnabled, claimHydrationElement } from "./hydration";
import type { LifecycleAPI } from "../../reactive/lifecycle";
import type { FunctionComponent, JSXChildren, JSXElement, ComponentProps } from "./types";
import { getAccessor, isAccessor } from "../../reactive/signal";
import { renderChildren } from "./children";
import { insert } from "../../runtime-dom";

/**
 * Client-side Fragment component
 */
export function Fragment(props: ComponentProps): DocumentFragment {
  const fragment = document.createDocumentFragment();
  if (props.children) {
    appendChildren(fragment, props.children);
  }
  return fragment;
}

/**
 * Create a DOM element with reactive attributes
 */
function createElement(tag: string, props?: Record<string, unknown> | null): HTMLElement {
  let element: HTMLElement | null = null;

  // Attempt to claim existing element if hydrating
  if (isHydrationEnabled()) {
    element = claimHydrationElement(tag);
    if (element) {
      // console.log(`[HyperFX] Claimed element: ${tag}`);
    }
  }

  // Fallback to creating a new element
  if (!element) {
    element = document.createElement(tag);
  }

  // Apply all attributes using the unified attribute manager
  // Note: For claimed elements, this will update reactive attributes and attach event handlers
  if (props) {
    attributeManager.applyAttributes(element, props);
  }

  return element;
}

/**
 * Append children to a parent element
 */
function appendChildren(parent: Node, children: JSXChildren): void {
  if (children == null || children === false || children === true) {
    return;
  }

  if (Array.isArray(children)) {
    children.forEach(child => appendChildren(parent, child));
    return;
  }

  // Handle SSRNodes
  if (children && (children as { __ssr?: boolean }).__ssr) {
    const div = document.createElement('div');
    div.innerHTML = String((children as { t?: string }).t ?? '');
    while (div.firstChild) {
      parent.appendChild(div.firstChild);
    }
    return;
  }

  if (children instanceof Node) {
    // Only append if not already there (relevant for transition from claimed nodes)
    if (!parent.contains(children)) {
      parent.appendChild(children);
    }
  } else if (typeof children === 'function') {
    // Handle reactive children (signals or functions wrapping signals from unwrapComponent)
    const childAcc = getAccessor(children);
    if (childAcc) {
      const textNode = document.createTextNode('');
      parent.appendChild(textNode);
      childAcc.subscribe?.((val: unknown) => {
        textNode.textContent = String(val);
      });
      textNode.textContent = String(childAcc());
    } else {
      // This is a function wrapper from unwrapComponent (e.g., () => memo())
      // Use insert() to set up proper reactivity with cleanup
      const accessor = children as () => JSXElement;
      const marker = document.createComment('hfx:comp');
      parent.appendChild(marker);
      insert(parent, accessor, marker);
    }
  } else {
    parent.appendChild(document.createTextNode(String(children)));
  }
}

/**
 * Client-side JSX factory function
 */
export function jsx(
  type: string | FunctionComponent<Record<string, unknown>> | typeof FRAGMENT_TAG,
  props: Record<string, unknown> | null,
  _key?: string | number | null
): JSXElement {
  // Handle fragments
  if (type === FRAGMENT_TAG || type === Fragment) {
    const fragment = document.createDocumentFragment();
    if (props?.children) {
      appendChildren(fragment, props.children);
    }
    return fragment;
  }

  // Handle function components
  if (typeof type === 'function') {
    // Import lifecycle functions dynamically to avoid circular dependency
    let lifecycle: LifecycleAPI | undefined;
    try {
      const loaded = require('../../reactive/lifecycle.js') as Partial<LifecycleAPI> | undefined;
      if (loaded && typeof loaded.flushMounts === 'function' && typeof loaded.popLifecycleContext === 'function') {
        lifecycle = loaded as LifecycleAPI;
      }
    } catch {
      // Lifecycle module not available
    }

    const proxyProps = new Proxy(props || {}, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (isAccessor(value)) return value();
        return value;
      }
    });

    try {
      const result = type(proxyProps);

      // Flush mount callbacks after component renders
      if (lifecycle) {
        lifecycle.flushMounts();
      }

      return result;
    } catch (error) {
      // Clean up context on error
      if (lifecycle) {
        lifecycle.popLifecycleContext();
      }
      throw error;
    }
  }

  // Handle regular HTML elements
  const element = createElement(type as string, props);
  if (props?.children) {
    renderChildren(element, props.children);
  }

  return element;
}

export const jsxs = jsx;
export const jsxDEV = jsx;

export function createJSXElement(
  type: string | FunctionComponent<Record<string, unknown>> | typeof FRAGMENT_TAG,
  props: Record<string, unknown> | null,
  ...children: JSXChildren[]
): JSXElement {
  const allProps: Record<string, unknown> = {
    ...props,
    children: children.length > 0 ? children.flat() : props?.children
  };
  return jsx(type, allProps);
}

export { createJSXElement as createElement };
