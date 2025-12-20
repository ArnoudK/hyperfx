import { createEffect } from "../reactive/state";
import { isSignal, createSignal } from "../reactive/signal";
export function For(props) {
    // Use a fragment with comment markers for tracking position
    const fragment = document.createDocumentFragment();
    const startMarker = document.createComment('For start');
    const endMarker = document.createComment('For end');
    fragment.appendChild(startMarker);
    fragment.appendChild(endMarker);
    // Children should be the render function
    const renderItem = Array.isArray(props.children) ? props.children[0]
        : props.children;
    if (typeof renderItem !== 'function') {
        if (typeof renderItem === 'object') {
            console.error('Received object:', renderItem);
        }
        throw new Error(`For component children must be a function that renders each item.\nExpected (item, index) => JSXElement. Got ${typeof renderItem}`);
    }
    const instanceMap = new Map();
    const updateList = () => {
        // Handle different types of reactive values
        let newItems;
        if (Array.isArray(props.each)) {
            newItems = props.each;
        }
        else if (isSignal(props.each)) {
            newItems = props.each();
        }
        else if (typeof props.each === 'function') {
            newItems = props.each();
        }
        else {
            newItems = props.each;
        }
        // Ensure newItems is an array
        // Ensure newItems is an array
        if (!Array.isArray(newItems)) {
            newItems = [];
        }
        const parent = startMarker.parentNode || fragment;
        // 1. Allocation Phase
        // Assign instances to new items (reusing old ones where possible)
        const newInstances = [];
        const availableInstances = new Map();
        // Clone currently active instances to available map
        instanceMap.forEach((instances, item) => {
            availableInstances.set(item, [...instances]);
        });
        // Allocate
        newItems.forEach((item, index) => {
            let instance;
            // Cast item to T to satisfy Map.get if item is inferred as T | undefined
            const stack = availableInstances.get(item);
            if (stack && stack.length > 0) {
                // Reuse existing
                instance = stack.shift();
                // Update index signal
                instance.indexSignal(index);
            }
            else {
                // Create new
                const indexSignal = createSignal(index);
                const element = renderItem(item, indexSignal);
                let nodes = [];
                if (element instanceof DocumentFragment) {
                    nodes = Array.from(element.childNodes);
                }
                else if (element) {
                    nodes = [element];
                }
                instance = { nodes, indexSignal };
            }
            newInstances.push(instance);
        });
        // 2. Cleanup Phase
        // Remove nodes for instances that weren't reused
        availableInstances.forEach((stack) => {
            stack.forEach(instance => {
                instance.nodes.forEach(node => {
                    if (node.parentNode === parent) {
                        parent.removeChild(node);
                    }
                });
            });
        });
        // 3. Insertion/Reordering Phase
        // Sync DOM with new order
        // We use a marker cursor strategy
        let cursor = startMarker.nextSibling;
        newInstances.forEach(instance => {
            const nodes = instance.nodes;
            if (nodes.length === 0)
                return;
            // Check if the first node is at the cursor
            const firstNode = nodes[0];
            if (firstNode === cursor) {
                // Already in place, advance cursor past these nodes
                // (Assuming nodes are contiguous and in order, which strict DOM manipulation maintains)
                let lastNode = nodes[nodes.length - 1];
                cursor = lastNode.nextSibling;
            }
            else {
                // Not in place (or new), insert before cursor
                // Note: insertBefore moves the node if it's already elsewhere in DOM
                nodes.forEach(node => {
                    parent.insertBefore(node, cursor); // cursor can be null (end) or endMarker
                });
                // Cursor stays waiting for the *next* item, 
                // because we just inserted *before* it. 
                // Wait: if we inserted, the inserted nodes are now *before* the cursor.
                // The cursor still points to the node that was effectively "pushed right".
                // So we don't update cursor. We move on to the next instance, 
                // which will be checked against the SAME cursor.
            }
        });
        // Update instance map for next render
        instanceMap.clear();
        newInstances.forEach((instance, i) => {
            const item = newItems[i];
            const stack = instanceMap.get(item) || [];
            stack.push(instance);
            instanceMap.set(item, stack);
        });
    };
    // Set up reactive effect based on the type
    if (typeof props.each === 'function') {
        createEffect(updateList);
    }
    else {
        updateList();
    }
    return fragment;
}
export function Index(props) {
    const fragment = document.createDocumentFragment();
    const startMarker = document.createComment('Index start');
    const endMarker = document.createComment('Index end');
    fragment.appendChild(startMarker);
    fragment.appendChild(endMarker);
    const itemElements = [];
    let currentLength = 0;
    const updateList = () => {
        // Handle different types of reactive values
        let newItems;
        if (Array.isArray(props.each)) {
            newItems = props.each;
        }
        else if (isSignal(props.each)) {
            newItems = props.each();
        }
        else if (typeof props.each === 'function') {
            newItems = props.each();
        }
        else {
            // Should not happen with proper typing
            newItems = props.each;
        }
        const newLength = newItems.length;
        const parent = startMarker.parentNode;
        const currentParent = parent || fragment;
        // Handle length changes
        if (newLength < currentLength) {
            // Remove excess elements
            for (let i = newLength; i < currentLength; i++) {
                const element = itemElements[i];
                if (element && element.parentNode === currentParent) {
                    currentParent.removeChild(element);
                }
            }
            itemElements.splice(newLength);
        }
        else if (newLength > currentLength) {
            // Add new elements
            for (let i = currentLength; i < newLength; i++) {
                const item = newItems[i];
                if (item !== undefined) {
                    const element = props.children(() => item, i);
                    itemElements.push(element);
                    currentParent.insertBefore(element, endMarker);
                }
            }
        }
        currentLength = newLength;
    };
    // Set up reactive effect based on the type
    if (isSignal(props.each)) {
        // For Signals, set up reactive effect
        createEffect(updateList);
    }
    else {
        // For static arrays or computed functions, just render once
        updateList();
    }
    return fragment;
}
export function Show(props) {
    const fragment = document.createDocumentFragment();
    const startMarker = document.createComment('Show start');
    const endMarker = document.createComment('Show end');
    fragment.appendChild(startMarker);
    fragment.appendChild(endMarker);
    let renderedNodes = [];
    const updateVisibility = () => {
        const shouldShow = typeof props.when === 'function' ? props.when() : props.when;
        // Get parent for dynamic updates
        const parent = startMarker.parentNode;
        // Determine what should be shown
        let newContent = null;
        if (shouldShow) {
            newContent = typeof props.children === 'function' ? props.children() : props.children;
        }
        else if (props.fallback) {
            newContent = typeof props.fallback === 'function' ? props.fallback() : props.fallback;
        }
        const currentParent = parent || fragment;
        // Remove old nodes
        renderedNodes.forEach(node => {
            if (node.parentNode === currentParent) {
                currentParent.removeChild(node);
            }
        });
        renderedNodes = [];
        // Add new nodes
        if (newContent) {
            const nodesToAdd = Array.isArray(newContent) ? newContent : [newContent];
            nodesToAdd.forEach(node => {
                currentParent.insertBefore(node, endMarker);
                renderedNodes.push(node);
            });
        }
    };
    createEffect(updateVisibility);
    return fragment;
}
export function Switch(props) {
    const fragment = document.createDocumentFragment();
    const startMarker = document.createComment('Switch start');
    const endMarker = document.createComment('Switch end');
    fragment.appendChild(startMarker);
    fragment.appendChild(endMarker);
    let renderedNodes = [];
    const updateSwitch = () => {
        const parent = startMarker.parentNode;
        const currentParent = parent || fragment;
        // Find first matching child
        let matchResult = null;
        if (Array.isArray(props.children)) {
            // In a full implementation, we'd need Match components to be reactive
            // and we'd need to evaluate them here.
            // For now, we assume props.children contains Match elements or similar.
            // However, if they are already rendered, we might have issues.
            // Let's assume for now they are static or the component is re-evaluated.
            for (const child of props.children) {
                // This is a simplified implementation check
                if (child instanceof Comment && child.nodeValue === 'Match condition false') {
                    continue;
                }
                matchResult = child;
                break;
            }
        }
        else {
            matchResult = props.children;
        }
        if (!matchResult && props.fallback) {
            matchResult = props.fallback;
        }
        // Remove old nodes
        renderedNodes.forEach(node => {
            if (node.parentNode === currentParent) {
                currentParent.removeChild(node);
            }
        });
        renderedNodes = [];
        // Add new nodes
        if (matchResult) {
            const nodesToAdd = Array.isArray(matchResult) ? matchResult : [matchResult];
            nodesToAdd.forEach(node => {
                currentParent.insertBefore(node, endMarker);
                renderedNodes.push(node);
            });
        }
    };
    // Switch should ideally react to changes in its Match children's conditions.
    // This requires a more complex implementation where Switch tracks Match signals.
    // For now, we'll just run it once or rely on parent re-rendering.
    // Given hyperfx's current architecture, let's just make it run.
    updateSwitch();
    return fragment;
}
export function Match(props) {
    const shouldRender = typeof props.when === 'function' ? props.when() : props.when;
    if (shouldRender) {
        const result = typeof props.children === 'function' ? props.children() : props.children;
        if (Array.isArray(result)) {
            const fragment = document.createDocumentFragment();
            result.forEach((child) => {
                fragment.appendChild(child);
            });
            return fragment;
        }
        return result;
    }
    // Return empty comment when condition is false
    return document.createComment('Match condition false');
}
//# sourceMappingURL=control-flow.js.map