/** Component lifecycle state */
export declare enum ComponentState {
    Created = "created",
    Mounted = "mounted",
    Updated = "updated",
    Unmounted = "unmounted"
}
/** Base type for component data */
export type ComponentData = null | undefined | string | number | boolean | object | Array<any>;
/** Base component interface for type safety */
export interface IComponent<T> {
    data: T;
    render: (data: T, comp: IComponent<T>) => HTMLElement;
    currentRender: HTMLElement;
    Render: (force?: boolean) => HTMLElement;
    Update: (data: T) => void;
    addChild: <K>(child: IComponent<K>) => void;
    removeChild: <K>(child: IComponent<K>) => void;
    dispose: () => void;
    getState: () => ComponentState;
}
/** Component that can handle any data type */
export type WhateverComponent = IComponent<any>;
declare class Comp<K> implements IComponent<K> {
    protected state: ComponentState;
    protected cleanupFns: Array<() => void>;
    render: (data: K, comp: IComponent<K>) => HTMLElement;
    protected childComps: Array<IComponent<any>>;
    protected parent: WhateverComponent;
    data: K;
    protected changed: boolean;
    currentRender: HTMLElement;
    getParent(): WhateverComponent;
    getState(): ComponentState;
    addCleanup(fn: () => void): this;
    Update(newData: K): void;
    getChildren(): IComponent<any>[];
    addChild<T>(c: IComponent<T>): void;
    private mountChild;
    removeChild<T>(c: IComponent<T>): void;
    Render(force?: boolean): HTMLElement;
    constructor(parent: WhateverComponent, data: K, render: (data: K, comp: IComponent<K>) => HTMLElement);
    dispose(): void;
}
declare class RootComp extends Comp<ComponentData> {
    constructor();
}
export declare const RootComponent: () => RootComp;
export declare function Component<K>(parent: WhateverComponent, data: K, render: (data: K, comp: IComponent<K>) => HTMLElement): IComponent<K>;
export declare class PageComp<K> extends Comp<K> {
    private pageLoadCallback;
    removeAllChildren(): void;
    OnPageLoad(): void;
    constructor(parent: WhateverComponent, data: K, render: (data: K, comp: IComponent<K>) => HTMLElement, onPageLoad: (data: K, comp: PageComp<K>) => void);
}
/** Type alias for any page component */
export type PageCompType = PageComp<any>;
/**
 * Create a new page component
 */
export declare function PageComponent<K>(parent: WhateverComponent, data: K, render: (data: K, comp: IComponent<K>) => HTMLElement, onPageLoad: (data: K, comp: PageComp<K>) => void): PageComp<K>;
export {};
