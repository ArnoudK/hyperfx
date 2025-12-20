import { createEffect } from "../reactive/state";
import type { JSXElement, ReactiveValue } from "../jsx/jsx-runtime";
import type { Signal } from "../reactive/signal";
import { isSignal, createSignal } from "../reactive/signal";

interface ForProps<T> {
  each: ReactiveValue<T[]>;
  children: (item: T, index: () => number) => JSXElement;
  fallback?: JSXElement;
}

export function For<T>(props: ForProps<T>): JSXElement {
  const fragment = document.createDocumentFragment();
  const startMarker = document.createComment('For start');
  const endMarker = document.createComment('For end');

  fragment.appendChild(startMarker);
  fragment.appendChild(endMarker);

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
  let currentInstances: ItemInstance[] = [];

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
    const parent = startMarker.parentNode || fragment;

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
        const element = renderItem(item, indexSignal as any);

        let nodes: Node[] = [];
        if (element instanceof DocumentFragment) {
          nodes = Array.from(element.childNodes);
        } else if (element instanceof Node) {
          nodes = [element];
        }

        nextInstances.push({ nodes, indexSignal: indexSignal as Signal<number> });
      }
    });

    // 2. Cleanup Phase: Remove nodes that are no longer in the list
    availableInstances.forEach((stack) => {
      stack.forEach(instance => {
        instance.nodes.forEach(node => node.parentElement?.removeChild(node));
      });
    });

    // 3. DOM Sync Phase: Adjust positions
    let cursor: Node = endMarker;
    // We iterate backwards to use insertBefore(node, cursor) effectively
    for (let i = nextInstances.length - 1; i >= 0; i--) {
      const instance = nextInstances[i];
      if (!instance) continue;
      const nodes = instance.nodes;


      for (let j = nodes.length - 1; j >= 0; j--) {
        const node = nodes[j]!;
        if (node.nextSibling !== cursor) {
          parent.insertBefore(node, cursor);
        }
        cursor = node;
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
    currentInstances = nextInstances;
  };

  createEffect(updateList);
  return fragment;
}

export function Index<T>(props: {
  each: ReactiveValue<T[]>,
  children: (item: () => T, index: number) => JSXElement
}): JSXElement {
  const fragment = document.createDocumentFragment();
  const startMarker = document.createComment('Index start');
  const endMarker = document.createComment('Index end');
  fragment.appendChild(startMarker);
  fragment.appendChild(endMarker);

  // We store signals for each index so we can update values without re-rendering the whole row
  const itemSignals: Signal<T>[] = [];
  const renderedNodes: Node[][] = [];

  createEffect(() => {
    const newItems = isSignal(props.each) ? props.each() : (typeof props.each === 'function' ? (props.each as Function)() : props.each);
    const parent = startMarker.parentNode || fragment;

    // Grow list
    while (itemSignals.length < newItems.length) {
      const index = itemSignals.length;
      const signal = createSignal(newItems[index]);
      itemSignals.push(signal as Signal<T>);

      const element = props.children(() => signal(), index);
      const nodes = element instanceof DocumentFragment ? Array.from(element.childNodes) : [element as Node];
      renderedNodes.push(nodes);

      nodes.forEach(n => parent.insertBefore(n, endMarker));
    }

    // Shrink list
    while (itemSignals.length > newItems.length) {
      itemSignals.pop();
      const nodes = renderedNodes.pop();
      nodes?.forEach(n => n.parentElement?.removeChild(n));
    }

    // Update existing signals
    for (let i = 0; i < newItems.length; i++) {
      if (itemSignals[i]!() !== newItems[i]) {
        itemSignals[i]!(newItems[i]);
      }
    }
  });

  return fragment;
}

export function Show(props: {
  when: any,
  children: JSXElement | (() => JSXElement),
  fallback?: JSXElement | (() => JSXElement)
}): JSXElement {
  const fragment = document.createDocumentFragment();
  const startMarker = document.createComment('Show start');
  const endMarker = document.createComment('Show end');
  fragment.appendChild(startMarker);
  fragment.appendChild(endMarker);

  let currentNodes: Node[] = [];

  createEffect(() => {
    const condition = typeof props.when === 'function' ? props.when() : (isSignal(props.when) ? props.when() : props.when);
    const parent = startMarker.parentNode || fragment;

    // Cleanup old nodes
    currentNodes.forEach(n => n.parentElement?.removeChild(n));
    currentNodes = [];

    const content = condition ? props.children : props.fallback;
    if (content) {
      const result = typeof content === 'function' ? (content as Function)() : content;
      const nodes = result instanceof DocumentFragment ? Array.from(result.childNodes) : [result as Node];
      nodes.forEach(n => parent.insertBefore(n, endMarker));
      currentNodes = nodes;
    }
  });

  return fragment;
}