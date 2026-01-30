import { createEffect } from "../reactive/state";
/**
 * Create a component with optional lifecycle hooks
 */
export function createComponent(renderFn, hooks) {
    const component = function (props) {
        return renderFn(props);
    };
    component.displayName = renderFn.name || 'Component';
    if (hooks) {
        component.onMount = hooks.onMount;
        component.onUnmount = hooks.onUnmount;
        component.onUpdate = hooks.onUpdate;
        component.__hooks = hooks;
    }
    return component;
}
/**
 * Class-based component for more complex scenarios
 */
export class ClassComponent {
    constructor() {
        this._mounted = false;
        this._effects = [];
    }
    mount(element, props) {
        this._element = element;
        this._props = props;
        this._mounted = true;
        this.componentDidMount();
    }
    unmount() {
        this._mounted = false;
        this.cleanup();
        this.componentWillUnmount();
    }
    update(newProps) {
        const prevProps = this._props;
        this._props = newProps;
        if (this._mounted) {
            this.componentDidUpdate(newProps, prevProps);
        }
    }
    componentDidMount() {
        // Override in subclasses
    }
    componentDidUpdate(_newProps, _prevProps) {
        // Override in subclasses
    }
    componentWillUnmount() {
        // Override in subclasses
    }
    addEffect(effect) {
        if (this._mounted) {
            const cleanup = createEffect(effect);
            this._effects.push(cleanup);
        }
    }
    cleanup() {
        this._effects.forEach(cleanup => {
            cleanup();
        });
        this._effects = [];
    }
    get element() {
        return this._element;
    }
    get props() {
        return this._props;
    }
    get mounted() {
        return this._mounted;
    }
}
/**
 * Wrapper to mount a component with automatic lifecycle management
 */
export function mountComponent(component, props, container, anchor = null) {
    const element = component(props);
    // Call mount lifecycle if it exists
    if (typeof component === 'function' && component.onMount) {
        component.onMount?.(element, props);
    }
    // Handle class components
    if (component instanceof ClassComponent) {
        component.mount(element, props);
    }
    // Insert into DOM
    // Note: mount functions only run on client, so element is always a DOM Node
    const domElement = element;
    if (anchor) {
        container.insertBefore(domElement, anchor);
    }
    else {
        container.appendChild(domElement);
    }
    return element;
}
/**
 * Wrapper to unmount a component with cleanup
 */
export function unmountComponent(component, element, container) {
    // Call unmount lifecycle if it exists
    if (typeof component === 'function' && component.onUnmount) {
        const props = element.__componentProps;
        component.onUnmount?.(element, props);
    }
    // Handle class components
    if (component instanceof ClassComponent) {
        component.unmount();
    }
    // Remove from DOM
    // Note: unmount functions only run on client, so element is always a DOM Node
    const domElement = element;
    if (domElement && domElement.parentNode === container) {
        container.removeChild(domElement);
    }
}
/**
 * Component memoization for performance
 */
export function memo(component, areEqual) {
    let lastProps;
    let lastElement;
    return function (props) {
        if (!lastProps || !areEqual || !areEqual(lastProps, props)) {
            lastProps = props;
            lastElement = component(props);
        }
        return lastElement;
    };
}
export function forwardRef(renderFn) {
    return function (props) {
        const ref = props.ref;
        const restProps = {};
        // Copy all properties except 'ref' to restProps
        for (const key in props) {
            if (key !== 'ref' && Object.prototype.hasOwnProperty.call(props, key)) {
                restProps[key] = props[key];
            }
        }
        return renderFn(restProps, ref || { current: null });
    };
}
//# sourceMappingURL=component-dom.js.map