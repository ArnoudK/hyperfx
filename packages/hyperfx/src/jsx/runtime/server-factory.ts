/**
 * Server-side JSX factory for HyperFX
 * Creates virtual nodes that implement DOM-compatible interfaces
 * Completely avoids the need for happy-dom or any DOM APIs
 */

import { FRAGMENT_TAG } from "./constants";
import type { FunctionComponent, JSXChildren, JSXElement } from "./types";
import type { VirtualNode } from "./virtual-node";
import {
  createVirtualElement,
  createVirtualText,
  createVirtualFragment,
  isVirtualNode,
} from "./virtual-node";
import { isSignal } from "../../reactive/signal";

/**
 * Server-side Fragment component
 */
export function Fragment(props: { children?: JSXChildren }): DocumentFragment {
  return createVirtualFragment(renderChildrenToVirtual(props.children)) as unknown as DocumentFragment;
}

/**
 * Render children to virtual nodes
 */
function renderChildrenToVirtual(children: JSXChildren): VirtualNode[] {
  if (children == null || children === false || children === true) {
    return [];
  }

  if (Array.isArray(children)) {
    return children.flatMap(renderChildrenToVirtual);
  }

  // Handle signals - unwrap them to get current value
  if (isSignal(children)) {
    const value = children(); // Call signal to get current value
    return renderChildrenToVirtual(value);
  }

  // Handle virtual nodes (already processed)
  if (isVirtualNode(children)) {
    return [children];
  }

  // Handle primitives - convert to text nodes
  if (typeof children === 'string' || typeof children === 'number') {
    return [createVirtualText(String(children))];
  }

  // Handle objects that aren't virtual nodes (shouldn't happen, but be safe)
  if (typeof children === 'object') {
    return [];
  }

  return [];
}

/**
 * Server-side JSX factory function
 * This is called by the TypeScript compiler for every JSX element
 * Returns DOM-compatible virtual nodes
 */
export function jsx(
  type: string | FunctionComponent<any> | typeof FRAGMENT_TAG,
  props: Record<string, any> | null,
  _key?: string | number | null
): JSXElement {
  // Handle fragments (<>...</>)
  if (type === FRAGMENT_TAG || type === Fragment) {
    const allChildren = props?.children;
    const children = renderChildrenToVirtual(allChildren);
    return createVirtualFragment(children) as unknown as DocumentFragment;
  }

  // Handle function components
  if (typeof type === 'function') {
    // Unwrap signals in props for function components
    const proxyProps = new Proxy(props || {}, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (isSignal(value)) {
          return value();
        }
        return value;
      }
    });

    // Call component function - it will return virtual nodes
    const result = type(proxyProps);

    // Ensure we return a valid JSXElement (handle null/undefined/boolean)
    if (result == null || typeof result === 'boolean') {
      return null;
    }

    return result;
  }

  // Handle regular HTML elements (div, span, etc.)
  const children = props?.children
    ? renderChildrenToVirtual(props.children)
    : [];

  // Unwrap signals in props for HTML elements
  const unwrappedProps: Record<string, any> = {};
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (key === 'children') {
        continue; // Skip children, already processed
      }
      // Unwrap signals
      if (isSignal(value)) {
        unwrappedProps[key] = value();
      } else {
        unwrappedProps[key] = value;
      }
    }
  }

  return createVirtualElement(type as string, unwrappedProps, children) as unknown as HTMLElement;
}

/**
 * jsxs is used for multiple children in automatic runtime
 * Same implementation as jsx
 */
export const jsxs = jsx;

/**
 * Classic JSX Factory (for transform runtime)
 */
export function createJSXElement(
  type: string | FunctionComponent<any> | typeof FRAGMENT_TAG,
  props: Record<string, any> | null,
  ...children: JSXChildren[]
): JSXElement {
  const allProps = {
    ...props,
    children: children.length > 0 ? children.flat() : props?.children
  };
  return jsx(type, allProps);
}

/**
 * Export createElement as alias for compatibility
 */
export { createJSXElement as createElement };

/**
 * Re-export hydration utilities for testing
 */
export { resetClientNodeCounter } from './hydration';
