export * from "./elem/attr";
export * from "./elem/img";
export { createComponent, ClassComponent, mountComponent, unmountComponent, forwardRef } from "./reactive/component-dom";
export { bindAttribute, bindStyle, bindClass, bindCSSVariable, bindEvent, ReactiveList, ReactiveIf, bindTwoWay, reactiveTemplate, batchDOMUpdates, debounceDOMUpdate, measureReactivePerformance, createReactiveComponent } from "./reactive/reactive-dom";
export * from "./reactive/state";
export * from "./reactive/reactive-dom";
export * from "./pages/router-components";
export { jsx, jsxs, jsxDEV, createElement, Fragment, r } from "./jsx/jsx-runtime";
export { JSX } from "./jsx/jsx-runtime";
export { For, Index, Show, Switch, Match } from "./jsx/control-flow";
export * from "./fetcher";
export * from "./json_representation/hfx_object";
export * from "./performance/optimizations";
export * from "./animation/transitions";
export * from "./dev/dev-tools";
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
