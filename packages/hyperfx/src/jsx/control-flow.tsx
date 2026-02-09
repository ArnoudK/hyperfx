import { createEffect } from "../reactive/state";
import type { JSXElement, ReactiveValue } from "../jsx/jsx-runtime";
import type { Signal } from "../reactive/signal";
import { isSignal, createSignal } from "../reactive/signal";
import {
  isSSR,
  createUniversalFragment,
  createUniversalComment,
} from "./runtime/universal-node";
import type { SSRNode } from "../ssr/render";

interface ForProps<T> {
  each: ReactiveValue<T[]>;
  children: (item: T, index: Signal<number>) => JSXElement;
  fallback?: JSXElement;
}

export function For<T>(props: ForProps<T>): JSXElement {
  const fragment = createUniversalFragment();
  const startMarker = createUniversalComment('For start');
  const endMarker = createUniversalComment('For end');

  (fragment as any).appendChild(startMarker);
  (fragment as any).appendChild(endMarker);

  const renderItem = Array.isArray(props.children) ? props.children[0] : props.children;

  if (typeof renderItem !== 'function') {
    throw new Error(`For component children must be a function.`);
  }

  type ItemInstance = {
    nodes: (Node | SSRNode)[];
    indexSignal: Signal<number>;
  };

  const instanceMap = new Map<T, ItemInstance[]>();

  const updateList = (): void => {
    let newItems: T[] = [];
    if (isSignal(props.each)) {
      newItems = props.each() as T[];
    } else if (typeof props.each === 'function') {
      newItems = (props.each as Function)() as T[];
    } else {
      newItems = props.each as T[];
    }

    if (!Array.isArray(newItems)) newItems = [];

    const parent = isSSR() ? fragment : ((startMarker as Comment).parentNode || fragment);

    const nextInstances: ItemInstance[] = [];
    const availableInstances = new Map<T, ItemInstance[]>();

    instanceMap.forEach((instances, item) => {
      availableInstances.set(item, [...instances]);
    });

    newItems.forEach((item, index) => {
      const stack = availableInstances.get(item);
      if (stack && stack.length > 0) {
        const instance = stack.shift()!;
        instance.indexSignal(index);
        nextInstances.push(instance);
      } else {
        const indexSignal = createSignal(index);
        const element = (renderItem as (item: T, index: Signal<number>) => JSXElement)(item, indexSignal);

        let nodes: (Node | SSRNode)[] = [];
        if (isSSR()) {
          nodes = [element as unknown as SSRNode];
        } else {
          if (element instanceof DocumentFragment) {
            nodes = Array.from(element.childNodes);
          } else if (element instanceof Node) {
            nodes = [element];
          }
        }
        nextInstances.push({ nodes, indexSignal: indexSignal as Signal<number> });
      }
    });

    availableInstances.forEach((stack) => {
      stack.forEach(instance => {
        if (!isSSR()) {
          instance.nodes.forEach(node => (node as Node).parentElement?.removeChild(node as Node));
        }
      });
    });

    if (isSSR()) {
      const children = (parent as SSRNode).childNodes || [];
      const startIndex = children.indexOf(startMarker as SSRNode);
      const endIndex = children.indexOf(endMarker as SSRNode);
      if (startIndex >= 0 && endIndex > startIndex) {
        const toRemove = children.slice(startIndex + 1, endIndex);
        toRemove.forEach((n) => (parent as SSRNode).removeChild!(n));
      }
      const allNodes = nextInstances.flatMap(inst => inst.nodes) as SSRNode[];
      allNodes.forEach(node => (parent as SSRNode).insertBefore!(node, endMarker as SSRNode));
    } else {
      let cursor: Node = endMarker as Comment;
      for (let i = nextInstances.length - 1; i >= 0; i--) {
        const instance = nextInstances[i];
        if (!instance) continue;
        const nodes = instance.nodes as Node[];
        for (let j = nodes.length - 1; j >= 0; j--) {
          const node = nodes[j]!;
          if (node.nextSibling !== cursor) {
            (parent as Node).insertBefore(node, cursor);
          }
          cursor = node;
        }
      }
    }

    instanceMap.clear();
    nextInstances.forEach((instance, i) => {
      const item = newItems[i]!;
      const stack = instanceMap.get(item) || [];
      stack.push(instance);
      instanceMap.set(item, stack);
    });
  };

  if (isSSR()) {
    updateList();
  } else {
    createEffect(updateList);
  }

  return fragment as unknown as JSXElement;
}

export function Index<T>(props: {
  each: ReactiveValue<T[]>,
  children: (item: () => T, index: number) => JSXElement
}): JSXElement {
  const fragment = createUniversalFragment();
  const startMarker = createUniversalComment('Index start');
  const endMarker = createUniversalComment('Index end');

  (fragment as any).appendChild(startMarker);
  (fragment as any).appendChild(endMarker);

  const itemSignals: Signal<T>[] = [];
  const renderedNodes: (Node | SSRNode)[][] = [];

  const update = () => {
    const newItems = isSignal(props.each) ? props.each() : (typeof props.each === 'function' ? (props.each as Function)() : props.each);
    const parent = isSSR() ? fragment : ((startMarker as Comment).parentNode || fragment);

    while (itemSignals.length < newItems.length) {
      const index = itemSignals.length;
      const signal = createSignal(newItems[index]);
      itemSignals.push(signal as Signal<T>);

      const element = props.children(() => signal(), index);

      if (isSSR()) {
        const nodes = [element as unknown as SSRNode];
        renderedNodes.push(nodes);
        nodes.forEach(n => (parent as SSRNode).insertBefore!(n, endMarker as SSRNode));
      } else {
        const nodes = element instanceof DocumentFragment ? Array.from(element.childNodes) : [element as Node];
        renderedNodes.push(nodes);
        nodes.forEach(n => (parent as Node).insertBefore(n, endMarker as Comment));
      }
    }

    while (itemSignals.length > newItems.length) {
      itemSignals.pop();
      const nodes = renderedNodes.pop();
      if (!isSSR()) {
        nodes?.forEach(n => (n as Node).parentElement?.removeChild(n as Node));
      }
    }

    for (let i = 0; i < newItems.length; i++) {
      if (itemSignals[i]!() !== newItems[i]) {
        itemSignals[i]!(newItems[i]);
      }
    }
  };

  if (isSSR()) {
    update();
  } else {
    createEffect(update);
  }

  return fragment as unknown as JSXElement;
}

export function Show<T>(props: {
  when: T,
  children: JSXElement | ((data: T) => JSXElement),
  fallback?: JSXElement | (() => JSXElement)
}): JSXElement {
  const fragment = createUniversalFragment();
  const startMarker = createUniversalComment('Show start');
  const endMarker = createUniversalComment('Show end');

  (fragment as any).appendChild(startMarker);
  (fragment as any).appendChild(endMarker);

  let currentNodes: (Node | SSRNode)[] = [];

  const update = () => {
    const when = typeof props.when === 'function' ? props.when() : (isSignal(props.when) ? props.when() : props.when);
    const condition = !!when;
    const data = when;
    const parent = isSSR() ? fragment : ((startMarker as Comment).parentNode || fragment);

    if (!isSSR()) {
      currentNodes.forEach(n => (n as Node).parentElement?.removeChild(n as Node));
    }
    currentNodes = [];

    const content = condition ? props.children : props.fallback;
    if (content) {
      const result = typeof content === 'function' ? (content as any)(data) : content;
      if (isSSR()) {
        const nodes = [result as unknown as SSRNode];
        nodes.forEach(n => (parent as SSRNode).insertBefore!(n, endMarker as SSRNode));
        currentNodes = nodes;
      } else {
        const nodes = result instanceof DocumentFragment ? Array.from(result.childNodes) : [result as Node];
        nodes.forEach(n => (parent as Node).insertBefore(n, endMarker as Comment));
        currentNodes = nodes;
      }
    }
  };

  if (isSSR()) {
    update();
  } else {
    createEffect(update);
  }

  return fragment as unknown as JSXElement;
}

export function ErrorBoundary(props: {
  fallback: (error: unknown) => JSXElement
  onError?: (error: unknown) => void
  children: JSXElement
}): JSXElement {
  const fragment = createUniversalFragment();
  const errorSignal = createSignal<unknown | null>(null);
  const marker = createUniversalComment('ErrorBoundary');

  (fragment as any).appendChild(marker);

  try {
    if (isSSR()) {
      (fragment as SSRNode).appendChild!(props.children as unknown as SSRNode);
    } else if (props.children instanceof Node) {
      (fragment as DocumentFragment).appendChild(props.children);
    }
  } catch (error) {
    errorSignal(error);
    if (props.onError) {
      props.onError(error);
    }
  }

  if (!isSSR()) {
    createEffect(() => {
      const error = errorSignal();
      const parent = (marker as Comment).parentNode || fragment;
      let node: ChildNode | null = (marker as Comment).nextSibling;
      while (node) {
        const next: ChildNode | null = node?.nextSibling || null;
        (parent as Node).removeChild(node as Node);
        node = next;
      }

      if (error) {
        const fallback = props.fallback(error);
        if (fallback instanceof Node) {
          (parent as Node).appendChild(fallback);
        }
      } else {
        if (props.children instanceof Node) {
          (parent as Node).appendChild(props.children as Node);
        }
      }
    });
  }

  return fragment as unknown as JSXElement;
}
