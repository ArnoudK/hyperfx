import { VNode } from "../elem/elem";
export interface ComponentLifecycle<P, S> {
    onInit?: (component: Comp<P, S>) => void;
    onBeforeMount?: (parentElement: HTMLElement, component: Comp<P, S>) => void;
    onMount?: (mountedNode: Node, component: Comp<P, S>) => void;
    onBeforeUpdate?: (oldProps: P, newProps: P, component: Comp<P, S>) => void;
    onUpdate?: (oldProps: P, newProps: P, component: Comp<P, S>) => void;
    onBeforeUnmount?: (mountedNode: Node, component: Comp<P, S>) => void;
    onUnmount?: (unmountedNode: Node, component: Comp<P, S>) => void;
    onDestroy?: (component: Comp<P, S>) => void;
}
export interface ComponentBase {
    id: string;
    children: ComponentBase[];
    parent?: ComponentBase;
    parentDomElement?: HTMLElement;
    currentRender?: VNode;
    mountedDom?: Node;
    addChild(child: ComponentBase): void;
    removeChild(child: ComponentBase): void;
    mount(parentElement: HTMLElement): void;
    unmount(): void;
    destroy(): void;
}
export declare abstract class Comp<P, S> implements ComponentBase {
    id: string;
    currentProps: P;
    protected state?: S;
    children: ComponentBase[];
    parent?: ComponentBase;
    options: ComponentLifecycle<P, S>;
    parentDomElement?: HTMLElement;
    currentRender?: VNode;
    mountedDom?: Node;
    constructor(parent: ComponentBase | null, initialProps: P, options?: Partial<ComponentLifecycle<P, S>>);
    abstract Render(props: P, component: this): VNode | VNode[];
    addChild(child: ComponentBase): void;
    removeChild(child: ComponentBase): void;
    mount(parentElement: HTMLElement): void;
    Update(newProps: Partial<P>): void;
    unmount(): void;
    destroy(): void;
}
export declare class RootComp implements ComponentBase {
    id: string;
    children: ComponentBase[];
    parent?: ComponentBase;
    parentDomElement?: HTMLElement;
    currentRender?: VNode;
    mountedDom?: Node;
    options: ComponentLifecycle<any, null>;
    constructor(options?: Partial<ComponentLifecycle<any, null>>);
    Render(): VNode;
    mountTo(container: HTMLElement): void;
    mount(parentElement: HTMLElement): void;
    addChild(child: ComponentBase): void;
    removeChild(child: ComponentBase): void;
    update(): void;
    unmount(): void;
    destroy(): void;
}
export interface PageOptions<P, S> extends ComponentLifecycle<P, S> {
    onPageLoad?: (element: HTMLElement, component: PageComp<P, S>) => void;
    onPageUnload?: (component: PageComp<P, S>) => void;
}
export declare class PageComp<P, S> extends Comp<P, S> {
    options: PageOptions<P, S>;
    constructor(parent: ComponentBase | null, initialProps: P, options?: Partial<PageOptions<P, S>>);
    Render(props: P, component: this): VNode | VNode[];
}
export declare class ArrayComp<D, ItemProps = D> extends Comp<D[], {
    itemComponents: Comp<ItemProps, any>[];
}> {
    private itemComponentFactory;
    private dataToKey?;
    constructor(parent: ComponentBase, initialData: D[], itemComponentFactory: (parent: ComponentBase, data: D, index: number) => Comp<ItemProps, any>, options?: Partial<ComponentLifecycle<D[], {
        itemComponents: Comp<ItemProps, any>[];
    }>> & {
        dataToKey?: (data: D) => string | number;
    });
    private synchronizeItemComponents;
    Render(): VNode[];
    Update(newData: D[]): void;
    addChild(child: ComponentBase): void;
}
export declare function Component<P, S = {}>(parent: ComponentBase | null, initialProps: P, renderFn: (props: P, component: Comp<P, S>) => VNode | VNode[], options?: Partial<ComponentLifecycle<P, S>>): Comp<P, S>;
export declare function PageComponent<P, S = {}>(parent: ComponentBase, initialProps: P, renderFn: (props: P, component: PageComp<P, S>) => VNode | VNode[], options?: Partial<PageOptions<P, S>>): PageComp<P, S>;
export declare function ArrayComponent<D, ItemProps = D>(parent: ComponentBase, initialData: D[], itemRenderFn: (data: D, index: number, parentComp: ComponentBase) => VNode, options?: Partial<ComponentLifecycle<D[], {
    itemComponents: Comp<ItemProps, any>[];
}>> & {
    dataToKey?: (data: D) => string | number;
}): ArrayComp<D, ItemProps>;
