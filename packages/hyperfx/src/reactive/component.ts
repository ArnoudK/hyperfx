import { morph } from "./morphing";

export type WhateverComponent = Comp<any>;

class Comp<K extends any> {
  render: (data: K, comp: Comp<K>) => HTMLElement;
  childComps: WhateverComponent[] = [];
  protected parent: WhateverComponent;
  protected data: K;
  protected changed = true;
  public getParent() {
    return this.parent;
  }

  /**
   * Usefull when updating before the component needs to be rendered!
   */
  public UpdateNoRender(data: K) {
    this.data = data;
    this.changed = true;
  }

  public Update(newData: K) {
    this.data = newData;
    this.changed = true;
    this.Render();
  }

  /** The current dom element*/
  public currentRender: HTMLElement;

  /** Get a (shallow) copy of the array of children */
  public getChildren() {
    return [...this.childComps];
  }

  /** Returns the child */
  public addChild(c: WhateverComponent) {
    //@ts-ignore
    if (c == this) {
      throw Error("Can't add yourself as a child!?");
    }
    this.childComps.push(c);
  }
  public removeChild(c: WhateverComponent) {
    this.childComps = this.childComps.filter((ch) => c != ch);
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
    return this.currentRender;
  }

  constructor(
    parent: WhateverComponent,
    data: K,
    render: (data: K, comp: Comp<K>) => HTMLElement
  ) {
    this.render = render;
    this.data = data;
    this.parent = parent;
    this.currentRender = this.render(data, this);
  }
}

let rc: undefined | RootComp = undefined;
export function RootComponent() {
  if (rc) return rc;
  rc = new RootComp();
  return rc;
}

class RootComp extends Comp<undefined> {
  constructor() {
    super(undefined as any, undefined, () => {
      // hacky method that works because the Root render does nothing and is equal the the previous render
      return document.body;
    });
    this.parent = this as WhateverComponent;
  }
}

/** A component can be used to Bind a Value to a Render */
export function Component<K extends any>(
  parent: WhateverComponent,
  data: K,
  render: (data: K, comp: Comp<K>) => HTMLElement
) {
  const comp = new Comp(parent, data, render);

  return comp;
}

export type WhateverPageComponent = PageComp<any>;
/**
 *
 * @param pageLoad Function is called when the route-path and matches the route this registered with in the 'pagehandler'. NOTE WHEN USING .Update ON COMPONENT IT WILL RENDER!!! (if you do so use no render)
 */
export class PageComp<K extends any> extends Comp<K> {
  removeAllChildren() {
    this.childComps = [];
  }
  onPageLoad: (data: K, comp: PageComp<K>) => void;

  OnPageLoad() {
    this.onPageLoad(this.data, this);
  }

  public constructor(
    parent: WhateverComponent,
    data: K,
    render: (data: K, comp: Comp<K>) => HTMLElement,
    onPageLoad: (data: K, comp: PageComp<K>) => void
  ) {
    super(parent, data, render);
    this.onPageLoad = onPageLoad;
  }
}

export function PageComponent<K extends any>(
  parent: WhateverComponent,
  data: K,
  render: (data: K, comp: Comp<K>) => HTMLElement,
  onPageLoad: (data: K, comp: PageComp<K>) => void
) {
  return new PageComp(parent, data, render, onPageLoad);
}
