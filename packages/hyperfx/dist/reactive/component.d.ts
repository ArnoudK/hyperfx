export type WhateverComponent = Comp<any>;
declare class Comp<K extends any> {
    render: (data: K, comp: Comp<K>) => HTMLElement;
    childComps: WhateverComponent[];
    protected parent: WhateverComponent;
    protected data: K;
    protected changed: boolean;
    getParent(): WhateverComponent;
    /**
     * Usefull when updating before the component needs to be rendered!
     */
    UpdateNoRender(data: K): void;
    Update(newData: K): void;
    /** The current dom element*/
    currentRender: HTMLElement;
    /** Get a (shallow) copy of the array of children */
    getChildren(): WhateverComponent[];
    /** Returns the child */
    addChild(c: WhateverComponent): void;
    removeChild(c: WhateverComponent): void;
    Render(force?: boolean): HTMLElement;
    constructor(parent: WhateverComponent, data: K, render: (data: K, comp: Comp<K>) => HTMLElement);
}
export declare function RootComponent(): RootComp;
declare class RootComp extends Comp<undefined> {
    constructor();
}
/** A component can be used to Bind a Value to a Render */
export declare function Component<K extends any>(parent: WhateverComponent, data: K, render: (data: K, comp: Comp<K>) => HTMLElement): Comp<K>;
export type WhateverPageComponent = PageComp<any>;
/**
 *
 * @param OnPageLoad Function is called when the route-path and matches the route this registered with in the 'pagehandler'. NOTE WHEN USING .Update ON COMPONENT IT WILL RENDER!!! (if you do so use no render)
 */
export declare class PageComp<K extends any> extends Comp<K> {
    removeAllChildren(): void;
    onPageLoad: (data: K, comp: PageComp<K>) => void;
    OnPageLoad(): void;
    constructor(parent: WhateverComponent, data: K, render: (data: K, comp: Comp<K>) => HTMLElement, onPageLoad: (data: K, comp: PageComp<K>) => void);
}
export declare function PageComponent<K extends any>(parent: WhateverComponent, data: K, render: (data: K, comp: Comp<K>) => HTMLElement, onPageLoad: (data: K, comp: PageComp<K>) => void): PageComp<K>;
export {};
//# sourceMappingURL=component.d.ts.map