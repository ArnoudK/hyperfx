import { createEffect } from "../reactive/state";
import { isSignal, createSignal } from "../reactive/signal";
import { isSSR, createUniversalFragment, createUniversalComment, } from "./runtime/universal-node";
export function For(props) {
    const fragment = createUniversalFragment();
    const startMarker = createUniversalComment('For start');
    const endMarker = createUniversalComment('For end');
    fragment.appendChild(startMarker);
    fragment.appendChild(endMarker);
    const renderItem = Array.isArray(props.children) ? props.children[0] : props.children;
    if (typeof renderItem !== 'function') {
        throw new Error(`For component children must be a function.`);
    }
    const instanceMap = new Map();
    const updateList = () => {
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
        const parent = isSSR() ? fragment : (startMarker.parentNode || fragment);
        const nextInstances = [];
        const availableInstances = new Map();
        instanceMap.forEach((instances, item) => {
            availableInstances.set(item, [...instances]);
        });
        newItems.forEach((item, index) => {
            const stack = availableInstances.get(item);
            if (stack && stack.length > 0) {
                const instance = stack.shift();
                instance.indexSignal(index);
                nextInstances.push(instance);
            }
            else {
                const indexSignal = createSignal(index);
                const element = renderItem(item, indexSignal);
                let nodes = [];
                if (isSSR()) {
                    nodes = [element];
                }
                else {
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
        availableInstances.forEach((stack) => {
            stack.forEach(instance => {
                if (!isSSR()) {
                    instance.nodes.forEach(node => node.parentElement?.removeChild(node));
                }
            });
        });
        if (isSSR()) {
            const children = parent.childNodes || [];
            const startIndex = children.indexOf(startMarker);
            const endIndex = children.indexOf(endMarker);
            if (startIndex >= 0 && endIndex > startIndex) {
                const toRemove = children.slice(startIndex + 1, endIndex);
                toRemove.forEach((n) => parent.removeChild(n));
            }
            const allNodes = nextInstances.flatMap(inst => inst.nodes);
            allNodes.forEach(node => parent.insertBefore(node, endMarker));
        }
        else {
            let cursor = endMarker;
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
        instanceMap.clear();
        nextInstances.forEach((instance, i) => {
            const item = newItems[i];
            const stack = instanceMap.get(item) || [];
            stack.push(instance);
            instanceMap.set(item, stack);
        });
    };
    if (isSSR()) {
        updateList();
    }
    else {
        createEffect(updateList);
    }
    return fragment;
}
export function Index(props) {
    const fragment = createUniversalFragment();
    const startMarker = createUniversalComment('Index start');
    const endMarker = createUniversalComment('Index end');
    fragment.appendChild(startMarker);
    fragment.appendChild(endMarker);
    const itemSignals = [];
    const renderedNodes = [];
    const update = () => {
        const newItems = isSignal(props.each) ? props.each() : (typeof props.each === 'function' ? props.each() : props.each);
        const parent = isSSR() ? fragment : (startMarker.parentNode || fragment);
        while (itemSignals.length < newItems.length) {
            const index = itemSignals.length;
            const signal = createSignal(newItems[index]);
            itemSignals.push(signal);
            const element = props.children(() => signal(), index);
            if (isSSR()) {
                const nodes = [element];
                renderedNodes.push(nodes);
                nodes.forEach(n => parent.insertBefore(n, endMarker));
            }
            else {
                const nodes = element instanceof DocumentFragment ? Array.from(element.childNodes) : [element];
                renderedNodes.push(nodes);
                nodes.forEach(n => parent.insertBefore(n, endMarker));
            }
        }
        while (itemSignals.length > newItems.length) {
            itemSignals.pop();
            const nodes = renderedNodes.pop();
            if (!isSSR()) {
                nodes?.forEach(n => n.parentElement?.removeChild(n));
            }
        }
        for (let i = 0; i < newItems.length; i++) {
            if (itemSignals[i]() !== newItems[i]) {
                itemSignals[i](newItems[i]);
            }
        }
    };
    if (isSSR()) {
        update();
    }
    else {
        createEffect(update);
    }
    return fragment;
}
export function Show(props) {
    const fragment = createUniversalFragment();
    const startMarker = createUniversalComment('Show start');
    const endMarker = createUniversalComment('Show end');
    fragment.appendChild(startMarker);
    fragment.appendChild(endMarker);
    let currentNodes = [];
    const update = () => {
        const when = typeof props.when === 'function' ? props.when() : (isSignal(props.when) ? props.when() : props.when);
        const condition = !!when;
        const data = when;
        const parent = isSSR() ? fragment : (startMarker.parentNode || fragment);
        if (!isSSR()) {
            currentNodes.forEach(n => n.parentElement?.removeChild(n));
        }
        currentNodes = [];
        const content = condition ? props.children : props.fallback;
        if (content) {
            const result = typeof content === 'function' ? content(data) : content;
            if (isSSR()) {
                const nodes = [result];
                nodes.forEach(n => parent.insertBefore(n, endMarker));
                currentNodes = nodes;
            }
            else {
                const nodes = result instanceof DocumentFragment ? Array.from(result.childNodes) : [result];
                nodes.forEach(n => parent.insertBefore(n, endMarker));
                currentNodes = nodes;
            }
        }
    };
    if (isSSR()) {
        update();
    }
    else {
        createEffect(update);
    }
    return fragment;
}
export function ErrorBoundary(props) {
    const fragment = createUniversalFragment();
    const errorSignal = createSignal(null);
    const marker = createUniversalComment('ErrorBoundary');
    fragment.appendChild(marker);
    try {
        if (isSSR()) {
            fragment.appendChild(props.children);
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
    if (!isSSR()) {
        createEffect(() => {
            const error = errorSignal();
            const parent = marker.parentNode || fragment;
            let node = marker.nextSibling;
            while (node) {
                const next = node?.nextSibling || null;
                parent.removeChild(node);
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
//# sourceMappingURL=control-flow.jsx.map