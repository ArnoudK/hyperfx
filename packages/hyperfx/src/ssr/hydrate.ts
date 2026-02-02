// Client-side hydration for SSR-rendered content - Structural Matching
import { JSXElement, startHydration, endHydration } from "../jsx/jsx-runtime";
import type { HydrationData } from "./render";
import { getRegisteredSignals } from "../reactive/signal";

/**
 * Read hydration data from the window global
 */
export function readHydrationData(): HydrationData | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // Check for window global
  const data = (window as any).__HYPERFX_HYDRATION_DATA__;
  if (data) {
    return data as HydrationData;
  }

  // Fallback: try reading from script tag
  if (typeof document !== 'undefined') {
    const script = document.querySelector('script[type="application/hyperfx-hydration"]');
    if (script?.textContent) {
      try {
        return JSON.parse(script.textContent) as HydrationData;
      } catch (error) {
        console.error('Failed to parse hydration data:', error);
      }
    }
  }

  return null;
}

/**
 * Walk client and server trees in parallel, validating structure matches
 * Returns true if trees match, false if mismatch detected
 */
function walkAndValidate(clientNode: Node, serverNode: Node, path: string = 'root'): boolean {
  // Both must be elements
  if (!(clientNode instanceof Element) || !(serverNode instanceof Element)) {
    if (clientNode.nodeType !== serverNode.nodeType) {
      console.warn(`[Hydration] Node type mismatch at ${path}: client=${clientNode.nodeType}, server=${serverNode.nodeType}`);
      return false;
    }
    return true;
  }

  // Tags must match
  if (clientNode.tagName !== serverNode.tagName) {
    console.warn(`[Hydration] Tag mismatch at ${path}: client=<${clientNode.tagName.toLowerCase()}>, server=<${serverNode.tagName.toLowerCase()}>`);
    return false;
  }

  // Get element children (ignore text nodes for structure validation)
  const clientChildren = Array.from(clientNode.children);
  const serverChildren = Array.from(serverNode.children);

  // Child count must match
  if (clientChildren.length !== serverChildren.length) {
    console.warn(`[Hydration] Child count mismatch at ${path}/<${clientNode.tagName.toLowerCase()}>: client=${clientChildren.length}, server=${serverChildren.length}`);
    return false;
  }

  // Recursively validate all children
  for (let i = 0; i < clientChildren.length; i++) {
    const clientChild = clientChildren[i];
    const serverChild = serverChildren[i];
    if (clientChild && serverChild) {
      const childPath = `${path}/<${clientNode.tagName.toLowerCase()}>[${i}]`;
      if (!walkAndValidate(clientChild, serverChild, childPath)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Hydrate an application into a container using structural matching.
 * 
 * This approach:
 * 1. Executes the component factory to build a fresh client DOM tree
 * 2. Validates the client tree matches the server tree structurally
 * 3. Replaces server DOM with client DOM (which has event handlers attached)
 * 4. Restores signal state from hydration data
 * 
 * On mismatch: Falls back to full client-side render
 * 
 * @param container - The DOM element containing the SSR output
 * @param factory - A function that returns the root component (JSXElement)
 */
export function hydrate(container: Element, factory: () => JSXElement): void {
  // Get all server-rendered children (could be multiple elements)
  const serverChildren = Array.from(container.children);
  
  if (serverChildren.length === 0) {
    console.warn('[HyperFX] No server-rendered content found. Performing client-side mount.');
    const root = factory();
    if (root instanceof Node) {
      container.appendChild(root);
    }
    return;
  }

  // Read hydration data for signal restoration
  const hydrationData = readHydrationData();

  // Enable hydration mode flag (for any components that need to know)
  startHydration();

  try {
    // Execute the component logic - creates a fresh client tree with handlers
    const clientRoot = factory();

    // Handle different return types from factory
    let clientElements: Element[];
    
    if (clientRoot instanceof DocumentFragment) {
      // Factory returned a fragment - extract all element children
      clientElements = Array.from(clientRoot.children);
    } else if (clientRoot instanceof Element) {
      // Factory returned a single element
      clientElements = [clientRoot];
    } else {
      throw new Error('Factory must return an Element or DocumentFragment for hydration');
    }

    // Validate client and server have same number of root elements
    if (clientElements.length !== serverChildren.length) {
      console.warn(`[HyperFX] Root element count mismatch: client=${clientElements.length}, server=${serverChildren.length}`);
      throw new Error('Structure mismatch: different number of root elements');
    }

    // Validate that each client/server pair matches structurally
    let allMatch = true;
    for (let i = 0; i < clientElements.length; i++) {
      const clientEl = clientElements[i];
      const serverEl = serverChildren[i];
      if (clientEl && serverEl) {
        const matches = walkAndValidate(clientEl, serverEl, `root[${i}]`);
        if (!matches) {
          allMatch = false;
          break;
        }
      }
    }

    if (!allMatch) {
      console.warn('[HyperFX] Structure mismatch detected. Falling back to full client-side render.');
    }

    // Replace all server children with client children
    // Client DOM has all event handlers and reactive bindings attached
    container.replaceChildren(...clientElements);

    // Restore signal values after tree is mounted
    if (hydrationData?.state?.signals) {
      const registeredSignals = getRegisteredSignals();
      
      for (const [key, value] of Object.entries(hydrationData.state.signals)) {
        const signal = registeredSignals.get(key);
        if (signal) {
          try {
            signal.set(value);
          } catch (e) {
            console.warn(`[HyperFX] Failed to restore signal "${key}":`, e);
          }
        }
      }
    }

  } catch (error) {
    console.error('[HyperFX] Hydration failed:', error);
    console.warn('[HyperFX] Falling back to client-side render');
    
    try {
      endHydration();
      const fallbackRoot = factory();
      if (fallbackRoot instanceof Node) {
        container.replaceChildren(fallbackRoot);
      }
    } catch (fallbackError) {
      console.error('[HyperFX] Fallback render also failed:', fallbackError);
    }
    return;
  } finally {
    endHydration();
  }
}

/**
 * Check if the page has potential for hydration
 */
export function isHydratable(container: Element): boolean {
  // Check if there's any element children in the container
  // (text nodes and comments don't count)
  return container.children.length > 0;
}
