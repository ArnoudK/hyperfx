/**
 * Utility functions for runtime DOM operations
 */

import { isAccessor } from '../reactive/signal';

export function unwrapProps<T extends Record<string, unknown>>(props: T): T {
  return new Proxy(props, {
    get(target, prop, receiver) {
      if (prop === 'children') {
        return Reflect.get(target, prop, receiver);
      }
      const value = Reflect.get(target, prop, receiver);
      if (isAccessor(value)) return value();
      return value;
    }
  });
}

/**
 * Find a marker node by its ID (comment content)
 * Uses TreeWalker to traverse deep structures
 */
export function findMarker(
  root: Node,
  markerId: string
): Node | null {
  // If root itself is the marker
  if (root.nodeType === 8 && root.textContent === markerId) {
    return root;
  }

  // Use TreeWalker to find the comment node
  // 128 is NodeFilter.SHOW_COMMENT
  const walker = document.createTreeWalker(
    root,
    128,
    null
  );

  while (walker.nextNode()) {
    if (walker.currentNode.textContent === markerId) {
      return walker.currentNode;
    }
  }

  return null;
}
