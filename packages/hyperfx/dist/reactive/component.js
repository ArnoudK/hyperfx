import { morph } from "./morphing";
/** Component lifecycle state */
export var ComponentState;
(function (ComponentState) {
    ComponentState["Created"] = "created";
    ComponentState["Mounted"] = "mounted";
    ComponentState["Updated"] = "updated";
    ComponentState["Unmounted"] = "unmounted";
})(ComponentState || (ComponentState = {}));
class Comp {
    getParent() {
        return this.parent;
    }
    getState() {
        return this.state;
    }
    addCleanup(fn) {
        this.cleanupFns.push(fn);
        return this;
    }
    Update(newData) {
        this.data = newData;
        this.Render(true);
    }
    getChildren() {
        return [...this.childComps];
    }
    addChild(c) {
        if (c === this) {
            throw new Error("Cannot add component as child of itself");
        }
        this.childComps.push(c);
        if (this.state === ComponentState.Mounted) {
            this.mountChild(c);
        }
    }
    mountChild(c) {
        if (c instanceof Comp) {
            c.state = ComponentState.Mounted;
        }
    }
    removeChild(c) {
        this.childComps = this.childComps.filter((ch) => ch !== c);
        c.dispose();
    }
    Render(force = false) {
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
    constructor(parent, data, render) {
        this.state = ComponentState.Created;
        this.cleanupFns = [];
        this.childComps = [];
        this.changed = true;
        this.render = render;
        this.data = data;
        this.parent = parent;
        this.currentRender = this.render(this.data, this);
    }
    dispose() {
        this.childComps.forEach(c => c.dispose());
        this.childComps = [];
        this.cleanupFns.forEach(fn => fn());
        this.state = ComponentState.Unmounted;
    }
}
class RootComp extends Comp {
    constructor() {
        super(undefined, {}, () => document.body);
        this.parent = this;
        window.addEventListener('unload', () => this.dispose());
    }
}
const root_comp = new RootComp();
export const RootComponent = () => root_comp;
export function Component(parent, data, render) {
    const comp = new Comp(parent, data, render);
    parent.addChild(comp);
    return comp;
}
export class PageComp extends Comp {
    removeAllChildren() {
        [...this.childComps].forEach(child => this.removeChild(child));
    }
    OnPageLoad() {
        this.pageLoadCallback(this.data, this);
    }
    constructor(parent, data, render, onPageLoad) {
        super(parent, data, render);
        this.pageLoadCallback = onPageLoad;
    }
}
/**
 * Create a new page component
 */
export function PageComponent(parent, data, render, onPageLoad) {
    const comp = new PageComp(parent, data, render, onPageLoad);
    parent.addChild(comp);
    return comp;
}
//# sourceMappingURL=component.js.map