import { createEffect } from "../reactive/signal";
import type {  JSXElement, ReactiveValue } from "../jsx/jsx-runtime";
import type { Accessor } from "../reactive/signal";
import { isAccessor, createSignal } from "../reactive/signal";
import {
  isSSR,
  createUniversalFragment,
  createUniversalComment,
} from "./runtime/universal-node";
import type { SSRNode } from "../ssr/render";
import { Truthy } from "../tools/type_utils";

interface ForProps<T> {
  each: ReactiveValue<T[]>;
  children: (item: T, index: Accessor<number>) => JSXElement;
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
    indexSignal: Accessor<number>;
    setIndex: (value: number) => () => void;
  };

  const instanceMap = new Map<T, ItemInstance[]>();

  const updateList = (): void => {
    let newItems: T[] = [];
    if (isAccessor(props.each)) {
      newItems = (props.each as (() => T[]))();
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
        instance.setIndex(index);
        nextInstances.push(instance);
      } else {
        const [indexSignalGet, indexSignalSet] = createSignal(index);
        const element = (renderItem as (item: T, index: Accessor<number>) => JSXElement)(item, indexSignalGet);

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
        nextInstances.push({ nodes, indexSignal: indexSignalGet as Accessor<number>, setIndex: indexSignalSet });
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

  return fragment;
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

  const itemSignals: { get: Accessor<T>, set: (value: T) => () => void }[] = [];
  const renderedNodes: (Node | SSRNode)[][] = [];

  const update = () => {
    const newItems = isAccessor(props.each) ? (props.each as () => T[])() : (typeof props.each === 'function' ? (props.each as Function)() : props.each);
    const parent = isSSR() ? fragment : ((startMarker as Comment).parentNode || fragment);

    while (itemSignals.length < newItems.length) {
      const index = itemSignals.length;
      const [sigGet, sigSet] = createSignal(newItems[index]);
      itemSignals.push({ get: sigGet, set: sigSet });

      const element = props.children(() => sigGet(), index);

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
      if (itemSignals[i]!.get() !== newItems[i]) {
        itemSignals[i]!.set(newItems[i]);
      }
    }
  };

  if (isSSR()) {
    update();
  } else {
    createEffect(update);
  }

  return fragment;
}

export function Show<T>(props: {
  when: T,
  children: JSXElement | ((data: Truthy<T>) => JSXElement),
  fallback?: JSXElement | (() => JSXElement)
}): JSXElement {
  const fragment = createUniversalFragment();
  const startMarker = createUniversalComment('Show start');
  const endMarker = createUniversalComment('Show end');

  (fragment as any).appendChild(startMarker);
  (fragment as any).appendChild(endMarker);

  let currentNodes: (Node | SSRNode)[] = [];

  const update = () => {
    const when = typeof props.when === 'function' ? props.when() : (isAccessor(props.when) ? (props.when as () => any)() : props.when);
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

  return fragment;
}

export function ErrorBoundary(props: {
  fallback: (error: unknown, reset?: () => void) => JSXElement
  onError?: (error: unknown, reset?: () => void) => void
  children: JSXElement
}): JSXElement {
  const fragment = createUniversalFragment();
  const [errorSignal, setErrorSignal] = createSignal<unknown | null>(null);
  const marker = createUniversalComment('ErrorBoundary');

  (fragment as any).appendChild(marker);

  const reset = () => {
    setErrorSignal(null);
  };

  try {
    if (isSSR()) {
      (fragment as SSRNode).appendChild!(props.children as unknown as SSRNode);
    } else if (props.children instanceof Node) {
      (fragment as DocumentFragment).appendChild(props.children);
    }
  } catch (error) {
    setErrorSignal(error);
    if (props.onError) {
      props.onError(error, reset);
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
        const fallback = props.fallback(error, reset);
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

  return fragment;
}
