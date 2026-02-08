import { FRAGMENT_TAG } from "./constants.js";
import type { FunctionComponent, JSXChildren, JSXElement, ComponentProps } from "./types.js";
import { isSignal } from "../../reactive/signal.js";
import { ssrElement, escapeHtml, SSRNode } from "../../ssr/render.js";

/**
 * Server-side Fragment component
 */
export function Fragment(props: ComponentProps): JSXElement {
  return {
    t: renderChildrenToString(props.children),
    __ssr: true
  } as SSRNode;
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

  // Handle signals - unwrap them to get current value
  if (isSignal(children)) {
    return renderChildrenToString(children());
  }

  // Handle SSRNodes
  if (children && (children as any).__ssr) {
    return (children as any).t;
  }

  // Handle primitives - escape and convert to string
  return escapeHtml(String(children));
}

/**
 * Server-side JSX factory function
 */
export function jsx(
  type: string | FunctionComponent<any> | typeof FRAGMENT_TAG,
  props: Record<string, any> | null,
  _key?: string | number | null
): JSXElement {
  // Handle fragments (<>...</>)
  if (type === FRAGMENT_TAG || type === Fragment) {
    return {
      t: renderChildrenToString(props?.children),
      __ssr: true
    } as SSRNode;
  }

  // Handle function components
  if (typeof type === 'function') {
    // Unwrap signals in props for function components
    const proxyProps = new Proxy(props || {}, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (isSignal(value)) return value();
        return value;
      }
    });

    return type(proxyProps);
  }

  // Handle regular HTML elements (div, span, etc.)
  const childrenHtml = props?.children
    ? renderChildrenToString(props.children)
    : '';

  // Unwrap signals in props for HTML elements
  const unwrappedProps: Record<string, any> = {};
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (key === 'children') continue;
      unwrappedProps[key] = isSignal(value) ? value() : value;
    }
  }

  return ssrElement(type as string, unwrappedProps, childrenHtml) as unknown as JSXElement;
}

export const jsxs = jsx;
export const jsxDEV = jsx;

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

export { createJSXElement as createElement };
