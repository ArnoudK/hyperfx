import { FRAGMENT_TAG, mount, patch, unmount as unmountVNode } from "../elem/elem";
let componentIdCounter = 0;
function generateId(prefix = "comp") {
    return `${prefix}-${componentIdCounter++}`;
}
export class Comp {
    constructor(parent, initialProps, options) {
        this.children = [];
        this.id = generateId(this.constructor.name);
        this.currentProps = initialProps;
        this.options = { ...options };
        if (parent) {
            parent.addChild(this);
        }
        this.options.onInit?.(this);
    }
    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }
    removeChild(child) {
        this.children = this.children.filter(c => c !== child);
        child.parent = undefined;
    }
    mount(parentElement) {
        if (this.mountedDom)
            return;
        this.parentDomElement = parentElement;
        this.options.onBeforeMount?.(parentElement, this);
        const renderOutput = this.Render(this.currentProps, this);
        let vNodeToMount;
        if (Array.isArray(renderOutput)) {
            vNodeToMount = { tag: FRAGMENT_TAG, props: {}, children: renderOutput, dom: undefined };
        }
        else {
            vNodeToMount = renderOutput;
        }
        this.currentRender = vNodeToMount;
        this.mountedDom = mount(this.currentRender, parentElement);
        this.options.onMount?.(this.mountedDom, this);
        const mountTargetForChildren = (this.currentRender.tag === FRAGMENT_TAG || !(this.mountedDom instanceof HTMLElement))
            ? parentElement
            : this.mountedDom;
        this.children.forEach(child => {
            child.mount(mountTargetForChildren);
        });
    }
    Update(newProps) {
        const oldProps = { ...this.currentProps };
        this.currentProps = { ...this.currentProps, ...newProps };
        this.options.onBeforeUpdate?.(oldProps, this.currentProps, this);
        if (!this.mountedDom || !this.currentRender || !this.parentDomElement) {
            this.options.onUpdate?.(oldProps, this.currentProps, this);
            return;
        }
        const newRenderOutput = this.Render(this.currentProps, this);
        let newVNodeToPatch;
        if (Array.isArray(newRenderOutput)) {
            newVNodeToPatch = { tag: FRAGMENT_TAG, props: {}, children: newRenderOutput, dom: undefined };
        }
        else {
            newVNodeToPatch = newRenderOutput;
        }
        patch(this.currentRender, newVNodeToPatch, this.parentDomElement);
        this.currentRender = newVNodeToPatch;
        this.mountedDom = this.currentRender.dom;
        this.options.onUpdate?.(oldProps, this.currentProps, this);
    }
    unmount() {
        if (!this.mountedDom || !this.currentRender)
            return;
        this.options.onBeforeUnmount?.(this.mountedDom, this);
        this.children.forEach(child => child.unmount());
        unmountVNode(this.currentRender);
        this.options.onUnmount?.(this.mountedDom, this);
        this.mountedDom = undefined;
        this.currentRender = undefined;
        this.parentDomElement = undefined;
    }
    destroy() {
        this.unmount();
        this.children.forEach(child => child.destroy());
        this.children = [];
        this.parent = undefined;
        this.options.onDestroy?.(this);
    }
}
export class RootComp {
    constructor(options) {
        this.children = [];
        this.id = generateId("RootComp");
        this.options = { ...options };
        this.options.onInit?.(this);
    }
    Render() {
        const childVNodes = this.children.flatMap(child => {
            if ('currentRender' in child && child.currentRender) {
                const renderOutput = child.currentRender;
                return Array.isArray(renderOutput) ? renderOutput : [renderOutput];
            }
            if ('Render' in child && 'currentProps' in child) {
                const comp = child;
                const renderOutput = comp.Render(comp.currentProps, comp);
                return Array.isArray(renderOutput) ? renderOutput : [renderOutput];
            }
            return [];
        }).filter(vnode => vnode !== null && vnode !== undefined);
        return { tag: FRAGMENT_TAG, props: {}, children: childVNodes, dom: undefined };
    }
    mountTo(container) {
        if (this.mountedDom)
            return;
        this.parentDomElement = container;
        this.options.onBeforeMount?.(container, this);
        this.currentRender = this.Render();
        this.mountedDom = mount(this.currentRender, container);
        this.options.onMount?.(this.mountedDom, this);
        this.children.forEach(child => {
            if (!child.mountedDom) {
                child.mount(container);
            }
        });
    }
    mount(parentElement) {
        this.mountTo(parentElement);
    }
    addChild(child) {
        child.parent = this;
        this.children.push(child);
        if (this.mountedDom && this.parentDomElement) {
            if (!child.mountedDom) {
                child.mount(this.parentDomElement);
            }
            this.update();
        }
    }
    removeChild(child) {
        child.unmount();
        this.children = this.children.filter(c => c !== child);
        child.parent = undefined;
        if (this.mountedDom) {
            this.update();
        }
    }
    update() {
        this.children.forEach(child => {
            if ('Update' in child && typeof child.Update === 'function') {
                try {
                    child.Update({});
                }
                catch (e) {
                    console.warn(`Error calling Update on child component during RootComp.update:`, child, e);
                }
            }
        });
    }
    unmount() {
        if (!this.mountedDom || !this.currentRender)
            return;
        this.options.onBeforeUnmount?.(this.mountedDom, this);
        this.children.forEach(child => child.unmount());
        unmountVNode(this.currentRender);
        this.options.onUnmount?.(this.mountedDom, this);
        this.mountedDom = undefined;
        this.currentRender = undefined;
        this.parentDomElement = undefined;
    }
    destroy() {
        this.unmount();
        this.children.forEach(child => child.destroy());
        this.children = [];
        this.parent = undefined;
        this.options.onDestroy?.(this);
    }
}
export class PageComp extends Comp {
    constructor(parent, initialProps, options) {
        super(parent, initialProps, options);
        this.options = { ...options };
    }
    Render(props, component) {
        return { tag: FRAGMENT_TAG, props: {}, children: [], dom: undefined };
    }
}
export class ArrayComp extends Comp {
    constructor(parent, initialData, itemComponentFactory, options) {
        super(parent, initialData, options);
        this.itemComponentFactory = itemComponentFactory;
        this.dataToKey = options?.dataToKey;
        this.state = { itemComponents: [] };
        this.synchronizeItemComponents(initialData, true);
    }
    synchronizeItemComponents(newData, isInitialSync = false) {
        const oldItemComps = this.state.itemComponents;
        const newItemComps = [];
        const mountedParent = this.parentDomElement;
        const newCompsByKey = new Map();
        newData.forEach((itemData, index) => {
            const key = this.dataToKey ? this.dataToKey(itemData) : index;
            let comp = oldItemComps.find(c => {
                if (this.dataToKey && c.currentProps) {
                    try {
                        return this.dataToKey(c.currentProps) === key;
                    }
                    catch {
                        return false;
                    }
                }
                return false;
            });
            if (comp) {
                comp.Update(itemData);
            }
            else {
                comp = this.itemComponentFactory(this, itemData, index);
                if (mountedParent && !isInitialSync) {
                    comp.mount(mountedParent);
                }
            }
            newItemComps.push(comp);
            if (key !== undefined)
                newCompsByKey.set(key, comp);
        });
        oldItemComps.forEach(oldComp => {
            let key = undefined;
            if (this.dataToKey && oldComp.currentProps) {
                try {
                    key = this.dataToKey(oldComp.currentProps);
                }
                catch { }
            }
            if ((key === undefined || !newCompsByKey.has(key)) && !newItemComps.includes(oldComp)) {
                if (!isInitialSync) {
                    oldComp.destroy();
                }
            }
        });
        this.state.itemComponents = newItemComps;
        this.children = [...this.state.itemComponents];
    }
    Render() {
        return this.state.itemComponents.map(itemComp => {
            const renderOutput = itemComp.currentRender || itemComp.Render(itemComp.currentProps, itemComp);
            if (Array.isArray(renderOutput)) {
                console.warn("ArrayComp item rendered an array, wrapping in fragment.");
                return { tag: FRAGMENT_TAG, props: {}, children: renderOutput, dom: undefined };
            }
            return renderOutput;
        }).filter(vnode => vnode !== null && vnode !== undefined);
    }
    Update(newData) {
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
        const newVNodeToPatch = { tag: FRAGMENT_TAG, props: {}, children: newRenderOutput, dom: undefined };
        patch(this.currentRender, newVNodeToPatch, this.parentDomElement);
        this.currentRender = newVNodeToPatch;
        this.mountedDom = this.currentRender.dom;
        this.options.onUpdate?.(oldData, newData, this);
    }
    addChild(child) {
        if ('currentProps' in child && this.state?.itemComponents.includes(child)) {
            return; // Don't add duplicates
        }
        super.addChild(child);
    }
}
// Factory functions updated to use simplified lifecycle types
export function Component(parent, initialProps, renderFn, options) {
    class GenericComponent extends Comp {
        constructor() {
            super(parent, initialProps, options);
        }
        Render(props, component) {
            return renderFn(props, component);
        }
    }
    return new GenericComponent();
}
export function PageComponent(parent, initialProps, renderFn, options) {
    class GenericPageComponent extends PageComp {
        constructor() {
            super(parent, initialProps, options);
        }
        Render(props, component) {
            return renderFn(props, component);
        }
    }
    return new GenericPageComponent();
}
export function ArrayComponent(parent, initialData, itemRenderFn, options) {
    const itemFactory = (arrayCompInstance, data, index) => {
        return Component(arrayCompInstance, data, (props) => {
            return itemRenderFn(props, index, arrayCompInstance);
        });
    };
    return new ArrayComp(parent, initialData, itemFactory, options);
}
//# sourceMappingURL=component.js.map