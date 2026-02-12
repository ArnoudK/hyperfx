// Client-side hydration for SSR-rendered content - Structural Matching
import { JSXElement, startHydration, endHydration } from "../jsx/jsx-runtime";
import type { HydrationData } from "./render";
import { getRegisteredSignals, getSetter } from "../reactive/signal";

/**
 * Read hydration data from the window global
 */
export function readHydrationData(): HydrationData | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // Check for window global
  const data = (window as { __HYPERFX_HYDRATION_DATA__?: unknown }).__HYPERFX_HYDRATION_DATA__;
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
  if (clientNode.nodeType !== serverNode.nodeType) {
    if (isIgnorableWhitespaceText(clientNode) || isIgnorableWhitespaceText(serverNode)) {
      return true;
    }
    if (isIgnorableComment(clientNode) || isIgnorableComment(serverNode)) {
      return true;
    }
    console.warn(`[Hydration] Node type mismatch at ${path}: client=${clientNode.nodeType}, server=${serverNode.nodeType}`);
    return false;
  }

  if (clientNode.nodeType === Node.TEXT_NODE) {
    const serverText = serverNode.textContent ?? '';
    const clientText = clientNode.textContent ?? '';
    if ((serverText.trim() === '' && clientText.trim() !== '') || (serverText.trim() !== '' && clientText.trim() === '')) {
      return true;
    }
    if (clientText !== serverText) {
      console.warn(`[Hydration] Text mismatch at ${path}: client="${clientText}", server="${serverText}"`);
      return false;
    }
    return true;
  }

  if (clientNode.nodeType === Node.COMMENT_NODE) {
    const clientComment = clientNode.textContent ?? '';
    const serverComment = serverNode.textContent ?? '';
    if (clientComment !== serverComment) {
      console.warn(`[Hydration] Comment mismatch at ${path}: client="${clientComment}", server="${serverComment}"`);
      return false;
    }
    return true;
  }

  if (!(clientNode instanceof Element) || !(serverNode instanceof Element)) {
    return true;
  }

  const clientTextOnly = Array.from(clientNode.childNodes).every((node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() === '');
  const serverIsElement = serverNode.nodeType === Node.ELEMENT_NODE;
  if (clientTextOnly && serverIsElement) {
    return true;
  }

  if (clientNode.tagName !== serverNode.tagName) {
    console.warn(`[Hydration] Tag mismatch at ${path}: client=<${clientNode.tagName.toLowerCase()}>, server=<${serverNode.tagName.toLowerCase()}>`);
    return false;
  }

  const clientChildren = Array.from(clientNode.childNodes).filter((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? '').trim() !== '';
    }
    if (node.nodeType === Node.COMMENT_NODE) {
      return !isHydrationMarker(node);
    }
    return true;
  });
  const serverChildren = Array.from(serverNode.childNodes).filter((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? '').trim() !== '';
    }
    if (node.nodeType === Node.COMMENT_NODE) {
      return !isHydrationMarker(node);
    }
    return true;
  });

  if (clientChildren.length !== serverChildren.length) {
    console.warn(`[Hydration] Child count mismatch at ${path}/<${clientNode.tagName.toLowerCase()}>: client=${clientChildren.length}, server=${serverChildren.length}`);
    return false;
  }

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

function isHydrationMarker(node: Node): boolean {
  if (node.nodeType !== Node.COMMENT_NODE) return false;
  const text = node.textContent ?? '';
  return text.startsWith('hfx:') || text.startsWith('#');
}

function isIgnorableWhitespaceText(node: Node): boolean {
  if (node.nodeType !== Node.TEXT_NODE) return false;
  return (node.textContent ?? '').trim() === '';
}

function isIgnorableComment(node: Node): boolean {
  return node.nodeType === Node.COMMENT_NODE && isHydrationMarker(node);
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
  const rawServerNodes = Array.from(container.childNodes);
  let serverChildren = normalizeHydrationNodes(rawServerNodes);

  if (serverChildren.length === 0 && rawServerNodes.length > 0) {
    serverChildren = rawServerNodes;
  }

  if (serverChildren.length === 0) {
    const htmlContainer = container as HTMLElement;
    const hasContent = rawServerNodes.length > 0 || (container.textContent ?? '').trim() !== '' || (htmlContainer.innerHTML ?? '').trim() !== '';
    if (!hasContent) {
      console.warn('[HyperFX] No server-rendered content found. Performing client-side mount.');
    }
    const root = factory();
    if (root instanceof Node) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(root);
    }
    return;
  }

  const hydrationData = readHydrationData();
  startHydration(container);

  if (hydrationData?.state?.signals) {
    const registeredSignals = getRegisteredSignals();
    for (const [key, value] of Object.entries(hydrationData.state.signals)) {
      const signal = registeredSignals.get(key);
      if (signal) {
        try {
          const setter = getSetter(signal);
          setter?.(value);
        } catch (e) {
          console.warn('[Hydration] Failed to restore signal', key, e);
        }
      }
    }
  }

  try {
    // Execute the component logic - creates a fresh client tree with handlers
    const clientRoot = factory();

    let clientNodes: Node[];

    if (clientRoot instanceof DocumentFragment) {
      clientNodes = normalizeHydrationNodes(Array.from(clientRoot.childNodes));
    } else if (clientRoot instanceof Node) {
      clientNodes = [clientRoot];
    } else {
      throw new Error('Factory must return a Node or DocumentFragment for hydration');
    }

    if (clientNodes.length !== serverChildren.length) {
      console.warn(`[HyperFX] Root element count mismatch: client=${clientNodes.length}, server=${serverChildren.length}`);
      throw new Error('Structure mismatch: different number of root elements');
    }

    // Validate that each client/server pair matches structurally
    let allMatch = true;
    for (let i = 0; i < clientNodes.length; i++) {
      const clientNode = clientNodes[i];
      const serverNode = serverChildren[i];
      if (clientNode && serverNode) {
        const matches = walkAndValidate(clientNode, serverNode, `root[${i}]`);
        if (!matches) {
          allMatch = false;
          break;
        }
      }
    }

    if (!allMatch) {
      console.warn('[HyperFX] Structure mismatch detected. Falling back to full client-side render.');
    }

    const alreadyMounted = clientNodes.every((node) => node.parentNode === container);
    const forceReplace = serverChildren.some((node) => node.nodeType !== Node.ELEMENT_NODE);

    if (!allMatch || !alreadyMounted || forceReplace) {
      replaceContainerChildren(container, clientNodes);
    }

  } catch (error) {
    console.error('[HyperFX] Hydration failed:', error);
    console.warn('[HyperFX] Falling back to client-side render');

    try {
      endHydration();
      const fallbackRoot = factory();
      if (fallbackRoot instanceof Node) {
        replaceContainerChildren(container, [fallbackRoot]);
      }
    } catch (fallbackError) {
      console.error('[HyperFX] Fallback render also failed:', fallbackError);
    }
    return;
  } finally {
    endHydration();
  }
}

function normalizeHydrationNodes(nodes: Node[]): Node[] {
  const filtered: Node[] = [];
  for (const node of nodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      if ((node.textContent ?? '').trim() === '') continue;
      filtered.push(node);
      continue;
    }
    if (node.nodeType === Node.COMMENT_NODE) {
      if (isHydrationMarker(node)) continue;
      filtered.push(node);
      continue;
    }
    filtered.push(node);
  }
  return filtered;
}

function replaceContainerChildren(container: Element, nodes: Node[]): void {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  for (const node of nodes) {
    container.appendChild(node);
  }
}

/**
 * Check if the page has potential for hydration
 */
export function isHydratable(container: Element): boolean {
  // Check if there are element children in the container
  // (text nodes and comments don't count)
  return container.children.length > 0;
}
