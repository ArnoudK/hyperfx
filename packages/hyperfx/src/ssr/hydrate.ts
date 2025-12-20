// Client-side hydration for SSR-rendered content - Direct DOM Implementation
import { JSXElement, startHydration, endHydration } from "../jsx/jsx-runtime";

/**
 * Scan a container for elements with data-hfxh IDs
 */
function scanForHydrationNodes(container: Element): Map<string, Element> {
  const map = new Map<string, Element>();

  // Find all marked elements
  // We use querySelectorAll to find all descendants
  const elements = container.querySelectorAll('[data-hfxh]');

  elements.forEach((el) => {
    const id = el.getAttribute('data-hfxh');
    if (id) {
      map.set(id, el);
    }
  });

  return map;
}

/**
 * Hydrate an application into a container.
 * 
 * This executes the component logic (factory) in "Hydration Mode",
 * attempting to claim existing DOM nodes instead of creating new ones.
 * 
 * @param container - The DOM element containing the SSR output
 * @param factory - A function that returns the root component (JSXElement)
 */
export function hydrate(container: Element, factory: () => JSXElement): void {
  // 1. Scan the container for existing nodes
  const hydrationMap = scanForHydrationNodes(container);

  if (hydrationMap.size === 0) {
    console.warn('Hydrate called on a container with no hydration markers (data-hfxh). Performing standard mount.');
  }

  // 2. Start Hydration Mode
  startHydration(hydrationMap);

  try {
    // 3. Execute the component logic
    const root = factory();

    // 4. Handle result
    if (root instanceof Node) {
      if (!container.contains(root)) {
        // Mismatch: The root element was newly created (not claimed).
        // This implies the SSR structure didn't match the Client structure at the root level.
        console.warn('Hydration Mismatch: Root element could not be claimed. Replaced content.');
        container.replaceChildren(root);
      } else {
        // Success: The root was claimed and is sitting in the container.
        // The renderChildren cleanup logic has already ensured the subtree is correct.
      }
    }
  } catch (error) {
    console.error('Hydration Failed:', error);
    // Fallback? If hydration crashed, we might be in an inconsistent state.
    // We could try to clear and re-render?
    // container.replaceChildren(factory()); // Retry without hydration?
  } finally {
    // 5. End Hydration Mode
    endHydration();
  }
}

/**
 * Check if the page has potential for hydration
 */
export function isHydratable(container: Element): boolean {
  return container.querySelector('[data-hfxh]') !== null;
}