import { VNode, mount, unmount, patch } from "./elem";
import { ReactiveSignal, createEffect } from "../reactive/state";

// Keyed list for efficient list rendering with minimal DOM manipulation
export interface KeyedListItem<T> {
  key: string | number;
  data: T;
  vnode?: VNode;
  domNode?: Node;
}

export interface KeyedListOptions<T> {
  trackBy?: (item: T, index: number) => string | number;
  onItemAdded?: (item: T, index: number) => void;
  onItemRemoved?: (item: T, index: number) => void;
  onItemMoved?: (item: T, oldIndex: number, newIndex: number) => void;
}

export function createKeyedList<T>(
  containerTag: keyof HTMLElementTagNameMap = 'div',
  itemRenderer: (item: T, index: number) => VNode,
  options: KeyedListOptions<T> = {}
) {
  const items: KeyedListItem<T>[] = [];
  let container: VNode | null = null;
  let mounted = false;

  const trackBy = options.trackBy || ((_, index) => index);

  function getKey(item: T, index: number): string | number {
    const key = trackBy(item, index);
    return typeof key === 'string' || typeof key === 'number' ? key : index;
  }

  function findItemByKey(key: string | number): KeyedListItem<T> | undefined {
    return items.find(item => item.key === key);
  }

  function render(newData: T[]): VNode {
    if (!container) {
      container = {
        tag: containerTag,
        props: {},
        children: [],
        key: 'keyed-list-container'
      };
    }

    // Create a map of new items by key
    const newItemsMap = new Map<string | number, T>();
    const newKeys: (string | number)[] = [];
    
    newData.forEach((item, index) => {
      const key = getKey(item, index);
      newItemsMap.set(key, item);
      newKeys.push(key);
    });

    // Track items to remove, add, and reorder
    const itemsToRemove: KeyedListItem<T>[] = [];
    const itemsToAdd: { item: T; key: string | number; index: number }[] = [];
    const finalItems: KeyedListItem<T>[] = [];

    // Mark items for removal if they're not in the new data
    items.forEach(item => {
      if (!newItemsMap.has(item.key)) {
        itemsToRemove.push(item);
        options.onItemRemoved?.(item.data, items.indexOf(item));
      }
    });

    // Process new data to determine what to add/reuse
    newData.forEach((newItem, newIndex) => {
      const key = getKey(newItem, newIndex);
      const existingItem = findItemByKey(key);

      if (existingItem) {
        // Update existing item
        existingItem.data = newItem;
        existingItem.vnode = itemRenderer(newItem, newIndex);
        finalItems.push(existingItem);
        
        // Check if item moved
        const oldIndex = items.indexOf(existingItem);
        if (oldIndex !== newIndex && oldIndex !== -1) {
          options.onItemMoved?.(newItem, oldIndex, newIndex);
        }
      } else {
        // Create new item
        const newKeyedItem: KeyedListItem<T> = {
          key,
          data: newItem,
          vnode: itemRenderer(newItem, newIndex)
        };
        finalItems.push(newKeyedItem);
        itemsToAdd.push({ item: newItem, key, index: newIndex });
        options.onItemAdded?.(newItem, newIndex);
      }
    });

    // Remove items that are no longer needed
    itemsToRemove.forEach(item => {
      if (item.domNode && mounted) {
        item.domNode.parentNode?.removeChild(item.domNode);
      }
      if (item.vnode) {
        unmount(item.vnode);
      }
    });

    // Update the items array
    items.length = 0;
    items.push(...finalItems);

    // Update container children
    container.children = finalItems.map(item => item.vnode!);

    return container;
  }

  function mount_list(parentElement: HTMLElement): Node {
    if (!container) {
      throw new Error("Must call render() before mounting");
    }
    
    mounted = true;
    const domNode = mount(container, parentElement);
    
    // Store DOM references for efficient updates
    items.forEach((item, index) => {
      if (container!.dom instanceof HTMLElement) {
        item.domNode = container!.dom.childNodes[index];
      }
    });
    
    return domNode;
  }

  function update(newData: T[]): void {
    if (!mounted || !container?.dom) {
      render(newData);
      return;
    }

    const oldContainer = container;
    const newContainer = render(newData);
    
    if (oldContainer.dom) {
      patch(oldContainer, newContainer, oldContainer.dom.parentNode!, oldContainer.dom.nextSibling);
      container = newContainer;
    }
  }

  return {
    render,
    mount: mount_list,
    update,
    getItems: () => [...items],
    getContainer: () => container
  };
}

// Reactive keyed list that automatically updates when data changes
export function reactiveKeyedList<T>(
  dataSignal: ReactiveSignal<T[]>,
  containerTag: keyof HTMLElementTagNameMap = 'div',
  itemRenderer: (item: T, index: number) => VNode,
  options: KeyedListOptions<T> = {}
): VNode {
  const keyedList = createKeyedList(containerTag, itemRenderer, options);
  
  // Initial render
  let container = keyedList.render(dataSignal());
  
  // Set up reactive effect
  createEffect(() => {
    const newData = dataSignal();
    keyedList.update(newData);
  });
  
  return container;
}
