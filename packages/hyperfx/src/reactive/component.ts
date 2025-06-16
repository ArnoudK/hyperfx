import { VNode, FRAGMENT_TAG, mount, patch, unmount as unmountVNode } from "../elem/elem";

let componentIdCounter = 0;
function generateId(prefix = "comp"): string {
  return `${prefix}-${componentIdCounter++}`;
}

// Simplified ComponentLifecycle: CompType generic removed
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

// Base component interface that all components implement
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

export abstract class Comp<P, S> implements ComponentBase {
  id: string;
  currentProps: P;
  protected state?: S;
  children: ComponentBase[] = [];
  parent?: ComponentBase;
  options: ComponentLifecycle<P, S>;

  parentDomElement?: HTMLElement;
  currentRender?: VNode;
  mountedDom?: Node;

  constructor(
    parent: ComponentBase | null,
    initialProps: P,
    options?: Partial<ComponentLifecycle<P, S>>
  ) {
    this.id = generateId(this.constructor.name);
    this.currentProps = initialProps;
    this.options = { ...options } as ComponentLifecycle<P, S>;
    if (parent) {
      parent.addChild(this);
    }
    this.options.onInit?.(this);
  }

  abstract Render(props: P, component: this): VNode | VNode[];

  addChild(child: ComponentBase): void {
    child.parent = this;
    this.children.push(child);
  }

  removeChild(child: ComponentBase): void {
    this.children = this.children.filter(c => c !== child);
    child.parent = undefined;
  }

  mount(parentElement: HTMLElement): void {
    if (this.mountedDom) return;

    this.parentDomElement = parentElement;
    this.options.onBeforeMount?.(parentElement, this);

    const renderOutput = this.Render(this.currentProps, this);
    let vNodeToMount: VNode;
    if (Array.isArray(renderOutput)) {
      vNodeToMount = { tag: FRAGMENT_TAG, props: {}, children: renderOutput, dom: undefined };
    } else {
      vNodeToMount = renderOutput;
    }

    this.currentRender = vNodeToMount;
    this.mountedDom = mount(this.currentRender, parentElement);

    this.options.onMount?.(this.mountedDom, this);

    const mountTargetForChildren = (this.currentRender.tag === FRAGMENT_TAG || !(this.mountedDom instanceof HTMLElement))
      ? parentElement
      : this.mountedDom as HTMLElement;

    this.children.forEach(child => {
      child.mount(mountTargetForChildren);
    });
  }

  Update(newProps: Partial<P>): void {
    const oldProps = { ...this.currentProps };
    this.currentProps = { ...this.currentProps, ...newProps };

    this.options.onBeforeUpdate?.(oldProps, this.currentProps, this);

    if (!this.mountedDom || !this.currentRender || !this.parentDomElement) {
      this.options.onUpdate?.(oldProps, this.currentProps, this);
      return;
    }

    const newRenderOutput = this.Render(this.currentProps, this);
    let newVNodeToPatch: VNode;
    if (Array.isArray(newRenderOutput)) {
      newVNodeToPatch = { tag: FRAGMENT_TAG, props: {}, children: newRenderOutput, dom: undefined };
    } else {
      newVNodeToPatch = newRenderOutput;
    }

    patch(this.currentRender, newVNodeToPatch, this.parentDomElement);
    this.currentRender = newVNodeToPatch;
    this.mountedDom = this.currentRender.dom!;

    this.options.onUpdate?.(oldProps, this.currentProps, this);
  }

  unmount(): void {
    if (!this.mountedDom || !this.currentRender) return;

    this.options.onBeforeUnmount?.(this.mountedDom, this);
    this.children.forEach(child => child.unmount());
    unmountVNode(this.currentRender);
    this.options.onUnmount?.(this.mountedDom, this);

    this.mountedDom = undefined;
    this.currentRender = undefined;
    this.parentDomElement = undefined;
  }

  destroy(): void {
    this.unmount();
    this.children.forEach(child => child.destroy());
    this.children = [];
    this.parent = undefined;
    this.options.onDestroy?.(this);
  }
}

export class RootComp implements ComponentBase {
  id: string;
  children: ComponentBase[] = [];
  parent?: ComponentBase;
  parentDomElement?: HTMLElement;
  currentRender?: VNode;
  mountedDom?: Node;
  options: ComponentLifecycle<any, null>;

  constructor(options?: Partial<ComponentLifecycle<any, null>>) {
    this.id = generateId("RootComp");
    this.options = { ...options } as ComponentLifecycle<any, null>;
    this.options.onInit?.(this as any);
  }

  Render(): VNode {
    const childVNodes = this.children.flatMap(child => {
      if ('currentRender' in child && child.currentRender) {
        const renderOutput = child.currentRender;
        return Array.isArray(renderOutput) ? renderOutput : [renderOutput];
      }
      if ('Render' in child && 'currentProps' in child) {
        const comp = child as Comp<any, any>;
        const renderOutput = comp.Render(comp.currentProps, comp as any);
        return Array.isArray(renderOutput) ? renderOutput : [renderOutput];
      }
      return [];
    }).filter(vnode => vnode !== null && vnode !== undefined) as VNode[];
    return { tag: FRAGMENT_TAG, props: {}, children: childVNodes, dom: undefined };
  }

  mountTo(container: HTMLElement): void {
    if (this.mountedDom) return;
    this.parentDomElement = container;
    this.options.onBeforeMount?.(container, this as any);
    
    this.currentRender = this.Render();
    this.mountedDom = mount(this.currentRender, container);

    this.options.onMount?.(this.mountedDom, this as any);

    this.children.forEach(child => {
      if (!child.mountedDom) {
        child.mount(container);
      }
    });
  }

  mount(parentElement: HTMLElement): void {
    this.mountTo(parentElement);
  }

  addChild(child: ComponentBase): void {
    child.parent = this;
    this.children.push(child);
    if (this.mountedDom && this.parentDomElement) {
      if (!child.mountedDom) {
        child.mount(this.parentDomElement);
      }
      this.update();
    }
  }

  removeChild(child: ComponentBase): void {
    child.unmount();
    this.children = this.children.filter(c => c !== child);
    child.parent = undefined;
    if (this.mountedDom) {
      this.update();
    }
  }

  update(): void {
    this.children.forEach(child => {
      if ('Update' in child && typeof child.Update === 'function') {
        try {
          (child as any).Update({});
        } catch (e) {
          console.warn(`Error calling Update on child component during RootComp.update:`, child, e);
        }
      }
    });
  }

  unmount(): void {
    if (!this.mountedDom || !this.currentRender) return;

    this.options.onBeforeUnmount?.(this.mountedDom, this as any);
    this.children.forEach(child => child.unmount());
    unmountVNode(this.currentRender);
    this.options.onUnmount?.(this.mountedDom, this as any);

    this.mountedDom = undefined;
    this.currentRender = undefined;
    this.parentDomElement = undefined;
  }

  destroy(): void {
    this.unmount();
    this.children.forEach(child => child.destroy());
    this.children = [];
    this.parent = undefined;
    this.options.onDestroy?.(this as any);
  }
}

// PageOptions extends the simplified ComponentLifecycle
export interface PageOptions<P, S> extends ComponentLifecycle<P, S> {
  onPageLoad?: (element: HTMLElement, component: PageComp<P, S>) => void;
  onPageUnload?: (component: PageComp<P, S>) => void;
}

export class PageComp<P, S> extends Comp<P, S> {
  options: PageOptions<P, S>;

  constructor(
    parent: ComponentBase | null,
    initialProps: P,
    options?: Partial<PageOptions<P, S>>
  ) {
    super(parent, initialProps, options);
    this.options = { ...options } as PageOptions<P, S>; 
  }

  Render(props: P, component: this): VNode | VNode[] {
    return { tag: FRAGMENT_TAG, props: {}, children: [], dom: undefined };
  }
}

export class ArrayComp<D, ItemProps = D> extends Comp<D[], { itemComponents: Comp<ItemProps, any>[] }> {
  private itemComponentFactory: (parent: ComponentBase, data: D, index: number) => Comp<ItemProps, any>;
  private dataToKey?: (data: D) => string | number;

  constructor(
    parent: ComponentBase,
    initialData: D[],
    itemComponentFactory: (parent: ComponentBase, data: D, index: number) => Comp<ItemProps, any>,
    options?: Partial<ComponentLifecycle<D[], { itemComponents: Comp<ItemProps, any>[] }>> & { dataToKey?: (data: D) => string | number }
  ) {
    super(parent, initialData, options);
    this.itemComponentFactory = itemComponentFactory;
    this.dataToKey = options?.dataToKey;
    this.state = { itemComponents: [] };
    this.synchronizeItemComponents(initialData, true);
  }

  private synchronizeItemComponents(newData: D[], isInitialSync = false): void {
    const oldItemComps = this.state!.itemComponents;
    const newItemComps: Comp<ItemProps, any>[] = [];
    const mountedParent = this.parentDomElement;
    const newCompsByKey: Map<string|number, Comp<ItemProps, any>> = new Map();
    
    newData.forEach((itemData, index) => {
        const key = this.dataToKey ? this.dataToKey(itemData) : index;
        let comp = oldItemComps.find(c => {
            if (this.dataToKey && c.currentProps) {
                try { return this.dataToKey(c.currentProps as any as D) === key; } catch { return false; }
            }
            return false; 
        });

        if (comp) {
            comp.Update(itemData as any as Partial<ItemProps>);
        } else {
            comp = this.itemComponentFactory(this, itemData, index);
            if (mountedParent && !isInitialSync) {
                comp.mount(mountedParent);
            }
        }
        newItemComps.push(comp);
        if (key !== undefined) newCompsByKey.set(key, comp);
    });

    oldItemComps.forEach(oldComp => {
        let key: string | number | undefined = undefined;
        if (this.dataToKey && oldComp.currentProps) {
            try { key = this.dataToKey(oldComp.currentProps as any as D); } catch {}
        }
        if ((key === undefined || !newCompsByKey.has(key)) && !newItemComps.includes(oldComp)) {
             if (!isInitialSync) {
                oldComp.destroy();
             }
        }
    });
    
    this.state!.itemComponents = newItemComps;
    this.children = [...this.state!.itemComponents];
  }

  Render(): VNode[] {
    return this.state!.itemComponents.map(itemComp => {
      const renderOutput = itemComp.currentRender || itemComp.Render(itemComp.currentProps, itemComp as any);
      if (Array.isArray(renderOutput)) {
        console.warn("ArrayComp item rendered an array, wrapping in fragment.");
        return { tag: FRAGMENT_TAG, props: {}, children: renderOutput, dom: undefined };
      }
      return renderOutput;
    }).filter(vnode => vnode !== null && vnode !== undefined) as VNode[];
  }
  
  Update(newData: D[]): void {
    const oldData = this.currentProps;
    this.currentProps = newData;
    this.options.onBeforeUpdate?.(oldData, newData, this);

    if (!this.mountedDom || !this.currentRender || !this.parentDomElement) {
      this.synchronizeItemComponents(newData);
      this.options.onUpdate?.(oldData, newData, this);
      return;
    }
    
    this.synchronizeItemComponents(newData);

    const newRenderOutput = this.Render();
    const newVNodeToPatch: VNode = { tag: FRAGMENT_TAG, props: {}, children: newRenderOutput, dom: undefined };

    patch(this.currentRender, newVNodeToPatch, this.parentDomElement);
    this.currentRender = newVNodeToPatch;
    this.mountedDom = this.currentRender.dom!;

    this.options.onUpdate?.(oldData, newData, this);
  }

  addChild(child: ComponentBase): void {
    if ('currentProps' in child && this.state?.itemComponents.includes(child as Comp<ItemProps, any>)) {
        return; // Don't add duplicates
    }
    super.addChild(child);
  }
}

// Factory functions updated to use simplified lifecycle types
export function Component<P, S = {}>(
  parent: ComponentBase | null,
  initialProps: P,
  renderFn: (props: P, component: Comp<P, S>) => VNode | VNode[],
  options?: Partial<ComponentLifecycle<P, S>>
): Comp<P, S> {
  class GenericComponent extends Comp<P, S> {
    constructor() {
      super(parent, initialProps, options);
    }
    Render(props: P, component: this): VNode | VNode[] {
      return renderFn(props, component);
    }
  }
  return new GenericComponent();
}

export function PageComponent<P, S = {}>(
  parent: ComponentBase,
  initialProps: P,
  renderFn: (props: P, component: PageComp<P, S>) => VNode | VNode[],
  options?: Partial<PageOptions<P, S>>
): PageComp<P, S> {
  class GenericPageComponent extends PageComp<P, S> {
     constructor() {
      super(parent, initialProps, options);
    }
    Render(props: P, component: this): VNode | VNode[] {
      return renderFn(props, component);
    }
  }
  return new GenericPageComponent();
}

export function ArrayComponent<D, ItemProps = D>(
  parent: ComponentBase,
  initialData: D[],
  itemRenderFn: (data: D, index: number, parentComp: ComponentBase) => VNode,
  options?: Partial<ComponentLifecycle<D[], { itemComponents: Comp<ItemProps, any>[] }>> & { dataToKey?: (data: D) => string | number }
): ArrayComp<D, ItemProps> {
  const itemFactory = (arrayCompInstance: ComponentBase, data: D, index: number): Comp<ItemProps, any> => {
    return Component(arrayCompInstance, data as any as ItemProps, (props) => {
        return itemRenderFn(props as any as D, index, arrayCompInstance);
    });
  };
  return new ArrayComp<D, ItemProps>(parent, initialData, itemFactory, options);
}
