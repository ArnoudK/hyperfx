// Client-side hydration for SSR-rendered content
import { VNode, mount, FRAGMENT_TAG } from "../elem/elem";
import { createEffect } from "../reactive/state";
import { HydrationData } from "./render";

// Helper function to deeply check for reactive props
function hasNestedReactiveProps(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return false;
  
  for (const key in obj) {
    const value = obj[key];
    // Check if it's a function that could be a signal
    // Signals are functions that can be called without args to get value
    if (typeof value === 'function') {
      return true; // Assume any function could be reactive
    }
    if (typeof value === 'object' && value !== null && hasNestedReactiveProps(value)) {
      return true;
    }
  }
  return false;
}

/**
 * Hydrate SSR-rendered content with interactive VNodes
 */
export function hydrate(
  vnode: VNode,
  container: HTMLElement,
  hydrationData?: HydrationData
): void {
  if (!hydrationData) {
    // No hydration data, fall back to regular mounting
    console.warn('No hydration data provided, falling back to regular mount');
    mount(vnode, container);
    return;
  }

  try {
    hydrateVNode(vnode, container, hydrationData);
  } catch (error) {
    console.error('Hydration failed, falling back to regular mount:', error);
    // Clear container and mount normally
    container.innerHTML = '';
    mount(vnode, container);
  }
}

/**
 * Hydrate a VNode by finding its corresponding DOM element
 */
function hydrateVNode(
  vnode: VNode,
  container: HTMLElement,
  hydrationData: HydrationData
): void {
  const markers = hydrationData.markers;
  let markerIndex = 0;

  function findHydratedElement(node: VNode): HTMLElement | null {
    const marker = markers[markerIndex];
    if (!marker) return null;

    const selector = `[data-hyperfx-hydrate="${marker.index}"]`;
    const element = container.querySelector(selector) as HTMLElement;

    if (element) {
      // Remove hydration marker
      element.removeAttribute('data-hyperfx-hydrate');
      markerIndex++;
      return element;
    }

    return null;
  }

  function hydrateNode(node: VNode): void {
    const element = findHydratedElement(node);
    if (!element) {
      console.warn('Could not find hydration target for VNode:', node);
      return;
    }

    // Attach VNode to DOM element
    node.dom = element;

    // Set up reactive properties if they exist
    if (node.reactiveProps) {
      console.log('🔧 Setting up reactive props for element:', element.tagName, 'props:', Object.keys(node.reactiveProps));
      // Import createEffect here to avoid circular dependency

      node.effects = node.effects || [];

      Object.entries(node.reactiveProps).forEach(([propName, signal]) => {
        console.log('🔧 Setting up reactive prop:', propName, 'initial value:', signal());
        const effect = createEffect(() => {
          const value = signal();
          console.log('🔄 Updating reactive prop', propName, 'to:', value);

          if (propName === 'textContent') {
            element.textContent = String(value);
          } else if (propName.startsWith('on') && typeof value === 'function') {
            const eventName = propName.slice(2).toLowerCase();
            // Remove old listener if any
            const oldListener = (element as any)[`__${propName}`];
            if (oldListener) {
              element.removeEventListener(eventName, oldListener);
            }
            // Add new listener
            element.addEventListener(eventName, value);
            (element as any)[`__${propName}`] = value;
          } else if (propName === 'disabled') {
            // Handle boolean disabled attribute specially
            if (value) {
              element.setAttribute('disabled', '');
            } else {
              element.removeAttribute('disabled');
            }
          } else if (propName === 'checked') {
            // Handle boolean checked attribute specially
            if (value) {
              element.setAttribute('checked', '');
            } else {
              element.removeAttribute('checked');
            }
            (element as any).checked = !!value;
          } else {
            element.setAttribute(propName, String(value));
          }
        });

        node.effects!.push(effect);
      });
    }

    // Set up event handlers from props
    Object.entries(node.props).forEach(([key, value]) => {
      if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.slice(2).toLowerCase();
        element.addEventListener(eventName, value as EventListener);
        (element as any)[`__${key}`] = value;
      }
    });

    // Recursively hydrate children
    node.children.forEach(child => {
      if (typeof child === 'object' && 'tag' in child) {
        hydrateNode(child as VNode);
      } else if (typeof child === 'function') {
        const signal = child as () => string | number | boolean;
        // `element` is node.dom, the parent element of this signal child.
        // `node` is the VNode parent of the signal.
        if (node.children.length === 1) { // If the signal is the only child of its VNode parent
          createEffect(() => {
            if (element) element.textContent = String(signal());
          });
        } else {
          // Signal is one of multiple children of VNode `node`.
          // `element` is the DOM corresponding to `node`.
          console.warn(
            `[hydrateNode] A reactive text signal was found among multiple children of <${String((node as VNode).tag)}>. ` +
            `To ensure this text updates reactively, please wrap it in its own element (e.g., <span>{yourSignal}</span>). ` +
            `This specific text segment may not be hydrated for reactivity.`
          );
          // No createEffect is set up here for this unidentifiable text node segment to avoid bare signal calls.
        }
      }
    });
  }

  hydrateNode(vnode);
}

/**
 * Automatic hydration - finds all elements with hydration markers and reattaches event handlers
 * Also sets up reactive effects for signal-based content
 */
export function autoHydrate(componentFunction: () => VNode, containerElement: HTMLElement = document.body): void {
  const isInitialSsrLoad = !((window as any).__hyperfx_client_navigated__) && containerElement.firstChild;
  (window as any).__hyperfx_client_navigated__ = true;

  const vnode = componentFunction();

  // console.log('🧪 VNode structure being hydrated:', JSON.stringify(vnode, (key, value) => {
  //   if (typeof value === 'function') return '[Function]';
  //   if (key === 'dom') return '[DOM Element]';
  //   return value;
  // }, 2));

  if (isInitialSsrLoad) {
    // Initial SSR hydration - find the correct container
    let actualContainer = containerElement;
    if (containerElement.tagName === 'BODY') {
      // Look for the main content div (the one with the VNode's classes)
      const vnodeClasses = vnode.props?.class as string;
      if (vnodeClasses) {
        const mainDiv = containerElement.querySelector(`div.${vnodeClasses.split(' ')[0]}`) as HTMLElement;
        if (mainDiv) {
          actualContainer = mainDiv;
        }
      }
    }

    // Initial SSR hydration - only hydrate components that need it
    hydrateInteractiveComponents(vnode, actualContainer);
    // Link all VNodes to their corresponding DOM elements for reactive effects
    linkVNodesToDOM(vnode, actualContainer);
    setupReactiveEffects(vnode, actualContainer);
  } else {
    // Client-side navigation - mount fresh
    containerElement.innerHTML = '';
    mount(vnode, containerElement);
    setupReactiveEffects(vnode, containerElement);
  }
}

/**
 * Simplified hydration: only attach handlers to elements that need them
 */
function hydrateInteractiveComponents(vnode: VNode, container: HTMLElement): void {
  // Find all elements with data-hyperfx-hydrate markers (these have event handlers)
  const interactiveElements = Array.from(container.querySelectorAll('[data-hyperfx-hydrate]')) as HTMLElement[];

  // Build a map of interactive VNodes by traversing the fresh VNode tree
  // We need to match the exact same traversal order that the server used
  const interactiveVNodes = new Map<number, VNode>();
  let vnodeIndex = 0;

  function collectInteractiveVNodes(node: VNode | string | (() => any) | any[]): void {
    if (typeof node === 'string' || typeof node === 'function') {
      return;
    }

    if (typeof node === 'object' && node !== null && 'tag' in node && typeof node.tag === 'string') {
      const vNodeInstance = node as VNode;
      const props = vNodeInstance.props as Record<string, any> || {};

      // Check if this VNode has event handlers OR reactive props (same logic as server)
      const hasEventHandlers = Object.keys(props).some(key => key.startsWith('on') && typeof props[key] === 'function');
      const hasReactiveProps = !!vNodeInstance.reactiveProps || hasNestedReactiveProps(props);
      const needsHydration = hasEventHandlers || hasReactiveProps;

      // Always increment for elements that would be considered by the server
      // The server checks all elements but only marks those with event handlers or reactive props
      if (needsHydration) {
        // console.log('📍 Collecting VNode at index:', vnodeIndex, vNodeInstance.tag, 'hasEventHandlers:', hasEventHandlers, 'hasReactiveProps:', hasReactiveProps);

        // Store ALL VNodes that need hydration, even if they don't currently have event handlers
        // We'll try to re-attach the handlers from the original functions
        interactiveVNodes.set(vnodeIndex, vNodeInstance);
        vnodeIndex++;
      }

      // Recursively process children
      if (vNodeInstance.children && Array.isArray(vNodeInstance.children)) {
        vNodeInstance.children.forEach(child => {
          if (typeof child === 'object' && child && 'tag' in child) {
            collectInteractiveVNodes(child);
          }
        });
      }
    }
  }

  collectInteractiveVNodes(vnode);

  // console.log('🗺️ Interactive VNodes collected:', interactiveVNodes.size);
  // console.log('🔍 Interactive DOM elements found:', interactiveElements.length);

  // Attach event handlers to marked elements
  interactiveElements.forEach(element => {
    const hydrateIndexStr = element.getAttribute('data-hyperfx-hydrate');
    if (!hydrateIndexStr) return;

    const hydrateIndex = parseInt(hydrateIndexStr, 10);
    const vNodeToHydrate = interactiveVNodes.get(hydrateIndex);

    // console.log('🔧 Hydrating element with marker:', hydrateIndex, element.tagName, element.textContent?.trim(), 'VNode found:', !!vNodeToHydrate);

    if (vNodeToHydrate && vNodeToHydrate.props) {
      const props = vNodeToHydrate.props as Record<string, any>;
      // console.log('🔍 Attempting to attach handlers for element:', element.tagName, 'Props:', Object.keys(props));

      Object.entries(props).forEach(([key, value]) => {
        if (key.startsWith('on') && typeof value === 'function') {
          const eventName = key.slice(2).toLowerCase();

          // Remove old listener if any
          const oldHandler = (element as any)[`__event_${eventName}`];
          if (oldHandler) {
            element.removeEventListener(eventName, oldHandler);
          }

          // Add new listener
          element.addEventListener(eventName, value as EventListener);
          (element as any)[`__event_${eventName}`] = value;

          // console.log('🎯 Attached', eventName, 'handler to', element.tagName, '- Text:', element.textContent?.trim());
        }
      });

      // Handle reactive props separately 
      if (vNodeToHydrate.reactiveProps) {
        console.log('🔧 Setting up reactive props during hydration for element:', element.tagName, 'props:', Object.keys(vNodeToHydrate.reactiveProps));
        
        vNodeToHydrate.effects = vNodeToHydrate.effects || [];
        
        Object.entries(vNodeToHydrate.reactiveProps).forEach(([propName, signal]) => {
          console.log('� Setting up reactive prop during hydration:', propName, 'initial value:', signal());
          const effect = createEffect(() => {
            const value = signal();
            console.log('🔄 Updating reactive prop during hydration:', propName, 'to:', value);
            setElementProperty(element, propName, value);
          });
          
          vNodeToHydrate.effects!.push(effect);
        });
      }

      // Clean up the hydration marker
      element.removeAttribute('data-hyperfx-hydrate');

      // Link VNode to DOM element for other systems
      vNodeToHydrate.dom = element;
    } else {
      console.warn('❌ No VNode found for hydration index:', hydrateIndex, 'Element:', element.tagName, element.textContent?.trim());
    }
  });
}

/**
 * Attach event handlers to SSR-rendered DOM elements with hydration markers
 */
function attachEventHandlers(vnode: VNode, containerElement: HTMLElement): void {
  // Create a map of vnodes by traversing the tree in the same order as the server
  const vnodeMap = new Map<number, VNode>();
  let vnodeMapIndex = 0; function mapVNodes(node: VNode | string | (() => any) | any[]): void {
    if (typeof node === 'string' || (typeof node === 'function' && !(node as any).__isReactiveComponent)) {
      return;
    }

    if (typeof node === 'object' && node !== null && 'tag' in node && typeof node.tag === 'string') {
      const props = (node as VNode).props || {};
      const hasEventHandlers = Object.keys(props).some(key => key.startsWith('on'));

      if (hasEventHandlers) {
        vnodeMap.set(vnodeMapIndex, node as VNode);
      }

      vnodeMapIndex++;

      if ((node as VNode).children && Array.isArray((node as VNode).children)) {
        ((node as VNode).children as (VNode | string | (() => any))[]).forEach(child => mapVNodes(child));
      }
    }
  }

  mapVNodes(vnode);

  // Attach event handlers to DOM elements with static hydration markers
  const hydratedElements = Array.from(containerElement.querySelectorAll('[data-hyperfx-hydrate]')) as HTMLElement[];

  hydratedElements.forEach((element) => {
    const hydrateIndexStr = element.getAttribute('data-hyperfx-hydrate');
    if (hydrateIndexStr === null) return;

    const hydrateIndex = parseInt(hydrateIndexStr, 10);
    const vNodeToHydrate = vnodeMap.get(hydrateIndex);

    if (vNodeToHydrate && vNodeToHydrate.props) {
      Object.entries(vNodeToHydrate.props).forEach(([key, value]) => {
        if (key.startsWith('on') && typeof value === 'function') {
          const eventName = key.slice(2).toLowerCase();
          const internalEventKey = `__event_${eventName}`;

          // Remove old listener if any
          const oldHandler = (element as any)[internalEventKey] as EventListener | undefined;
          if (oldHandler) {
            element.removeEventListener(eventName, oldHandler);
          }

          // Add new listener
          element.addEventListener(eventName, value as EventListener);
          (element as any)[internalEventKey] = value;
        }
      });
      element.removeAttribute('data-hyperfx-hydrate');
    }
  });
}

/**
 * Systematically link all VNodes to their corresponding DOM elements
 */
function linkVNodesToDOM(vnode: VNode, parentElement: HTMLElement): void {
  // console.log('🔗 Linking VNode:', vnode.tag, 'to DOM element:', parentElement.tagName);

  if (vnode.tag === FRAGMENT_TAG) {
    // For fragments, process children directly
    // console.log('📦 Processing fragment with', vnode.children?.length || 0, 'children');
    if (vnode.children) {
      let childIndex = 0;
      const elementChildren = Array.from(parentElement.children).filter(el => el instanceof HTMLElement) as HTMLElement[];
      // console.log('📦 Fragment has', elementChildren.length, 'DOM children to match');

      vnode.children.forEach((child, idx) => {
        // Only process VNode children, skip strings and functions
        if (typeof child === 'object' && child && 'tag' in child && childIndex < elementChildren.length) {
          const targetElement = elementChildren[childIndex];
          // console.log(`📦 Linking fragment child ${idx} (${String(child.tag)}) to DOM child ${childIndex} (${targetElement?.tagName})`);
          if (targetElement) {
            linkVNodesToDOM(child, targetElement);
          }
          childIndex++; // Only increment for VNode children
        }
        // Skip strings and functions - they don't have corresponding DOM elements
      });
    }
    return;
  }

  if (typeof vnode.tag === 'string') {
    // Link this VNode to the current DOM element
    vnode.dom = parentElement;
    // console.log('✅ Linked VNode', vnode.tag, 'to DOM element', parentElement.tagName);

    // Process children
    if (vnode.children) {
      let childIndex = 0;
      const elementChildren = Array.from(parentElement.children).filter(el => el instanceof HTMLElement) as HTMLElement[];
      // console.log('🔍 VNode', vnode.tag, 'has', vnode.children.length, 'children, DOM has', elementChildren.length, 'element children');

      vnode.children.forEach((child, idx) => {
        // Only process VNode children, skip strings and functions
        if (typeof child === 'object' && child && 'tag' in child && childIndex < elementChildren.length) {
          const targetElement = elementChildren[childIndex];
          // console.log(`🔍 Linking child ${idx} (${String(child.tag)}) to DOM child ${childIndex} (${targetElement?.tagName})`);
          if (targetElement) {
            linkVNodesToDOM(child, targetElement);
          }
          childIndex++; // Only increment for VNode children
        } else if (typeof child === 'function') {
          // console.log(`🔍 Skipping signal child ${idx} in VNode ${String(vnode.tag)}`);
        } else if (typeof child === 'string') {
          // console.log(`🔍 Skipping text child ${idx} in VNode ${String(vnode.tag)}: "${child}"`);
        }
        // DON'T increment childIndex for strings or functions
      });
    }
  }
}

/**
 * Set up reactive effects for VNodes with proper DOM linking
 */
function setupReactiveEffects(node: VNode | string | (() => any) | any[], parentElement: HTMLElement): void {
  if (typeof node === 'string' || (typeof node === 'function' && !(node as any).__isReactiveComponent && !(node as any).__isReactiveExpression)) {
    return;
  }

  if (typeof node === 'object' && node !== null && 'tag' in node && typeof node.tag === 'string') {
    const vNodeInstance = node as VNode;

    // Handle reactive For components
    if (vNodeInstance.props?.['data-reactive-for'] === 'true' && (vNodeInstance as any).__reactiveArrayFn && (vNodeInstance as any).__renderFn) {
      const reactiveId = vNodeInstance.props['data-reactive-id'] as string;
      let forContainer = document.querySelector(`[data-reactive-id="${reactiveId}"]`) as HTMLElement | null;
      
      // If we can't find the exact container, try to find any reactive For container
      // This can happen during client-side navigation when IDs get regenerated
      if (!forContainer) {
        forContainer = document.querySelector(`[data-reactive-for="true"]`) as HTMLElement | null;
        if (forContainer) {
          // Update the container's reactive-id to match what we're looking for
          forContainer.setAttribute('data-reactive-id', reactiveId);
        }
      }

      if (!forContainer) {
        console.error('❌ For container not found! Reactive-id:', reactiveId);
        return;
      }
        const reactiveArrayFn = (vNodeInstance as any).__reactiveArrayFn as () => any[];
        const renderFn = (vNodeInstance as any).__renderFn as (item: any, index: number) => VNode;
        const fallback = (vNodeInstance as any).__fallback as VNode | (() => VNode) | undefined;

        let previousKeyedElements = new Map<string | number, HTMLElement>();

        // Initialize previousKeyedElements from existing DOM during hydration
        const initializeKeyedElements = () => {
          try {
            const currentArrayData = reactiveArrayFn();
            if (Array.isArray(currentArrayData)) {
              const existingChildren = Array.from(forContainer.children) as HTMLElement[];
              
              currentArrayData.forEach((item: any, index: number) => {
                let key: string | number;
                if (item && typeof item === 'object' && item !== null && 'id' in item) {
                  key = String(item.id);
                } else {
                  key = `__index_${index}__`;
                }
                
                if (index < existingChildren.length) {
                  const element = existingChildren[index];
                  if (element) {
                    element.dataset.key = String(key);
                    previousKeyedElements.set(key, element);
                  }
                }
              });
            }
          } catch (error) {
            console.error('❌ Error initializing keyed elements:', error);
          }
        };

        // Initialize the keyed elements during hydration
        initializeKeyedElements();

        console.log('🔧 Creating reactive effect for For component');
        console.log('🔧 Reactive array function:', reactiveArrayFn);
        console.log('🔧 Testing reactive array function call:', reactiveArrayFn());
        
        const effectCleanup = createEffect(() => {
          console.log('🔄 For component reactive effect triggered - INSIDE EFFECT');
          console.log('🏠 For container:', forContainer, 'exists:', !!forContainer);
          console.log('📊 Container children before update:', Array.from(forContainer.children).map(c => c.textContent?.trim()));
          try {
            const currentArrayData = reactiveArrayFn();
            console.log('📊 Current array data in effect:', currentArrayData, 'length:', currentArrayData?.length);
            if (!Array.isArray(currentArrayData)) {
              console.log('❌ Data is not an array');
              return;
            }

            const newVNodes: VNode[] = [];
            if (currentArrayData.length === 0 && fallback) {
              const fallbackVNode = typeof fallback === 'function' ? fallback() : fallback;
              if (fallbackVNode && fallbackVNode.key === undefined) fallbackVNode.key = '__fallback__';
              if (fallbackVNode) newVNodes.push(fallbackVNode);
            } else {
              currentArrayData.forEach((item: any, index: number) => {
                const itemVNode = renderFn(item, index);
                if (itemVNode.key === undefined) {
                  if (item && typeof item === 'object' && item !== null && 'id' in item) {
                    itemVNode.key = String(item.id);
                  } else {
                    itemVNode.key = `__index_${index}__`;
                  }
                }
                newVNodes.push(itemVNode);
              });
            }

            console.log('🔄 Processing', newVNodes.length, 'new VNodes');
            console.log('🔄 New VNodes keys:', newVNodes.map(v => v.key));
            const newElementsMap = new Map<string | number, HTMLElement>();

            newVNodes.forEach(itemVNode => {
              const key = itemVNode.key!;
              console.log('🔍 Processing VNode with key:', key);
              let element = previousKeyedElements.get(key);

              if (element) {
                console.log('♻️ Reusing existing element for key:', key);
                previousKeyedElements.delete(key);
                updateElementInPlace(element, itemVNode);
              } else {
                console.log('🆕 Creating new element for key:', key);
                const tempMountDiv = document.createElement('div');
                mount(itemVNode, tempMountDiv);

                if (!(itemVNode.dom instanceof HTMLElement)) {
                  console.log('❌ Failed to mount VNode for key:', key);
                  return;
                }
                element = itemVNode.dom;
                element.dataset.key = String(key);
              }
              if (element) {
                newElementsMap.set(key, element);
              }
            });

            const currentDOMKeys = new Set<string>();
            newElementsMap.forEach((_, key) => currentDOMKeys.add(String(key)));

            console.log('🗑️ Removing unused elements');
            Array.from(forContainer.children).forEach(childElement => {
              const childHtmlElement = childElement as HTMLElement;
              const key = childHtmlElement.dataset.key;
              if (key && !currentDOMKeys.has(key)) {
                console.log('🗑️ Removing element with key:', key);
                childHtmlElement.remove();
              }
            });

            console.log('🔄 Reordering elements');
            let nextElement: ChildNode | null = null;
            for (let i = newVNodes.length - 1; i >= 0; i--) {
              const itemVNode = newVNodes[i];
              if (!itemVNode) continue;
              const key = itemVNode.key!;
              const element = newElementsMap.get(key)!;

              if (forContainer.contains(element)) {
                if (element.nextSibling !== nextElement) {
                  console.log('🔄 Moving element with key:', key);
                  forContainer.insertBefore(element, nextElement);
                }
              } else {
                console.log('🆕 Inserting new element with key:', key);
                forContainer.insertBefore(element, nextElement);
              }
              nextElement = element;
            }
            previousKeyedElements = newElementsMap;
            console.log('📊 Container children after update:', Array.from(forContainer.children).map(c => c.textContent?.trim()));
          } catch (error) {
            console.error('❌ Error in For component reactive effect:', error);
          }
        });
        
        console.log('✅ Reactive effect created for For component');
        
        // Store effect cleanup on the VNode for proper cleanup later
        if (!vNodeInstance.effects) {
          vNodeInstance.effects = [];
        }
        vNodeInstance.effects.push(effectCleanup);
      }

    // Handle reactive expressions (data-reactive-expr)
    if (vNodeInstance.props?.['data-reactive-expr'] === 'true' && (vNodeInstance as any).__reactiveExprFn) {
      const reactiveId = vNodeInstance.props['data-reactive-id'] as string;
      const exprContainer = document.querySelector(`[data-reactive-id="${reactiveId}"]`) as HTMLElement | null;
      const reactiveExprFn = (vNodeInstance as any).__reactiveExprFn as () => VNode[] | string;

      if (exprContainer) {
        createEffect(() => {
          try {
            const content = reactiveExprFn();
            const contentArray = Array.isArray(content) ? content : [String(content)];
            reconcileChildren(exprContainer, contentArray as (VNode | string)[]);
          } catch (error) {
            // Silent error handling
          }
        });
      }
      return;
    }

    // Handle reactive text markers
    if (vNodeInstance.props?.['data-reactive-text'] === 'true' && (vNodeInstance as any).__reactiveTextFn) {
      const reactiveId = vNodeInstance.props['data-reactive-id'] as string;
      console.log('🔍 Setting up reactive text marker with ID:', reactiveId);
      
      let textContainer = document.querySelector(`[data-reactive-id="${reactiveId}"]`) as HTMLElement | null;
      
      // If we can't find the exact container, try to find any reactive text container
      if (!textContainer) {
        console.log('🔍 Exact reactive text container not found, looking for any reactive text container');
        textContainer = document.querySelector(`[data-reactive-text="true"]`) as HTMLElement | null;
        if (textContainer) {
          console.log('✅ Found alternative reactive text container:', textContainer);
          // Update the container's reactive-id to match what we're looking for
          textContainer.setAttribute('data-reactive-id', reactiveId);
        }
      }
      
      if (textContainer) {
        console.log('✅ Found reactive text container:', textContainer);
        const reactiveTextFn = (vNodeInstance as any).__reactiveTextFn as () => any;
        
        // Create reactive effect to update the text content
        const effectCleanup = createEffect(() => {
          console.log('🔄 Reactive text effect triggered');
          try {
            const newValue = reactiveTextFn();
            const newText = String(newValue);
            console.log('📝 Updating reactive text from', textContainer.textContent, 'to', newText);
            textContainer.textContent = newText;
          } catch (error) {
            console.error('❌ Error updating reactive text:', error);
          }
        });

        // Store cleanup for later
        if (!vNodeInstance.effects) vNodeInstance.effects = [];
        vNodeInstance.effects.push(effectCleanup);
      } else {
        console.error('❌ Reactive text container not found! Reactive-id:', reactiveId);
        console.log('🔍 Available reactive text elements:', Array.from(document.querySelectorAll('[data-reactive-text]')).map(el => el.getAttribute('data-reactive-id')));
      }
    }

    // Handle reactive conditionals
    if (vNodeInstance.props?.['data-reactive-conditional'] === 'true' && (vNodeInstance as any).__reactiveConditionalFn) {
      const reactiveId = vNodeInstance.props['data-reactive-id'] as string;
      console.log('🔍 Setting up reactive conditional with ID:', reactiveId);
      
      let conditionalContainer = document.querySelector(`[data-reactive-id="${reactiveId}"]`) as HTMLElement | null;
      
      if (conditionalContainer) {
        console.log('✅ Found reactive conditional container:', conditionalContainer);
        const reactiveConditionalFn = (vNodeInstance as any).__reactiveConditionalFn as () => any;
        
        // Create reactive effect to update the conditional content
        const effectCleanup = createEffect(() => {
          console.log('🔄 Reactive conditional effect triggered');
          try {
            const result = reactiveConditionalFn();
            console.log('🔄 Conditional result:', result);
            
            // Clear existing content
            conditionalContainer.innerHTML = '';
            
            if (result && typeof result === 'object' && result.tag) {
              // Mount the VNode
              const { mount } = require('../elem/elem');
              mount(result, conditionalContainer);
            } else if (Array.isArray(result)) {
              // Mount array of VNodes
              const { mount } = require('../elem/elem');
              result.forEach(item => {
                if (item && typeof item === 'object' && item.tag) {
                  mount(item, conditionalContainer);
                }
              });
            }
            // If result is falsy, container stays empty
          } catch (error) {
            console.error('❌ Error updating reactive conditional:', error);
          }
        });

        // Store cleanup for later
        if (!vNodeInstance.effects) vNodeInstance.effects = [];
        vNodeInstance.effects.push(effectCleanup);
      } else {
        console.error('❌ Reactive conditional container not found! Reactive-id:', reactiveId);
      }
    }

    // Set up reactive effects for regular text content with proper DOM linking
    if (vNodeInstance.children && Array.isArray(vNodeInstance.children)) {
      const currentElement = vNodeInstance.dom as HTMLElement | null;

      vNodeInstance.children.forEach((child: VNode | string | (() => any), childIndex: number) => {
        if (typeof child === 'object' && child && 'tag' in child) {
          setupReactiveEffects(child, currentElement || parentElement);
        } else if (typeof child === 'function') {
          const signal = child as () => string | number | boolean;
          if (currentElement) {
            if (vNodeInstance.children.length === 1) {
              // Single reactive child - update entire text content
              console.log('🔧 Setting up single reactive child for element:', currentElement.tagName, 'initial content:', currentElement.textContent);
              createEffect(() => {
                const newValue = String(signal());
                console.log('🔄 Updating single reactive child from', currentElement.textContent, 'to', newValue);
                if (currentElement) currentElement.textContent = newValue;
              });
            } else {
              // Mixed content - find and update specific text nodes
              console.log('🔧 Setting up mixed text reactivity for element:', currentElement.tagName);
              setupMixedTextReactivity(currentElement, vNodeInstance.children, childIndex, signal);
            }
          }
        }
      });
    }
  }
}

/**
 * Set up reactivity for text signals that are mixed with other content
 */
function setupMixedTextReactivity(
  element: HTMLElement, 
  children: (VNode | string | (() => any))[], 
  signalIndex: number, 
  signal: () => string | number | boolean
): void {
  // Build the text content by evaluating all children
  const buildTextContent = () => {
    return children.map((child, index) => {
      if (typeof child === 'string') {
        return child;
      } else if (typeof child === 'function' && index === signalIndex) {
        return String(signal());
      } else if (typeof child === 'function') {
        // Other signals - call them to get their current value
        try {
          return String((child as () => any)());
        } catch {
          return '';
        }
      } else {
        // VNode children don't contribute to text content in this context
        return '';
      }
    }).join('');
  };

  // Create reactive effect to update the text content
  createEffect(() => {
    if (element) {
      element.textContent = buildTextContent();
    }
  });
}

// Helper function to update DOM element properties
function updateDomElementProperties(element: HTMLElement, props: Record<string, any>): void {
  const elProps = props || {};
  // Remove attributes not in new props (excluding 'key', 'data-key', event handlers, style)
  const currentAttributes = Array.from(element.attributes).map(attr => attr.name);
  currentAttributes.forEach(attrName => {
    if (attrName !== 'data-key' && !attrName.startsWith('on') && attrName !== 'style' && !(attrName in elProps)) {
      if (attrName === 'class' && ('className' in elProps)) return;
      if (attrName === 'for' && ('htmlFor' in elProps)) return;
      element.removeAttribute(attrName);
    }
  });

  Object.entries(elProps).forEach(([key, value]) => {
    if (key === 'children' || key === 'key' || key.startsWith('__') || key === 'ref' || key === 'innerHTML') return;

    if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase();
      const internalEventKey = `__event_${eventName}`;
      const oldHandler = (element as any)[internalEventKey] as EventListener | undefined;
      if (oldHandler !== value) {
        if (oldHandler) {
          element.removeEventListener(eventName, oldHandler);
        }
        element.addEventListener(eventName, value as EventListener);
        (element as any)[internalEventKey] = value;
      }
    } else if (typeof value === 'function') {
      // Handle reactive props (functions that return values)
      console.log('🔧 Setting up reactive prop:', key, 'for element:', element.tagName);
      createEffect(() => {
        try {
          const propValue = value();
          console.log('🔄 Updating reactive prop:', key, 'to:', propValue);
          setElementProperty(element, key, propValue);
        } catch (error) {
          console.error('❌ Error updating reactive prop:', key, error);
        }
      });
    } else {
      // Handle static props
      setElementProperty(element, key, value);
    }
  });
}

// Helper function to set an element property with proper handling
function setElementProperty(element: HTMLElement, key: string, value: any): void {
  if (key === 'style' && typeof value === 'object' && value !== null) {
    const style = element.style;
    // Clear existing style properties that are not in the new style object
    for (let i = style.length - 1; i >= 0; i--) {
      const propName = style[i];
      if (propName && !(propName in (value as Record<string, any>))) {
        style.removeProperty(propName);
      }
    }
    // Apply new style properties
    Object.entries(value).forEach(([styleProp, styleValue]) => {
      if ((element.style as any)[styleProp] !== styleValue) {
        (element.style as any)[styleProp] = styleValue as string;
      }
    });
  } else if (key === 'className') {
    if (element.className !== String(value)) element.className = String(value);
  } else if (key === 'value' || key === 'checked' || key === 'selected') {
    const targetElement = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLOptionElement;
    if (key === 'value') {
      if (targetElement.value !== value) targetElement.value = value as string;
    } else if (key === 'checked' && 'checked' in targetElement) {
      if ((targetElement as HTMLInputElement).checked !== value) (targetElement as HTMLInputElement).checked = value as boolean;
    } else if (key === 'selected' && 'selected' in targetElement) {
      if ((targetElement as HTMLOptionElement).selected !== value) (targetElement as HTMLOptionElement).selected = value as boolean;
    }

    // Ensure attribute matches property for consistency
    if (typeof value === 'boolean') {
      if (value) element.setAttribute(key, ''); else element.removeAttribute(key);
    } else {
      if (element.getAttribute(key) !== String(value)) element.setAttribute(key, String(value));
    }
  } else if (value === false || value === null || value === undefined) {
    element.removeAttribute(key);
  } else if (value === true) {
    element.setAttribute(key, '');
  } else {
    if (element.getAttribute(key) !== String(value)) element.setAttribute(key, String(value));
  }
}

// Helper function to reconcile children of a DOM element
function reconcileChildren(parentElement: HTMLElement, newChildrenVNodes: (VNode | string | Function)[]): void {
  // Simplified reconciliation: clear existing children and mount new ones.
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }

  newChildrenVNodes.forEach(child => {
    if (typeof child === 'string') {
      parentElement.appendChild(document.createTextNode(child));
    } else if (typeof child === 'object' && child && 'tag' in child) {
      mount(child as VNode, parentElement);
    } else if (typeof child === 'function') {
      const signal = child as () => string | number | boolean;
      const textNode = document.createTextNode('');
      parentElement.appendChild(textNode);
      createEffect(() => {
        textNode.textContent = String(signal());
      });
    }
  });
}

// Helper function to update an existing DOM element in place based on a new VNode
function updateElementInPlace(element: HTMLElement, vnode: VNode): void {
  updateDomElementProperties(element, vnode.props as Record<string, any>);
  reconcileChildren(element, vnode.children as (VNode | string | Function)[]);
  vnode.dom = element; // Link VNode to the existing DOM element
}


