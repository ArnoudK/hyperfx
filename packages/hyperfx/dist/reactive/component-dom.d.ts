import type { JSXElement, ComponentProps } from "../jsx/jsx-runtime";
/**
 * Direct DOM Component System for HyperFX
 *
 * This provides a component system that works with actual DOM elements
 * instead of virtual DOM nodes.
 */
export interface Component<P = ComponentProps> {
    (props: P): JSXElement;
    displayName?: string;
}
export interface LifecycleHooks<P = ComponentProps> {
    onMount?: (element: JSXElement, props: P) => void;
    onUnmount?: (element: JSXElement, props: P) => void;
    onUpdate?: (element: JSXElement, props: P, prevProps: P) => void;
}
export interface ComponentWithLifecycle<P = ComponentProps> extends Component<P>, LifecycleHooks<P> {
    __hooks?: LifecycleHooks<P>;
}
/**
 * Create a component with optional lifecycle hooks
 */
export declare function createComponent<P = ComponentProps>(renderFn: (props: P) => JSXElement, hooks?: LifecycleHooks<P>): ComponentWithLifecycle<P>;
/**
 * Class-based component for more complex scenarios
 */
export declare abstract class ClassComponent<P = ComponentProps> {
    protected _element?: JSXElement;
    protected _props?: P;
    protected _mounted: boolean;
    protected _effects: (() => void)[];
    abstract render(): JSXElement;
    mount(element: JSXElement, props: P): void;
    unmount(): void;
    update(newProps: P): void;
    protected componentDidMount(): void;
    protected componentDidUpdate(_newProps: P, _prevProps: P | undefined): void;
    protected componentWillUnmount(): void;
    protected addEffect(effect: () => void): void;
    private cleanup;
    get element(): JSXElement | undefined;
    get props(): P | undefined;
    get mounted(): boolean;
}
/**
 * Wrapper to mount a component with automatic lifecycle management
 */
export declare function mountComponent<P = ComponentProps>(component: Component<P> | ComponentWithLifecycle<P>, props: P, container: HTMLElement, anchor?: Node | null): JSXElement;
/**
 * Wrapper to unmount a component with cleanup
 */
export declare function unmountComponent<P = ComponentProps>(component: Component<P> | ComponentWithLifecycle<P>, element: JSXElement, container: HTMLElement): void;
/**
 * Component memoization for performance
 */
export declare function memo<P extends ComponentProps>(component: Component<P>, areEqual?: (prevProps: P, nextProps: P) => boolean): Component<P>;
/**
 * Forward ref for component composition
 */
export interface Ref<T> {
    current: T | null;
}
export declare function forwardRef<T = HTMLElement, P extends ComponentProps = ComponentProps>(renderFn: (props: P, ref: Ref<T>) => JSXElement): Component<P & {
    ref?: Ref<T>;
}>;
declare global {
    interface HTMLElement {
        __componentRef?: Component<unknown>;
        __componentProps?: unknown;
    }
}
export type { ComponentProps, JSXElement };
