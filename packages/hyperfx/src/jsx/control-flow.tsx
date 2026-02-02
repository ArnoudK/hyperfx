import { createEffect } from "../reactive/state";
import type { JSXElement, ReactiveValue } from "../jsx/jsx-runtime";
import type { Signal } from "../reactive/signal";
import { isSignal, createSignal } from "../reactive/signal";
import { 
  isSSR, 
  createRouterFragment, 
  createRouterComment,
} from "../pages/router-helpers";
import { getMutableChildren } from "./runtime/virtual-node";
import type { VirtualFragment, VirtualElement, VirtualNode, VirtualComment } from "./runtime/virtual-node";

interface ForProps<T> {
  each: ReactiveValue<T[]>;
  children: (item: T, index: Signal<number>) => JSXElement;
  fallback?: JSXElement;
}

export function For<T>(props: ForProps<T>): JSXElement {
  const fragment = createRouterFragment();
  const startMarker = createRouterComment('For start');
  const endMarker = createRouterComment('For end');

  // Append markers to fragment
  if (isSSR()) {
    const virtualFragment = fragment as unknown as VirtualFragment;
    const children = getMutableChildren(virtualFragment);
    children.push(startMarker as unknown as VirtualComment);
    children.push(endMarker as unknown as VirtualComment);
  } else {
    (fragment as DocumentFragment).appendChild(startMarker as Comment);
    (fragment as DocumentFragment).appendChild(endMarker as Comment);
  }

  const renderItem = Array.isArray(props.children) ? props.children[0] : props.children;

  if (typeof renderItem !== 'function') {
    throw new Error(`For component children must be a function.`);
  }

  type ItemInstance = {
    nodes: Node[];
    indexSignal: Signal<number>;
  };

  const instanceMap = new Map<T, ItemInstance[]>();
  // We keep track of the current order of instances to manage the DOM
  let _currentInstances: ItemInstance[] = [];

  const updateList = (): void => {
    // Resolve the reactive value
    let newItems: T[] = [];
    if (isSignal(props.each)) {
      newItems = props.each();
    } else if (typeof props.each === 'function') {
      newItems = (props.each as Function)();
    } else {
      newItems = props.each as T[];
    }

    if (!Array.isArray(newItems)) newItems = [];

    // Important: Use startMarker.parentNode. If null (not mounted yet), use the fragment.
    const parent = isSSR() ? fragment : ((startMarker as Comment).parentNode || fragment);

    const nextInstances: ItemInstance[] = [];
    const availableInstances = new Map<T, ItemInstance[]>();

    // Collect existing instances for reuse
    instanceMap.forEach((instances, item) => {
      availableInstances.set(item, [...instances]);
    });

    // 1. Reconciliation/Allocation Phase
    newItems.forEach((item, index) => {
      const stack = availableInstances.get(item);
      if (stack && stack.length > 0) {
        const instance = stack.shift()!;
        instance.indexSignal(index); // Update the index signal for the reused item
        nextInstances.push(instance);
      } else {
        const indexSignal = createSignal(index);
        const element = (renderItem as (item: T, index: Signal<number>) => JSXElement)(item, indexSignal);

        let nodes: Node[] = [];
        if (isSSR()) {
          // On server, treat elements as virtual nodes stored in array
          nodes = [element as any];
        } else {
          // Client: handle DOM nodes
          if (element instanceof DocumentFragment) {
            nodes = Array.from(element.childNodes);
          } else if (element instanceof Node) {
            nodes = [element];
          }
        }

        nextInstances.push({ nodes, indexSignal: indexSignal as Signal<number> });
      }
    });

    // 2. Cleanup Phase: Remove nodes that are no longer in the list
    availableInstances.forEach((stack) => {
      stack.forEach(instance => {
        if (!isSSR()) {
          instance.nodes.forEach(node => node.parentElement?.removeChild(node));
        }
      });
    });

    // 3. DOM Sync Phase: Adjust positions
    if (isSSR()) {
      // Server: Just add all nodes to virtual fragment before endMarker
      const virtualParent = parent as unknown as VirtualFragment | VirtualElement;
      const children = getMutableChildren(virtualParent);
      const endIndex = children.indexOf(endMarker as unknown as VirtualNode);
      
      // Clear existing items between markers
      if (endIndex > 0) {
        const startIndex = children.indexOf(startMarker as unknown as VirtualNode);
        if (startIndex >= 0 && startIndex < endIndex) {
          children.splice(startIndex + 1, endIndex - startIndex - 1);
        }
      }
      
      // Insert all nodes
      const insertIndex = children.indexOf(endMarker as unknown as VirtualNode);
      const allNodes = nextInstances.flatMap(inst => inst.nodes);
      children.splice(insertIndex, 0, ...(allNodes as unknown as VirtualNode[]));
    } else {
      // Client: adjust DOM positions
      let cursor: Node = endMarker as Comment;
      // We iterate backwards to use insertBefore(node, cursor) effectively
      for (let i = nextInstances.length - 1; i >= 0; i--) {
        const instance = nextInstances[i];
        if (!instance) continue;
        const nodes = instance.nodes;

        for (let j = nodes.length - 1; j >= 0; j--) {
          const node = nodes[j]!;
          if (node.nextSibling !== cursor) {
            (parent as Node).insertBefore(node, cursor);
          }
          cursor = node;
        }
      }
    }

    // Update instanceMap for the next run
    instanceMap.clear();
    nextInstances.forEach((instance, i) => {
      const item = newItems[i]!;
      const stack = instanceMap.get(item) || [];
      stack.push(instance);
      instanceMap.set(item, stack);
    });
    _currentInstances = nextInstances;
  };

  // SSR: render once, synchronously
  if (isSSR()) {
    updateList();
  } else {
    // Client: reactive rendering
    createEffect(updateList);
  }
  
  return fragment;
}

export function Index<T>(props: {
  each: ReactiveValue<T[]>,
  children: (item: () => T, index: number) => JSXElement
}): JSXElement {
  const fragment = createRouterFragment();
  const startMarker = createRouterComment('Index start');
  const endMarker = createRouterComment('Index end');
  
  if (isSSR()) {
    const virtualFragment = fragment as unknown as VirtualFragment;
    const children = getMutableChildren(virtualFragment);
    children.push(startMarker as unknown as VirtualComment);
    children.push(endMarker as unknown as VirtualComment);
  } else {
    (fragment as DocumentFragment).appendChild(startMarker as Comment);
    (fragment as DocumentFragment).appendChild(endMarker as Comment);
  }

  // We store signals for each index so we can update values without re-rendering the whole row
  const itemSignals: Signal<T>[] = [];
  const renderedNodes: Node[][] = [];

  const update = () => {
    const newItems = isSignal(props.each) ? props.each() : (typeof props.each === 'function' ? (props.each as Function)() : props.each);
    const parent = isSSR() ? fragment : ((startMarker as Comment).parentNode || fragment);

    // Grow list
    while (itemSignals.length < newItems.length) {
      const index = itemSignals.length;
      const signal = createSignal(newItems[index]);
      itemSignals.push(signal as Signal<T>);

      const element = props.children(() => signal(), index);
      
      if (isSSR()) {
        const nodes = [element as any];
        renderedNodes.push(nodes);
        const virtualParent = parent as unknown as VirtualFragment | VirtualElement;
        const children = getMutableChildren(virtualParent);
        const insertIndex = children.indexOf(endMarker as unknown as VirtualNode);
        children.splice(insertIndex, 0, ...(nodes as unknown as VirtualNode[]));
      } else {
        const nodes = element instanceof DocumentFragment ? Array.from(element.childNodes) : [element as Node];
        renderedNodes.push(nodes);
        nodes.forEach(n => (parent as Node).insertBefore(n, endMarker as Comment));
      }
    }

    // Shrink list
    while (itemSignals.length > newItems.length) {
      itemSignals.pop();
      const nodes = renderedNodes.pop();
      if (!isSSR()) {
        nodes?.forEach(n => n.parentElement?.removeChild(n));
      }
    }

    // Update existing signals
    for (let i = 0; i < newItems.length; i++) {
      if (itemSignals[i]!() !== newItems[i]) {
        itemSignals[i]!(newItems[i]);
      }
    }
  };

  // SSR: render once, synchronously
  if (isSSR()) {
    update();
  } else {
    // Client: reactive rendering
    createEffect(update);
  }

  return fragment;
}

export function Show<T>(props: {
  when: T,
  children: JSXElement | ((data: T) => JSXElement),
  fallback?: JSXElement | (() => JSXElement)
}): JSXElement {
  const fragment = createRouterFragment();
  const startMarker = createRouterComment('Show start');
  const endMarker = createRouterComment('Show end');
  
  if (isSSR()) {
    const virtualFragment = fragment as unknown as VirtualFragment;
    const children = getMutableChildren(virtualFragment);
    children.push(startMarker as unknown as VirtualComment);
    children.push(endMarker as unknown as VirtualComment);
  } else {
    (fragment as DocumentFragment).appendChild(startMarker as Comment);
    (fragment as DocumentFragment).appendChild(endMarker as Comment);
  }

  let currentNodes: Node[] = [];

  const update = () => {
    // Resolve the when prop
    const when = typeof props.when === 'function' ? props.when() : (isSignal(props.when) ? props.when() : props.when);
    
    const condition = !!when
    const data = when
    
    const parent = isSSR() ? fragment : ((startMarker as Comment).parentNode || fragment);

    // Cleanup old nodes
    if (!isSSR()) {
      currentNodes.forEach(n => n.parentElement?.removeChild(n));
    }
    currentNodes = [];

    const content = condition ? props.children : props.fallback;
    if (content) {
      const result = typeof content === 'function' ? content(data) : content;
      
      if (isSSR()) {
        const nodes = [result as any];
        const virtualParent = parent as unknown as VirtualFragment | VirtualElement;
        const children = getMutableChildren(virtualParent);
        const insertIndex = children.indexOf(endMarker as unknown as VirtualNode);
        children.splice(insertIndex, 0, ...(nodes as unknown as VirtualNode[]));
        currentNodes = nodes;
      } else {
        const nodes = result instanceof DocumentFragment ? Array.from(result.childNodes) : [result as Node];
        nodes.forEach(n => (parent as Node).insertBefore(n, endMarker as Comment));
        currentNodes = nodes;
      }
    }
  };

  // SSR: render once, synchronously
  if (isSSR()) {
    update();
  } else {
    // Client: reactive rendering
    createEffect(update);
  }

  return fragment;
}

/**
 * ErrorBoundary component for catching and handling errors
 * Can run an Effect when an error occurs
 * 
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error) => <div>Error: {error.message}</div>}
 *   onError={(error) => Effect.sync(() => console.error(error))}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export function ErrorBoundary(props: {
  fallback: (error: unknown) => JSXElement
  onError?: (error: unknown) => void
  children: JSXElement
}): JSXElement {
  const fragment = createRouterFragment();
  const errorSignal = createSignal<unknown | null>(null)
  const marker = createRouterComment('ErrorBoundary');
  
  if (isSSR()) {
    const virtualFragment = fragment as unknown as VirtualFragment;
    const children = getMutableChildren(virtualFragment);
    children.push(marker as unknown as VirtualComment);
  } else {
    (fragment as DocumentFragment).appendChild(marker as Comment);
  }
  
  // Try to render children
  try {
    if (isSSR()) {
      const virtualFragment = fragment as unknown as VirtualFragment;
      const children = getMutableChildren(virtualFragment);
      children.push(props.children as unknown as VirtualNode);
    } else if (props.children instanceof Node) {
      (fragment as DocumentFragment).appendChild(props.children);
    }
  } catch (error) {
    errorSignal(error)
    if (props.onError) {
      props.onError(error)
    }
  }
  
  // Create effect to handle error state changes (client only)
  if (!isSSR()) {
    createEffect(() => {
      const error = errorSignal()
      const parent = (marker as Comment).parentNode || fragment
      
      // Remove all nodes after marker
      let node: ChildNode | null = (marker as Comment).nextSibling
      while (node) {
        const next: ChildNode | null = node?.nextSibling || null
        if (node) {
          (parent as Node).removeChild(node as Node)
        }
        node = next
      }
      
      if (error) {
        const fallback = props.fallback(error)
        if (fallback instanceof Node) {
          (parent as Node).appendChild(fallback)
        }
      } else {
        if (props.children instanceof Node) {
          (parent as Node).appendChild(props.children)
        }
      }
    })
  }
  
  return fragment
}