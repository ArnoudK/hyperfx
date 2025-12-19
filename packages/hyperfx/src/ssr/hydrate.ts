// Client-side hydration for SSR-rendered content - Direct DOM Implementation
import { JSXElement } from "../jsx/jsx-runtime";
import { ReactiveSignal, createEffect } from "../reactive/state";
import { HydrationData, HydrationMarker } from "./render";

/**
 * Hydration context for managing hydration process
 */
export interface HydrationContext {
  markers: HydrationMarker[];
  elements: Map<number, Element>;
  nodeElements: Map<string, Element>;
  currentIndex: number;
}

/**
 * Create a hydration context from hydration data
 */
export function createHydrationContext(hydrationData: HydrationData): HydrationContext {
  return {
    markers: hydrationData.markers,
    elements: new Map(),
    nodeElements: new Map(),
    currentIndex: 0
  };
}

/**
 * Parse hydration data from the DOM
 */
export function parseHydrationData(): HydrationData | null {
  const script = document.querySelector('script[type="application/hyperfx-hydration"]');
  if (!script) {
    return null;
  }

  try {
    return JSON.parse(script.textContent || '{}') as HydrationData;
  } catch {
    return null;
  }
}

/**
 * Find all hydration markers in the DOM
 */
export function findHydrationMarkers(): Map<number, Element> {
  const markers = new Map<number, Element>();
  const elements = document.querySelectorAll('[data-hfx-hydration]');
  
  elements.forEach((element) => {
    const index = parseInt(element.getAttribute('data-hfx-hydration') || '0');
    markers.set(index, element);
  });
  
  return markers;
}

/**
 * Find all node IDs in the DOM
 */
export function findAllNodeIds(): Map<string, Element> {
  const nodeMap = new Map<string, Element>();
  const elements = document.querySelectorAll('[data-hfxh]');
  
  elements.forEach((element) => {
    const nodeId = element.getAttribute('data-hfxh');
    if (nodeId) {
      nodeMap.set(nodeId, element);
    }
  });
  
  return nodeMap;
}

/**
 * Find element by node ID (primary method for precise location)
 */
export function findElementByNodeId(nodeId: string): Element | null {
  return document.querySelector(`[data-hfxh="${nodeId}"]`);
}

/**
 * Find element by hydration index (fallback method)
 */
export function findElementByHydrationIndex(index: number): Element | null {
  return document.querySelector(`[data-hfx-hydration="${index}"]`);
}

/**
 * Check if a value is a reactive signal
 */
function isReactiveSignal(value: unknown): value is ReactiveSignal<unknown> {
  return typeof value === 'function' && 
         'subscribe' in value && 
         typeof (value as ReactiveSignal<unknown>).subscribe === 'function';
}

/**
 * Hydrate reactive properties for an element
 */
function hydrateReactiveProperties(
  element: Element, 
  marker: HydrationMarker
): void {
  for (const [key, value] of Object.entries(marker.props)) {
    if (isReactiveSignal(value)) {
      const typedSignal = value as ReactiveSignal<unknown>;
      
      // Create reactive binding
      createEffect(() => {
        const currentValue = typedSignal();
        
        if (element instanceof HTMLElement) {
          if (key in element) {
            // Set DOM property
            (element as unknown as Record<string, unknown>)[key] = currentValue;
          } else {
            // Set attribute
            if (currentValue === null || currentValue === undefined || currentValue === false) {
              element.removeAttribute(key);
            } else if (typeof currentValue === 'boolean') {
              if (currentValue) {
                element.setAttribute(key, '');
              } else {
                element.removeAttribute(key);
              }
            } else {
              element.setAttribute(key, String(currentValue));
            }
          }
        }
      });
    }
  }
}

/**
 * Hydrate event handlers for an element
 */
function hydrateEventHandlers(
  element: Element,
  marker: HydrationMarker
): void {
  for (const [key, handler] of Object.entries(marker.props)) {
    if (key.startsWith('on') && key.length > 2 && typeof handler === 'function') {
      const eventType = key.slice(2).toLowerCase();
      
      if (element instanceof HTMLElement || element instanceof Document) {
        element.addEventListener(eventType, handler as EventListener);
      }
    }
  }
}

/**
 * Hydrate a single element
 */
export function hydrateElement(
  element: Element,
  marker: HydrationMarker
): void {
  if (marker.hasReactiveProps) {
    hydrateReactiveProperties(element, marker);
  }
  
  if (marker.hasEventHandlers) {
    hydrateEventHandlers(element, marker);
  }
}

/**
 * Hydrate the entire application
 */
export function hydrate(element: JSXElement): void {
  const hydrationData = parseHydrationData();
  if (!hydrationData) {
    console.warn('No hydration data found');
    return;
  }

  const context = createHydrationContext(hydrationData);
  const markers = findHydrationMarkers();
  
  // Hydrate each marked element
  context.markers.forEach((marker) => {
    const domElement = markers.get(marker.index);
    if (domElement) {
      hydrateElement(domElement, marker);
      context.elements.set(marker.index, domElement);
    }
  });
}

/**
 * Enhanced hydration using node IDs for precise element location
 */
export function hydrateWithNodeIds(element: JSXElement): void {
  const hydrationData = parseHydrationData();
  if (!hydrationData) {
    console.warn('No hydration data found');
    return;
  }

  const context = createHydrationContext(hydrationData);
  const nodeElements = findAllNodeIds();
  const hydrationMarkers = findHydrationMarkers();
  
  // Populate node elements map
  context.nodeElements = nodeElements;
  
  // Hydrate each marked element using node IDs as primary locator
  context.markers.forEach((marker) => {
    // Try to find element by node ID first (most precise)
    let domElement = findElementByNodeId(marker.nodeId);
    
    // Fall back to hydration index if node ID not found
    if (!domElement) {
      domElement = hydrationMarkers.get(marker.index) || null;
      if (!domElement) {
        console.warn(`Could not find element for marker ${marker.index} (nodeId: ${marker.nodeId})`);
        return;
      }
    }
    
    hydrateElement(domElement, marker);
    context.elements.set(marker.index, domElement);
  });
}

/**
 * Manual hydration for specific elements
 */
export function hydrateManual(
  element: JSXElement,
  hydrationData: HydrationData
): void {
  const context = createHydrationContext(hydrationData);
  
  // If element has hydration markers
  if (element instanceof Element) {
    const hydrationIndex = element.getAttribute('data-hfx-hydration');
    if (hydrationIndex) {
      const index = parseInt(hydrationIndex);
      const marker = hydrationData.markers.find(m => m.index === index);
      if (marker) {
        hydrateElement(element, marker);
      }
    }
  }
}

/**
 * Clean up hydration
 */
export function cleanupHydration(): void {
  // Remove hydration data script
  const script = document.querySelector('script[type="application/hyperfx-hydration"]');
  if (script) {
    script.remove();
  }
  
  // Remove hydration markers
  const elements = document.querySelectorAll('[data-hfx-hydration]');
  elements.forEach((element) => {
    element.removeAttribute('data-hfx-hydration');
  });
  
  // Optionally remove node IDs (usually keep these for debugging)
  // Uncomment the following lines if you want to remove them:
  // const nodeElements = document.querySelectorAll('[data-hfxh]');
  // nodeElements.forEach((element) => {
  //   element.removeAttribute('data-hfxh');
  // });
}

/**
 * Check if the page is hydrated
 */
export function isHydrated(): boolean {
  return !!parseHydrationData();
}

/**
 * Rehydrate after dynamic content changes
 */
export function rehydrate(): void {
  cleanupHydration();
  // Rehydration logic would need to be implemented based on new state
  // This is a placeholder for future implementation
}