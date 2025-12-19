import { ReactiveSignal, createEffect } from "../reactive/state";
import type { JSXElement, ComponentProps } from "../jsx/jsx-runtime";

/**
 * Direct DOM Component System for HyperFX
 * 
 * This provides a component system that works with actual DOM elements
 * instead of virtual DOM nodes.
 */

// Base component interface
export interface Component<P = ComponentProps> {
  (props: P): JSXElement;
  displayName?: string;
}

// Component lifecycle hooks
export interface LifecycleHooks<P = ComponentProps> {
  onMount?: (element: JSXElement, props: P) => void;
  onUnmount?: (element: JSXElement, props: P) => void;
  onUpdate?: (element: JSXElement, props: P, prevProps: P) => void;
}

// Enhanced component with lifecycle support
export interface ComponentWithLifecycle<P = ComponentProps> extends Component<P>, LifecycleHooks<P> {
  __hooks?: LifecycleHooks<P>;
}

/**
 * Create a component with optional lifecycle hooks
 */
export function createComponent<P = ComponentProps>(
  renderFn: (props: P) => JSXElement,
  hooks?: LifecycleHooks<P>
): ComponentWithLifecycle<P> {
  const component = function(props: P): JSXElement {
    return renderFn(props);
  } as ComponentWithLifecycle<P>;

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
export abstract class ClassComponent<P = ComponentProps> {
  protected _element?: JSXElement;
  protected _props?: P;
  protected _mounted = false;
  protected _effects: (() => void)[] = [];

  abstract render(): JSXElement;

  mount(element: JSXElement, props: P): void {
    this._element = element;
    this._props = props;
    this._mounted = true;
    this.componentDidMount();
  }

  unmount(): void {
    this._mounted = false;
    this.cleanup();
    this.componentWillUnmount();
  }

  update(newProps: P): void {
    const prevProps = this._props;
    this._props = newProps;
    
    if (this._mounted) {
      this.componentDidUpdate(newProps, prevProps);
    }
  }

  protected componentDidMount(): void {
    // Override in subclasses
  }

  protected componentDidUpdate(newProps: P, prevProps: P | undefined): void {
    // Override in subclasses
  }

  protected componentWillUnmount(): void {
    // Override in subclasses
  }

  protected addEffect(effect: () => void): void {
    if (this._mounted) {
      const cleanup = createEffect(effect);
      this._effects.push(cleanup);
    }
  }

  private cleanup(): void {
    this._effects.forEach(cleanup => {
      cleanup();
    });
    this._effects = [];
  }

  get element(): JSXElement | undefined {
    return this._element;
  }

  get props(): P | undefined {
    return this._props;
  }

  get mounted(): boolean {
    return this._mounted;
  }
}

/**
 * Wrapper to mount a component with automatic lifecycle management
 */
export function mountComponent<P = ComponentProps>(
  component: Component<P> | ComponentWithLifecycle<P>,
  props: P,
  container: HTMLElement,
  anchor: Node | null = null
): JSXElement {
  const element = component(props);

  // Call mount lifecycle if it exists
  if (typeof component === 'function' && (component as ComponentWithLifecycle<P>).onMount) {
    (component as ComponentWithLifecycle<P>).onMount?.(element, props);
  }

  // Handle class components
  if (component instanceof ClassComponent) {
    component.mount(element, props);
  }

  // Insert into DOM
  if (anchor) {
    container.insertBefore(element, anchor);
  } else {
    container.appendChild(element);
  }

  return element;
}

/**
 * Wrapper to unmount a component with cleanup
 */
export function unmountComponent<P = ComponentProps>(
  component: Component<P> | ComponentWithLifecycle<P>,
  element: JSXElement,
  container: HTMLElement
): void {
  // Call unmount lifecycle if it exists
  if (typeof component === 'function' && (component as ComponentWithLifecycle<P>).onUnmount) {
    const props = (element as HTMLElement).__componentProps as P;
    (component as ComponentWithLifecycle<P>).onUnmount?.(element, props);
  }

  // Handle class components
  if (component instanceof ClassComponent) {
    component.unmount();
  }

  // Remove from DOM
  if (element.parentNode === container) {
    container.removeChild(element);
  }
}

/**
 * Component memoization for performance
 */
export function memo<P extends ComponentProps>(
  component: Component<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
): Component<P> {
  let lastProps: P | undefined;
  let lastElement: JSXElement | undefined;

  return function(props: P): JSXElement {
    if (!lastProps || !areEqual || !areEqual(lastProps, props)) {
      lastProps = props;
      lastElement = component(props);
    }
    return lastElement!;
  };
}

/**
 * Forward ref for component composition
 */
export interface Ref<T> {
  current: T | null;
}

export function forwardRef<T = HTMLElement, P extends ComponentProps = ComponentProps>(
  renderFn: (props: P, ref: Ref<T>) => JSXElement
): Component<P & { ref?: Ref<T> }> {
  return function(props: P & { ref?: Ref<T> }): JSXElement {
    const ref = props.ref;
    const restProps = {} as P;
    
    // Copy all properties except 'ref' to restProps
    for (const key in props) {
      if (key !== 'ref' && Object.prototype.hasOwnProperty.call(props, key)) {
        (restProps as any)[key] = (props as any)[key];
      }
    }
    
    return renderFn(restProps, ref || { current: null });
  };
}

// Type extensions for HTMLElement to track component metadata
declare global {
  interface HTMLElement {
    __componentRef?: Component<unknown>;
    __componentProps?: unknown;
  }
}

export type { ComponentProps, JSXElement };

// Legacy exports for backward compatibility
export { Component as FunctionComponent };