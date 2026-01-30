import { isSignal } from "../../reactive/signal";
import { isHydrationEnabled } from "./hydration";
import { createTextNode } from "./elements";
import type { JSXChildren } from "./types";

// Improved renderChildren that handles recursion by flattening
function renderChildrenFlattened(parent: HTMLElement | DocumentFragment, children: JSXChildren, appendedSet?: Set<Node>): void {
  const childArray = Array.isArray(children) ? children : [children];

  for (const child of childArray) {
    if (child == null || child === false || child === true) continue;

    if (isSignal(child)) {
      const value = child();
      if (value instanceof Node) {
        parent.appendChild(value);
        appendedSet?.add(value);
      } else {
        const textNode = createTextNode(child);
        parent.appendChild(textNode);
        appendedSet?.add(textNode);
      }
    } else if (typeof child === 'function') {
      try {
        const result = child();
        if (result instanceof Node) {
          parent.appendChild(result);
          appendedSet?.add(result);
        } else if (Array.isArray(result)) {
          // Recursion!
          renderChildrenFlattened(parent, result, appendedSet);
        } else {
          const textNode = document.createTextNode(String(result));
          parent.appendChild(textNode);
          appendedSet?.add(textNode);
        }
      } catch (error) {
        console.warn('Error rendering function child:', error);
      }
    } else if (typeof child === 'object' && child instanceof Node) {
      parent.appendChild(child);
      appendedSet?.add(child);
    } else {
      const textNode = document.createTextNode(String(child));
      parent.appendChild(textNode);
      appendedSet?.add(textNode);
    }
  }
}

// Main renderChildren entry point
export function renderChildren(parent: HTMLElement | DocumentFragment, children: JSXChildren): void {
  if (!children) return;

  const isHydratingParent = isHydrationEnabled() &&
    (parent instanceof HTMLElement && parent.isConnected ||
      parent === document.body);

  const appendedNodes = isHydratingParent ? new Set<Node>() : undefined;
  const initialChildNodes = isHydratingParent ? Array.from(parent.childNodes) : null;

  // Use flattened renderer
  renderChildrenFlattened(parent, children, appendedNodes);

  // Cleanup
  if (isHydratingParent && initialChildNodes && appendedNodes) {
    for (const node of initialChildNodes) {
      if (!appendedNodes.has(node)) {
        node.remove();
      }
    }
  }
}