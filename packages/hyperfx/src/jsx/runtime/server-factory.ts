import { FRAGMENT_TAG } from "./constants.js";
import type { FunctionComponent, JSXChildren, JSXElement, ComponentProps } from "./types.js";
import { getAccessor } from "../../reactive/signal.js";
import { ssrElement, escapeHtml, SSRNode } from "../../ssr/render.js";

/**
 * Server-side Fragment component
 */
export function Fragment(props: ComponentProps): JSXElement {
  return {
    t: renderChildrenToString(props.children),
    __ssr: true
  };
}

export function marker(): SSRNode {
  return {
    t: '<!--hfx:dyn-->',
    __ssr: true
  };
}

/**
 * Render children to string
 */
function renderChildrenToString(children: JSXChildren): string {
  if (children == null || children === false || children === true) {
    return '';
  }

  if (Array.isArray(children)) {
    return children.map(renderChildrenToString).join('');
  }

  // Handle signals/accessors - unwrap them to get current value
  const childAccessor = getAccessor(children);
  if (childAccessor) {
    return renderChildrenToString(childAccessor() as JSXChildren);
  }

  // Handle SSRNodes
  if (children && (children as SSRNode).__ssr) {
    return (children as SSRNode).t;
  }

  // Handle primitives - escape and convert to string
  return escapeHtml(String(children));
}

/**
 * Server-side JSX factory function
 */
export function jsx(
  type: string | FunctionComponent<Record<string, unknown>> | typeof FRAGMENT_TAG,
  props: Record<string, unknown> | null,
  _key?: string | number | null
): JSXElement {
  // Handle fragments (<>...</>)
  if (type === FRAGMENT_TAG || type === Fragment) {
    return {
      t: renderChildrenToString(props?.children as JSXChildren),
      __ssr: true
    } as SSRNode;
  }

  // Handle function components
  if (typeof type === 'function') {
    // Unwrap signals in props for function components
    const proxyProps = new Proxy(props || {}, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        const acc = getAccessor(value);
        if (acc) return acc();
        return value;
      }
    });

    return type(proxyProps as ComponentProps);
  }

  // Handle regular HTML elements (div, span, etc.)
  const childrenHtml = props?.children
    ? renderChildrenToString(props.children as JSXChildren)
    : '';

  // Unwrap signals in props for HTML elements
  const unwrappedProps: Record<string, unknown> = {};
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (key === 'children') continue;
      const acc = getAccessor(value);
      unwrappedProps[key] = acc ? acc() : value;
    }
  }

  return ssrElement(type as string, unwrappedProps, childrenHtml);
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
