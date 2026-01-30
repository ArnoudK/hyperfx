import { createEffect } from "../reactive/state";
import { isSignal, createSignal } from "../reactive/signal";
import { isSSR, createRouterFragment, createRouterComment } from "../pages/router-helpers";
export function For(props) {
    const fragment = createRouterFragment();
    const startMarker = createRouterComment('For start');
    const endMarker = createRouterComment('For end');
    // Append markers to fragment
    if (isSSR()) {
        const virtualFragment = fragment;
        virtualFragment.children.push(startMarker, endMarker);
    }
    else {
        fragment.appendChild(startMarker);
        fragment.appendChild(endMarker);
    }
    const renderItem = Array.isArray(props.children) ? props.children[0] : props.children;
    if (typeof renderItem !== 'function') {
        throw new Error(`For component children must be a function.`);
    }
    const instanceMap = new Map();
    // We keep track of the current order of instances to manage the DOM
    let _currentInstances = [];
    const updateList = () => {
        // Resolve the reactive value
        let newItems = [];
        if (isSignal(props.each)) {
            newItems = props.each();
        }
        else if (typeof props.each === 'function') {
            newItems = props.each();
        }
        else {
            newItems = props.each;
        }
        if (!Array.isArray(newItems))
            newItems = [];
        // Important: Use startMarker.parentNode. If null (not mounted yet), use the fragment.
        const parent = isSSR() ? fragment : (startMarker.parentNode || fragment);
        const nextInstances = [];
        const availableInstances = new Map();
        // Collect existing instances for reuse
        instanceMap.forEach((instances, item) => {
            availableInstances.set(item, [...instances]);
        });
        // 1. Reconciliation/Allocation Phase
        newItems.forEach((item, index) => {
            const stack = availableInstances.get(item);
            if (stack && stack.length > 0) {
                const instance = stack.shift();
                instance.indexSignal(index); // Update the index signal for the reused item
                nextInstances.push(instance);
            }
            else {
                const indexSignal = createSignal(index);
                const element = renderItem(item, indexSignal);
                let nodes = [];
                if (isSSR()) {
                    // On server, treat elements as virtual nodes stored in array
                    nodes = [element];
                }
                else {
                    // Client: handle DOM nodes
                    if (element instanceof DocumentFragment) {
                        nodes = Array.from(element.childNodes);
                    }
                    else if (element instanceof Node) {
                        nodes = [element];
                    }
                }
                nextInstances.push({ nodes, indexSignal: indexSignal });
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
            const virtualParent = parent;
            const endIndex = virtualParent.children.indexOf(endMarker);
            // Clear existing items between markers
            if (endIndex > 0) {
                const startIndex = virtualParent.children.indexOf(startMarker);
                if (startIndex >= 0 && startIndex < endIndex) {
                    virtualParent.children.splice(startIndex + 1, endIndex - startIndex - 1);
                }
            }
            // Insert all nodes
            const insertIndex = virtualParent.children.indexOf(endMarker);
            const allNodes = nextInstances.flatMap(inst => inst.nodes);
            virtualParent.children.splice(insertIndex, 0, ...allNodes);
        }
        else {
            // Client: adjust DOM positions
            let cursor = endMarker;
            // We iterate backwards to use insertBefore(node, cursor) effectively
            for (let i = nextInstances.length - 1; i >= 0; i--) {
                const instance = nextInstances[i];
                if (!instance)
                    continue;
                const nodes = instance.nodes;
                for (let j = nodes.length - 1; j >= 0; j--) {
                    const node = nodes[j];
                    if (node.nextSibling !== cursor) {
                        parent.insertBefore(node, cursor);
                    }
                    cursor = node;
                }
            }
        }
        // Update instanceMap for the next run
        instanceMap.clear();
        nextInstances.forEach((instance, i) => {
            const item = newItems[i];
            const stack = instanceMap.get(item) || [];
            stack.push(instance);
            instanceMap.set(item, stack);
        });
        _currentInstances = nextInstances;
    };
    // SSR: render once, synchronously
    if (isSSR()) {
        updateList();
    }
    else {
        // Client: reactive rendering
        createEffect(updateList);
    }
    return fragment;
}
export function Index(props) {
    const fragment = createRouterFragment();
    const startMarker = createRouterComment('Index start');
    const endMarker = createRouterComment('Index end');
    if (isSSR()) {
        const virtualFragment = fragment;
        virtualFragment.children.push(startMarker, endMarker);
    }
    else {
        fragment.appendChild(startMarker);
        fragment.appendChild(endMarker);
    }
    // We store signals for each index so we can update values without re-rendering the whole row
    const itemSignals = [];
    const renderedNodes = [];
    const update = () => {
        const newItems = isSignal(props.each) ? props.each() : (typeof props.each === 'function' ? props.each() : props.each);
        const parent = isSSR() ? fragment : (startMarker.parentNode || fragment);
        // Grow list
        while (itemSignals.length < newItems.length) {
            const index = itemSignals.length;
            const signal = createSignal(newItems[index]);
            itemSignals.push(signal);
            const element = props.children(() => signal(), index);
            if (isSSR()) {
                const nodes = [element];
                renderedNodes.push(nodes);
                const virtualParent = parent;
                const insertIndex = virtualParent.children.indexOf(endMarker);
                virtualParent.children.splice(insertIndex, 0, ...nodes);
            }
            else {
                const nodes = element instanceof DocumentFragment ? Array.from(element.childNodes) : [element];
                renderedNodes.push(nodes);
                nodes.forEach(n => parent.insertBefore(n, endMarker));
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
            if (itemSignals[i]() !== newItems[i]) {
                itemSignals[i](newItems[i]);
            }
        }
    };
    // SSR: render once, synchronously
    if (isSSR()) {
        update();
    }
    else {
        // Client: reactive rendering
        createEffect(update);
    }
    return fragment;
}
export function Show(props) {
    const fragment = createRouterFragment();
    const startMarker = createRouterComment('Show start');
    const endMarker = createRouterComment('Show end');
    if (isSSR()) {
        const virtualFragment = fragment;
        virtualFragment.children.push(startMarker, endMarker);
    }
    else {
        fragment.appendChild(startMarker);
        fragment.appendChild(endMarker);
    }
    let currentNodes = [];
    const update = () => {
        // Resolve the when prop
        const when = typeof props.when === 'function' ? props.when() : (isSignal(props.when) ? props.when() : props.when);
        const condition = !!when;
        const data = when;
        const parent = isSSR() ? fragment : (startMarker.parentNode || fragment);
        // Cleanup old nodes
        if (!isSSR()) {
            currentNodes.forEach(n => n.parentElement?.removeChild(n));
        }
        currentNodes = [];
        const content = condition ? props.children : props.fallback;
        if (content) {
            const result = typeof content === 'function' ? content(data) : content;
            if (isSSR()) {
                const nodes = [result];
                const virtualParent = parent;
                const insertIndex = virtualParent.children.indexOf(endMarker);
                virtualParent.children.splice(insertIndex, 0, ...nodes);
                currentNodes = nodes;
            }
            else {
                const nodes = result instanceof DocumentFragment ? Array.from(result.childNodes) : [result];
                nodes.forEach(n => parent.insertBefore(n, endMarker));
                currentNodes = nodes;
            }
        }
    };
    // SSR: render once, synchronously
    if (isSSR()) {
        update();
    }
    else {
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
export function ErrorBoundary(props) {
    const fragment = createRouterFragment();
    const errorSignal = createSignal(null);
    const marker = createRouterComment('ErrorBoundary');
    if (isSSR()) {
        const virtualFragment = fragment;
        virtualFragment.children.push(marker);
    }
    else {
        fragment.appendChild(marker);
    }
    // Try to render children
    try {
        if (isSSR()) {
            const virtualFragment = fragment;
            virtualFragment.children.push(props.children);
        }
        else if (props.children instanceof Node) {
            fragment.appendChild(props.children);
        }
    }
    catch (error) {
        errorSignal(error);
        if (props.onError) {
            props.onError(error);
        }
    }
    // Create effect to handle error state changes (client only)
    if (!isSSR()) {
        createEffect(() => {
            const error = errorSignal();
            const parent = marker.parentNode || fragment;
            // Remove all nodes after marker
            let node = marker.nextSibling;
            while (node) {
                const next = node?.nextSibling || null;
                if (node) {
                    parent.removeChild(node);
                }
                node = next;
            }
            if (error) {
                const fallback = props.fallback(error);
                if (fallback instanceof Node) {
                    parent.appendChild(fallback);
                }
            }
            else {
                if (props.children instanceof Node) {
                    parent.appendChild(props.children);
                }
            }
        });
    }
    return fragment;
}
//# sourceMappingURL=control-flow.js.map