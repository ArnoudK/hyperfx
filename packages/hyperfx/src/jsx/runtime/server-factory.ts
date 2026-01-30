/**
 * Server-side JSX factory for HyperFX
 * Creates virtual nodes instead of real DOM elements
 * Completely avoids the need for happy-dom or any DOM APIs
 */

import { Fragment, FRAGMENT_TAG } from "./elements";
import type { FunctionComponent, JSXChildren } from "./types";
import type { VirtualNode } from "./virtual-node";
import {
  createVirtualElement,
  createVirtualText,
  createVirtualFragment,
} from "./virtual-node";
import { isSignal } from "../../reactive/signal";

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
  if (
    typeof children === 'object' &&
    children !== null &&
    'type' in children &&
    (children.type === 'element' ||
      children.type === 'text' ||
      children.type === 'fragment' ||
      children.type === 'comment')
  ) {
    return [children as VirtualNode];
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
 */
export function jsx(
  type: string | FunctionComponent<any> | typeof FRAGMENT_TAG,
  props: Record<string, any> | null,
  _key?: string | number | null
): VirtualNode {
  // Handle fragments (<>...</>)
  if (type === FRAGMENT_TAG || type === Fragment) {
    const allChildren = props?.children;
    const children = renderChildrenToVirtual(allChildren);
    return createVirtualFragment(children);
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
    
    // Ensure we return a virtual node (handle null/undefined/boolean)
    if (result == null || typeof result === 'boolean') {
      return null;
    }
    
    // The result should already be a VirtualNode from the server runtime
    // We use 'unknown' here because the type signature says JSXElement
    // but at runtime on the server it will be VirtualNode
    return result as unknown as VirtualNode;
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

  return createVirtualElement(type as string, unwrappedProps, children);
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
): VirtualNode {
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
