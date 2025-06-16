import { mount, VNode, patch } from "./elem";
import { ReactiveSignal, createSignal, createEffect } from "../reactive/state";
import { reactiveKeyedList } from "./keyed-list";

// Conditional rendering helpers
export function If(
    condition: ReactiveSignal<boolean> | boolean,
    thenVNode: VNode | (() => VNode),
    elseVNode?: VNode | (() => VNode)
): VNode {
    const isReactive = typeof condition === 'function';

    if (!isReactive) {
        // Static condition
        const result = condition ? thenVNode : elseVNode;
        return typeof result === 'function' ? result() : result || { tag: 'span', props: { style: 'display: none' }, children: [] };
    }

    // Reactive condition
    const conditionSignal = condition as ReactiveSignal<boolean>;

    // Create a container that will hold the conditional content
    const container: VNode = {
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
            } else if (elseVNode) {
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
export function Show(
    condition: ReactiveSignal<boolean> | boolean,
    children: VNode | (() => VNode)
): VNode {
    return If(condition, children, { tag: 'span', props: { style: 'display: none' }, children: [] });
}

export interface SwitchCase<T> {
    when: T | ((value: T) => boolean);
    then: VNode | (() => VNode);
}

export function Switch<T>(
    value: ReactiveSignal<T> | T,
    cases: SwitchCase<T>[],
    defaultCase?: VNode | (() => VNode)
): VNode {
    const isReactive = typeof value === 'function';

    if (!isReactive) {
        // Static switch
        const staticValue = value as T;
        const matchedCase = cases.find(c => {
            if (typeof c.when === 'function') {
                const whenFn = c.when as (value: T) => boolean;
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
    const valueSignal = value as ReactiveSignal<T>;

    const container: VNode = {
        tag: 'span',
        props: {},
        children: []
    };

    createEffect(() => {
        const currentValue = valueSignal();
        const matchedCase = cases.find(c => {
            if (typeof c.when === 'function') {
                const whenFn = c.when as (value: T) => boolean;
                return whenFn(currentValue);
            }
            return c.when === currentValue;
        });

        let content: VNode;
        if (matchedCase) {
            content = typeof matchedCase.then === 'function' ? matchedCase.then() : matchedCase.then;
        } else if (defaultCase) {
            content = typeof defaultCase === 'function' ? defaultCase() : defaultCase;
        } else {
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
export function For<T>(
    items: ReactiveSignal<T[]> | T[],
    renderItem: (item: T, index: number) => VNode,
    keyFn?: (item: T, index: number) => string | number
): VNode {
    const isReactive = typeof items === 'function';

    if (!isReactive) {
        // Static array
        const staticItems = items as T[];
        return {
            tag: 'div',
            props: {},
            children: staticItems.map((item, index) => renderItem(item, index))
        };
    }

    // For reactive arrays, create a container that uses fine-grained updates
    const container: VNode = {
        tag: 'div',
        props: {},
        children: []
    };

    let previousVNodes: VNode[] = [];

    createEffect(() => {
        const newItems = (items as ReactiveSignal<T[]>)();
        
        // Create new VNodes for the current items
        const newVNodes: VNode[] = newItems.map((item, index) => renderItem(item, index));

        // Use the framework's patch system for fine-grained updates
        if (container.dom) {
            // Patch each child individually using the framework's patch system
            const parentElement = container.dom as HTMLElement;
            const maxLength = Math.max(previousVNodes.length, newVNodes.length);
            
            for (let i = 0; i < maxLength; i++) {
                const oldVNode = i < previousVNodes.length ? previousVNodes[i] : null;
                const newVNode = i < newVNodes.length ? newVNodes[i] : null;
                
                if (oldVNode && newVNode) {
                    // Patch existing node - this is fine-grained!
                    patch(oldVNode, newVNode, parentElement);
                } else if (newVNode) {
                    // Mount new node
                    mount(newVNode, parentElement);
                } else if (oldVNode) {
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
export function Portal(
    children: VNode | VNode[],
    target: HTMLElement | string
): VNode {
    const portalContainer: VNode = {
        tag: 'span',
        props: { style: 'display: none' },
        children: []
    };

    // Mount children to the target element instead of the normal tree
    createEffect(() => {
        const targetElement = typeof target === 'string' ?
            document.querySelector(target) as HTMLElement :
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
export function Lazy(
    loader: () => Promise<VNode>,
    fallback?: VNode
): VNode {
    const loadedSignal = createSignal<VNode | null>(null);
    const loadingSignal = createSignal(true);

    // Start loading
    loader().then(result => {
        loadedSignal(result);
        loadingSignal(false);
    }).catch(error => {
        console.error('Lazy component failed to load:', error);
        loadingSignal(false);
    });

    return If(
        loadingSignal,
        fallback || { tag: 'div', props: {}, children: ['Loading...'] },
        () => loadedSignal() || { tag: 'div', props: {}, children: ['Failed to load'] }
    );
}

// Error boundary
export function ErrorBoundary(
    children: VNode | VNode[],
    fallback: (error: Error) => VNode
): VNode {
    const errorSignal = createSignal<Error | null>(null);

    const container: VNode = {
        tag: 'div',
        props: {},
        children: Array.isArray(children) ? children : [children]
    };

    // Wrap in try-catch during mounting
    const originalMount = container.children;

    try {
        return If(
            () => errorSignal() !== null,
            () => fallback(errorSignal()!),
            container
        );
    } catch (error) {
        errorSignal(error as Error);
        return fallback(error as Error);
    }
}
