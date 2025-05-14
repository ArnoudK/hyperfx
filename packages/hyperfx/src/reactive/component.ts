import { morph } from "./morphing";

/** Component lifecycle state */
export enum ComponentState {
  Created = 'created',
  Mounted = 'mounted',
  Updated = 'updated',
  Unmounted = 'unmounted'
}

/** Base type for component data */
export type ComponentData =
  | null
  | undefined
  | string
  | number
  | boolean
  | object
  | Array<any>;

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

class Comp<K> implements IComponent<K> {
  protected state: ComponentState = ComponentState.Created;
  protected cleanupFns: Array<() => void> = [];

  render: (data: K, comp: IComponent<K>) => HTMLElement;
  protected childComps: Array<IComponent<any>> = [];
  protected parent: WhateverComponent;
  public data: K;
  protected changed = true;
  public currentRender: HTMLElement;

  public getParent() {
    return this.parent;
  }

  public getState(): ComponentState {
    return this.state;
  }

  public addCleanup(fn: () => void): this {
    this.cleanupFns.push(fn);
    return this;
  }



  public Update(newData: K) {
    this.data = newData;
    this.Render(true);
  }

  public getChildren() {
    return [...this.childComps];
  }

  public addChild<T>(c: IComponent<T>) {
    if ((c as unknown) === this) {
      throw new Error("Cannot add component as child of itself");
    }
    this.childComps.push(c);
    if (this.state === ComponentState.Mounted) {
      this.mountChild(c);
    }
  }

  private mountChild<T>(c: IComponent<T>) {
    if (c instanceof Comp) {
      c.state = ComponentState.Mounted;
    }
  }

  public removeChild<T>(c: IComponent<T>) {
    this.childComps = this.childComps.filter((ch) => ch !== c);
    c.dispose();
  }

  public Render(force = false) {
    if (!(this.changed || force)) {
      return this.currentRender;
    }

    const newR = this.render(this.data, this);
    for (const c of this.childComps) {
      c.Render(force);
    }

    morph(this.currentRender, newR, {});
    this.changed = false;

    if (this.state === ComponentState.Created) {
      this.state = ComponentState.Mounted;
      this.childComps.forEach(c => this.mountChild(c));
    }

    return this.currentRender;
  }

  constructor(
    parent: WhateverComponent,
    data: K,
    render: (data: K, comp: IComponent<K>) => HTMLElement,
  ) {
    this.render = render;
    this.data = data;
    this.parent = parent;
    this.currentRender = this.render(this.data, this);
  }

  public dispose() {
    this.childComps.forEach(c => c.dispose());
    this.childComps = [];
    this.cleanupFns.forEach(fn => fn());
    this.state = ComponentState.Unmounted;
  }
}

class RootComp extends Comp<ComponentData> {
  constructor() {
    super(undefined as any, {}, () => document.body);
    this.parent = this as WhateverComponent;
    window.addEventListener('unload', () => this.dispose());
  }
}

const root_comp = new RootComp();

export const RootComponent = () => root_comp;

export function Component<K>(
  parent: WhateverComponent,
  data: K,
  render: (data: K, comp: IComponent<K>) => HTMLElement,
): IComponent<K> {
  const comp = new Comp(parent, data, render);
  parent.addChild(comp);
  return comp;
}

export class PageComp<K> extends Comp<K> {
  private pageLoadCallback: (data: K, comp: PageComp<K>) => void;

  removeAllChildren() {
    [...this.childComps].forEach(child => this.removeChild(child));
  }

  OnPageLoad() {
    this.pageLoadCallback(this.data, this);
  }

  constructor(
    parent: WhateverComponent,
    data: K,
    render: (data: K, comp: IComponent<K>) => HTMLElement,
    onPageLoad: (data: K, comp: PageComp<K>) => void,
  ) {
    super(parent, data, render);
    this.pageLoadCallback = onPageLoad;
  }
}

/** Type alias for any page component */
export type PageCompType = PageComp<any>;

/**
 * Create a new page component
 */
export function PageComponent<K>(
  parent: WhateverComponent,
  data: K,
  render: (data: K, comp: IComponent<K>) => HTMLElement,
  onPageLoad: (data: K, comp: PageComp<K>) => void,
): PageComp<K> {
  const comp = new PageComp(parent, data, render, onPageLoad);
  parent.addChild(comp);
  return comp;
}
