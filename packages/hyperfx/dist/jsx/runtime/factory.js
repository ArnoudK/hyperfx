// Direct DOM JSX Factory - Performance Optimized
import { attributeManager } from "./attributes";
import { FRAGMENT_TAG } from "./constants";
import { isHydrationEnabled, claimHydrationElement } from "./hydration";
import { isSignal } from "../../reactive/signal";
import { renderChildren } from "./children";
/**
 * Client-side Fragment component
 */
export function Fragment(props) {
    const fragment = document.createDocumentFragment();
    if (props.children) {
        appendChildren(fragment, props.children);
    }
    return fragment;
}
/**
 * Create a DOM element with reactive attributes
 */
function createElement(tag, props) {
    let element = null;
    // Attempt to claim existing element if hydrating
    if (isHydrationEnabled()) {
        element = claimHydrationElement(tag);
        if (element) {
            // console.log(`[HyperFX] Claimed element: ${tag}`);
        }
    }
    // Fallback to creating a new element
    if (!element) {
        element = document.createElement(tag);
    }
    // Apply all attributes using the unified attribute manager
    // Note: For claimed elements, this will update reactive attributes and attach event handlers
    if (props) {
        attributeManager.applyAttributes(element, props);
    }
    return element;
}
/**
 * Append children to a parent element
 */
function appendChildren(parent, children) {
    if (children == null || children === false || children === true) {
        return;
    }
    if (Array.isArray(children)) {
        children.forEach(child => appendChildren(parent, child));
        return;
    }
    // Handle SSRNodes
    if (children && children.__ssr) {
        const div = document.createElement('div');
        div.innerHTML = children.t;
        while (div.firstChild) {
            parent.appendChild(div.firstChild);
        }
        return;
    }
    if (children instanceof Node) {
        // Only append if not already there (relevant for transition from claimed nodes)
        if (!parent.contains(children)) {
            parent.appendChild(children);
        }
    }
    else if (typeof children === 'function') {
        // Handle reactive children (signals)
        const textNode = document.createTextNode('');
        parent.appendChild(textNode);
        // Simple text-only reactivity for now
        if (isSignal(children)) {
            children.subscribe((val) => {
                textNode.textContent = String(val);
            });
            textNode.textContent = String(children());
        }
    }
    else {
        parent.appendChild(document.createTextNode(String(children)));
    }
}
/**
 * Client-side JSX factory function
 */
export function jsx(type, props, _key) {
    // Handle fragments
    if (type === FRAGMENT_TAG || type === Fragment) {
        const fragment = document.createDocumentFragment();
        if (props?.children) {
            appendChildren(fragment, props.children);
        }
        return fragment;
    }
    // Handle function components
    if (typeof type === 'function') {
        const proxyProps = new Proxy(props || {}, {
            get(target, prop, receiver) {
                const value = Reflect.get(target, prop, receiver);
                if (isSignal(value))
                    return value();
                return value;
            }
        });
        return type(proxyProps);
    }
    // Handle regular HTML elements
    const element = createElement(type, props);
    if (props?.children) {
        renderChildren(element, props.children);
    }
    return element;
}
export const jsxs = jsx;
export const jsxDEV = jsx;
export function createJSXElement(type, props, ...children) {
    const allProps = {
        ...props,
        children: children.length > 0 ? children.flat() : props?.children
    };
    return jsx(type, allProps);
}
export { createJSXElement as createElement };
//# sourceMappingURL=factory.js.map