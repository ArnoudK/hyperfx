import { mount, patch } from "./elem";
import { createSignal, createEffect } from "../reactive/state";
// Conditional rendering helpers
export function If(condition, thenVNode, elseVNode) {
    const isReactive = typeof condition === 'function';
    if (!isReactive) {
        // Static condition
        const result = condition ? thenVNode : elseVNode;
        return typeof result === 'function' ? result() : result || { tag: 'span', props: { style: 'display: none' }, children: [] };
    }
    // Reactive condition
    const conditionSignal = condition;
    // Create a container that will hold the conditional content
    const container = {
        tag: 'span',
        props: {},
        children: [],
        reactiveProps: {}
    };
    // Set up effect to update content when condition changes
    createEffect(() => {
        const shouldShow = conditionSignal();
        if (container.dom) {
            // Always clear existing content first
            while (container.dom.firstChild) {
                container.dom.removeChild(container.dom.firstChild);
            }
            if (shouldShow) {
                // Show content
                const content = thenVNode;
                const newVNode = typeof content === 'function' ? content() : content;
                if (newVNode && !(newVNode.tag === 'span' && newVNode.props?.style === 'display: none')) {
                    mount(newVNode, container.dom);
                }
            }
            else if (elseVNode) {
                // Show else content
                const content = elseVNode;
                const newVNode = typeof content === 'function' ? content() : content;
                if (newVNode && !(newVNode.tag === 'span' && newVNode.props?.style === 'display: none')) {
                    mount(newVNode, container.dom);
                }
            }
            // If shouldShow is false and no elseVNode, container stays empty
        }
    });
    return container;
}
// Show/Hide based on condition
export function Show(condition, children) {
    return If(condition, children, { tag: 'span', props: { style: 'display: none' }, children: [] });
}
export function Switch(value, cases, defaultCase) {
    const isReactive = typeof value === 'function';
    if (!isReactive) {
        // Static switch
        const staticValue = value;
        const matchedCase = cases.find(c => {
            if (typeof c.when === 'function') {
                const whenFn = c.when;
                return whenFn(staticValue);
            }
            return c.when === staticValue;
        });
        if (matchedCase) {
            return typeof matchedCase.then === 'function' ? matchedCase.then() : matchedCase.then;
        }
        return defaultCase ? (typeof defaultCase === 'function' ? defaultCase() : defaultCase) :
            { tag: 'span', props: { style: 'display: none' }, children: [] };
    }
    // Reactive switch
    const valueSignal = value;
    const container = {
        tag: 'span',
        props: {},
        children: []
    };
    createEffect(() => {
        const currentValue = valueSignal();
        const matchedCase = cases.find(c => {
            if (typeof c.when === 'function') {
                const whenFn = c.when;
                return whenFn(currentValue);
            }
            return c.when === currentValue;
        });
        let content;
        if (matchedCase) {
            content = typeof matchedCase.then === 'function' ? matchedCase.then() : matchedCase.then;
        }
        else if (defaultCase) {
            content = typeof defaultCase === 'function' ? defaultCase() : defaultCase;
        }
        else {
            content = { tag: 'span', props: { style: 'display: none' }, children: [] };
        }
        if (container.dom) {
            // Replace content
            while (container.dom.firstChild) {
                container.dom.removeChild(container.dom.firstChild);
            }
            mount(content, container.dom);
        }
    });
    return container;
}
// For loop helper for reactive arrays with fine-grained updates
export function For(items, renderItem, keyFn) {
    const isReactive = typeof items === 'function';
    if (!isReactive) {
        // Static array
        const staticItems = items;
        return {
            tag: 'div',
            props: {},
            children: staticItems.map((item, index) => renderItem(item, index))
        };
    }
    // For reactive arrays, create a container that uses fine-grained updates
    const container = {
        tag: 'div',
        props: {},
        children: []
    };
    let previousVNodes = [];
    createEffect(() => {
        const newItems = items();
        // Create new VNodes for the current items
        const newVNodes = newItems.map((item, index) => renderItem(item, index));
        // Use the framework's patch system for fine-grained updates
        if (container.dom) {
            // Patch each child individually using the framework's patch system
            const parentElement = container.dom;
            const maxLength = Math.max(previousVNodes.length, newVNodes.length);
            for (let i = 0; i < maxLength; i++) {
                const oldVNode = i < previousVNodes.length ? previousVNodes[i] : null;
                const newVNode = i < newVNodes.length ? newVNodes[i] : null;
                if (oldVNode && newVNode) {
                    // Patch existing node - this is fine-grained!
                    patch(oldVNode, newVNode, parentElement);
                }
                else if (newVNode) {
                    // Mount new node
                    mount(newVNode, parentElement);
                }
                else if (oldVNode) {
                    // Remove old node
                    if (oldVNode.dom && oldVNode.dom.parentNode) {
                        oldVNode.dom.parentNode.removeChild(oldVNode.dom);
                    }
                }
            }
        }
        // Update container children and previous tracking
        container.children = newVNodes;
        previousVNodes = newVNodes;
    });
    return container;
}
// Portal - render content in a different part of the DOM
export function Portal(children, target) {
    const portalContainer = {
        tag: 'span',
        props: { style: 'display: none' },
        children: []
    };
    // Mount children to the target element instead of the normal tree
    createEffect(() => {
        const targetElement = typeof target === 'string' ?
            document.querySelector(target) :
            target;
        if (!targetElement) {
            console.warn(`Portal target not found:`, target);
            return;
        }
        const childrenArray = Array.isArray(children) ? children : [children];
        // Clear target and mount children
        targetElement.innerHTML = '';
        childrenArray.forEach(child => mount(child, targetElement));
    });
    return portalContainer;
}
// Lazy loading component
export function Lazy(loader, fallback) {
    const loadedSignal = createSignal(null);
    const loadingSignal = createSignal(true);
    // Start loading
    loader().then(result => {
        loadedSignal(result);
        loadingSignal(false);
    }).catch(error => {
        console.error('Lazy component failed to load:', error);
        loadingSignal(false);
    });
    return If(loadingSignal, fallback || { tag: 'div', props: {}, children: ['Loading...'] }, () => loadedSignal() || { tag: 'div', props: {}, children: ['Failed to load'] });
}
// Error boundary
export function ErrorBoundary(children, fallback) {
    const errorSignal = createSignal(null);
    const container = {
        tag: 'div',
        props: {},
        children: Array.isArray(children) ? children : [children]
    };
    // Wrap in try-catch during mounting
    const originalMount = container.children;
    try {
        return If(errorSignal() !== null, () => fallback(errorSignal()), container);
    }
    catch (error) {
        errorSignal(error);
        return fallback(error);
    }
}
//# sourceMappingURL=control-flow.js.map