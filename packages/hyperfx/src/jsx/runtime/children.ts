import { isHydrationEnabled, pushHydrationContext, popHydrationContext, setHydrationPointer } from "./hydration";
import { createTextNode } from "./elements";
import { getAccessor, isSignal } from "../../reactive/signal";
import type { JSXChildren } from "./types";

// Improved renderChildren that handles recursion by flattening and node claiming for hydration
function renderChildrenFlattened(
  parent: HTMLElement | DocumentFragment,
  children: JSXChildren,
  appendedSet?: Set<Node>,
  hydrationCursor?: { index: number; nodes: Node[] }
): void {
  const childArray = Array.isArray(children) ? children : [children];

  for (const child of childArray) {
    if (child == null || child === false || child === true) continue;

    let node: Node | null = null;
    const canClaim = hydrationCursor && hydrationCursor.index < hydrationCursor.nodes.length;

    if (isSignal(child)) {
      const accessor = getAccessor(child);
      const value = accessor();
      if (value instanceof Node) {
        node = value;
      } else {
        // Try to claim existing text node
        if (canClaim) {
          const existing = hydrationCursor!.nodes[hydrationCursor!.index];
          if (existing?.nodeType === 3) { // Text node
            existing.textContent = String(value);
            node = existing;
            hydrationCursor!.index++;

            // Attach reactivity to the claimed node
            accessor.subscribe?.((val: unknown) => {
              if (node) node.textContent = String(val);
            });
          }
        }
        if (!node) {
          node = createTextNode(accessor);
        }
      }
    } else if (typeof child === 'function') {
      try {
        const result = child();
        if (result instanceof Node) {
          node = result;
        } else if (Array.isArray(result)) {
          renderChildrenFlattened(parent, result, appendedSet, hydrationCursor);
          continue;
        } else {
          // Try to claim existing text node
          if (canClaim) {
            const existing = hydrationCursor!.nodes[hydrationCursor!.index];
            if (existing?.nodeType === 3) {
              existing.textContent = String(result);
              node = existing;
              hydrationCursor!.index++;
            }
          }
          if (!node) {
            node = document.createTextNode(String(result));
          }
        }
      } catch (error) {
        console.warn('Error rendering function child:', error);
      }
    } else if (typeof child === 'object' && child instanceof Node) {
      node = child;
    } else {
      // Try to claim existing text node
      if (canClaim) {
        const existing = hydrationCursor!.nodes[hydrationCursor!.index];
        if (existing?.nodeType === 3) {
          existing.textContent = String(child);
          node = existing;
          hydrationCursor!.index++;
        }
      }
      if (!node) {
        node = document.createTextNode(String(child));
      }
    }

    if (node) {
      if (!parent.contains(node)) {
        parent.appendChild(node);
      }
      appendedSet?.add(node);
    }
  }
}

// Main renderChildren entry point
export function renderChildren(parent: HTMLElement | DocumentFragment, children: JSXChildren): void {
  if (!children) return;

  const isHydratingParent = isHydrationEnabled() &&
    (parent instanceof HTMLElement && parent.isConnected ||
      parent === document.body); // Body is always connected but good to be explicit

  if (isHydratingParent) {
    // Push the context to the parent's first child
    pushHydrationContext(parent.firstChild);
  }

  const appendedNodes = isHydratingParent ? new Set<Node>() : undefined;
  const initialChildNodes = isHydratingParent ? Array.from(parent.childNodes) : null;
  const hydrationCursor = isHydratingParent ? { index: 0, nodes: initialChildNodes! } : undefined;

  // Use flattened renderer
  renderChildrenFlattened(parent, children, appendedNodes, hydrationCursor);

  // Clean up nodes that were not claimed or appended
  if (isHydratingParent && initialChildNodes && appendedNodes) {
    for (const node of initialChildNodes) {
      if (!appendedNodes.has(node)) {
        node.remove();
      }
    }
    // Pop the context
    popHydrationContext();
  }

  if (isHydratingParent && hydrationCursor) {
    const remainingNodes = hydrationCursor.nodes;
    const nextIndex = hydrationCursor.index;
    const nextNode = nextIndex < remainingNodes.length ? remainingNodes[nextIndex] : null;
    setHydrationPointer(nextNode ?? null);
  }
}
