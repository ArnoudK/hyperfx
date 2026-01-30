export * from "./reactive/component-dom";
export * from "./reactive/reactive-dom";
export * from "./reactive/state";
export * from "./reactive/context";
export * from "./reactive/reactive-dom";
export * from "./reactive/resource";
export * from "./reactive/resource-state";
export * from "./reactive/async-component";
export * from "./runtime";
export * from "./pages/router-components";
export * from "./pages/router-helpers";
export * from "./jsx/jsx-runtime";
export * from "./jsx/control-flow";
export * from "./json_representation/hfx_object";
export * from "./ssr";
declare global {
    interface HTMLElement {
        /** Add an event listener and return the Element */
        WithEvent$HFX<K extends keyof HTMLElementEventMap>(eventtype: K, listener: (ev: HTMLElementEventMap[K]) => void): this;
    }
    interface Object {
        With$HFX<T extends Object>(this: T, run: (obj: T) => void): T;
    }
}
