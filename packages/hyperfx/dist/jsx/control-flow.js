import { createEffect } from "../reactive/state";
import { isSignal, createSignal } from "../reactive/signal";
export function For(props) {
    const fragment = document.createDocumentFragment();
    const startMarker = document.createComment('For start');
    const endMarker = document.createComment('For end');
    fragment.appendChild(startMarker);
    fragment.appendChild(endMarker);
    const renderItem = Array.isArray(props.children) ? props.children[0] : props.children;
    if (typeof renderItem !== 'function') {
        throw new Error(`For component children must be a function.`);
    }
    const instanceMap = new Map();
    // We keep track of the current order of instances to manage the DOM
    let currentInstances = [];
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
        const parent = startMarker.parentNode || fragment;
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
                if (element instanceof DocumentFragment) {
                    nodes = Array.from(element.childNodes);
                }
                else if (element instanceof Node) {
                    nodes = [element];
                }
                nextInstances.push({ nodes, indexSignal: indexSignal });
            }
        });
        // 2. Cleanup Phase: Remove nodes that are no longer in the list
        availableInstances.forEach((stack) => {
            stack.forEach(instance => {
                instance.nodes.forEach(node => node.parentElement?.removeChild(node));
            });
        });
        // 3. DOM Sync Phase: Adjust positions
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
        // Update instanceMap for the next run
        instanceMap.clear();
        nextInstances.forEach((instance, i) => {
            const item = newItems[i];
            const stack = instanceMap.get(item) || [];
            stack.push(instance);
            instanceMap.set(item, stack);
        });
        currentInstances = nextInstances;
    };
    createEffect(updateList);
    return fragment;
}
export function Index(props) {
    const fragment = document.createDocumentFragment();
    const startMarker = document.createComment('Index start');
    const endMarker = document.createComment('Index end');
    fragment.appendChild(startMarker);
    fragment.appendChild(endMarker);
    // We store signals for each index so we can update values without re-rendering the whole row
    const itemSignals = [];
    const renderedNodes = [];
    createEffect(() => {
        const newItems = isSignal(props.each) ? props.each() : (typeof props.each === 'function' ? props.each() : props.each);
        const parent = startMarker.parentNode || fragment;
        // Grow list
        while (itemSignals.length < newItems.length) {
            const index = itemSignals.length;
            const signal = createSignal(newItems[index]);
            itemSignals.push(signal);
            const element = props.children(() => signal(), index);
            const nodes = element instanceof DocumentFragment ? Array.from(element.childNodes) : [element];
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
            if (itemSignals[i]() !== newItems[i]) {
                itemSignals[i](newItems[i]);
            }
        }
    });
    return fragment;
}
export function Show(props) {
    const fragment = document.createDocumentFragment();
    const startMarker = document.createComment('Show start');
    const endMarker = document.createComment('Show end');
    fragment.appendChild(startMarker);
    fragment.appendChild(endMarker);
    let currentNodes = [];
    createEffect(() => {
        const condition = typeof props.when === 'function' ? props.when() : (isSignal(props.when) ? props.when() : props.when);
        const parent = startMarker.parentNode || fragment;
        // Cleanup old nodes
        currentNodes.forEach(n => n.parentElement?.removeChild(n));
        currentNodes = [];
        const content = condition ? props.children : props.fallback;
        if (content) {
            const result = typeof content === 'function' ? content() : content;
            const nodes = result instanceof DocumentFragment ? Array.from(result.childNodes) : [result];
            nodes.forEach(n => parent.insertBefore(n, endMarker));
            currentNodes = nodes;
        }
    });
    return fragment;
}
//# sourceMappingURL=control-flow.js.map