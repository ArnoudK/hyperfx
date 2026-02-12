/**
 * Portal Component for HyperFX
 * 
 * Renders children into a different DOM element (outside the parent hierarchy).
 * Useful for modals, tooltips, dropdowns, and overlays.
 * 
 * SSR Support:
 * - On server: renders children in place (no teleportation)
 * - On client: moves children to the mount point after hydration
 */

import { createEffect } from '../reactive/signal';
import { onCleanup, pushLifecycleContext, popLifecycleContext } from '../reactive/lifecycle';
import type { JSXElement } from '../jsx/jsx-runtime';
import { isSSRMode } from './runtime/hydration';
import { createUniversalFragment } from './runtime/universal-node';

export interface PortalProps {
  /**
   * The DOM element to mount the portal content into.
   * Defaults to document.body if not specified.
   */
  mount?: Element | (() => Element | undefined);
  
  /**
   * The content to render inside the portal
   */
  children: JSXElement;
}

/**
 * Portal component - renders children into a different part of the DOM.
 * 
 * @example
 * ```tsx
 * <Portal mount={document.getElementById('modal-root')}>
 *   <div class="modal">Modal content</div>
 * </Portal>
 * ```
 * 
 * @example
 * ```tsx
 * // Default to document.body
 * <Portal>
 *   <Tooltip>Content</Tooltip>
 * </Portal>
 * ```
 */
export function Portal(props: PortalProps): JSXElement {
  // SSR: Just render children in place
  // The portal effect will run on client after hydration
  if (isSSRMode()) {
    return props.children;
  }

  // Client: Create a fragment and manage portal insertion
  const fragment = createUniversalFragment();
  
  // Create a lifecycle context for the portal
  pushLifecycleContext();
  
  // Store references to the mounted nodes for cleanup
  let mountedNodes: Node[] = [];
  
  // Get the mount target
  const getMountTarget = (): Element | null => {
    if (typeof props.mount === 'function') {
      const result = props.mount();
      return result || null;
    }
    return props.mount || document.body;
  };

  // Effect to handle portal insertion and updates
  createEffect(() => {
    const target = getMountTarget();
    
    if (!target) {
      console.warn('Portal: mount target not found');
      return;
    }

    // Get the children to portal
    const children = props.children;
    
    // Convert to array of nodes
    const newNodes: Node[] = [];
    if (children instanceof DocumentFragment) {
      newNodes.push(...Array.from(children.childNodes));
    } else if (children instanceof Node) {
      newNodes.push(children);
    } else if (children != null) {
      // Non-node children - create text node
      newNodes.push(document.createTextNode(String(children)));
    }

    // If target changed or first run, move nodes to new target
    if (mountedNodes.length > 0) {
      // Remove from previous location
      mountedNodes.forEach(node => {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      });
      mountedNodes = [];
    }

    // Insert nodes into portal target
    newNodes.forEach(node => {
      target.appendChild(node);
    });
    
    mountedNodes = newNodes;
  });

  // Cleanup when portal unmounts
  onCleanup(() => {
    mountedNodes.forEach(node => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
    mountedNodes = [];
    
    // Pop the lifecycle context
    popLifecycleContext();
  });

  // Return empty fragment (children are portaled elsewhere)
  return fragment;
}
