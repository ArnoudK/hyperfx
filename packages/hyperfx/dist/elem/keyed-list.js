import { mount, unmount, patch } from "./elem";
import { createEffect } from "../reactive/state";
export function createKeyedList(containerTag = 'div', itemRenderer, options = {}) {
    const items = [];
    let container = null;
    let mounted = false;
    const trackBy = options.trackBy || ((_, index) => index);
    function getKey(item, index) {
        const key = trackBy(item, index);
        return typeof key === 'string' || typeof key === 'number' ? key : index;
    }
    function findItemByKey(key) {
        return items.find(item => item.key === key);
    }
    function render(newData) {
        if (!container) {
            container = {
                tag: containerTag,
                props: {},
                children: [],
                key: 'keyed-list-container'
            };
        }
        // Create a map of new items by key
        const newItemsMap = new Map();
        const newKeys = [];
        newData.forEach((item, index) => {
            const key = getKey(item, index);
            newItemsMap.set(key, item);
            newKeys.push(key);
        });
        // Track items to remove, add, and reorder
        const itemsToRemove = [];
        const itemsToAdd = [];
        const finalItems = [];
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
            }
            else {
                // Create new item
                const newKeyedItem = {
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
        container.children = finalItems.map(item => item.vnode);
        return container;
    }
    function mount_list(parentElement) {
        if (!container) {
            throw new Error("Must call render() before mounting");
        }
        mounted = true;
        const domNode = mount(container, parentElement);
        // Store DOM references for efficient updates
        items.forEach((item, index) => {
            if (container.dom instanceof HTMLElement) {
                item.domNode = container.dom.childNodes[index];
            }
        });
        return domNode;
    }
    function update(newData) {
        if (!mounted || !container?.dom) {
            render(newData);
            return;
        }
        const oldContainer = container;
        const newContainer = render(newData);
        if (oldContainer.dom) {
            patch(oldContainer, newContainer, oldContainer.dom.parentNode, oldContainer.dom.nextSibling);
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
export function reactiveKeyedList(dataSignal, containerTag = 'div', itemRenderer, options = {}) {
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
//# sourceMappingURL=keyed-list.js.map