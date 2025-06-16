export * from "./elem/attr";
export * from "./elem/elem";
export * from "./elem/reactive";
export * from "./elem/keyed-list";
export * from "./elem/control-flow";
export * from "./elem/headings";
export * from "./elem/img";
export * from "./elem/input";
export * from "./elem/text";
export * from "./elem/style";
export * from "./elem/head";
export * from "./elem/table";
export * from "./elem/semantic";
export * from "./reactive/component";
export * from "./reactive/state";
export * from "./pages/navigate";
export * from "./pages/register";
export * from "./pages/router";
export * from "./fetcher";
export * from "./json_representation/hfx_object";
export * from "./performance/optimizations";
export * from "./animation/transitions";
export * from "./dev/dev-tools";
export * from "./ssr";
export { jsx, jsxs, jsxDEV, createElement as jsxCreateElement, Fragment as JSXFragment } from "./jsx/jsx-runtime";
export { ReactiveList } from "./jsx/reactive-list";
export { For } from "./jsx/for";
export { reactive } from "./jsx/reactive-helper";
export { RouterLink } from "./jsx/router-link";
export { JSX } from "./jsx/jsx-runtime";
declare global {
    interface HTMLElement {
        /** Add an event listener and return the Element */
        WithEvent$HFX<K extends keyof HTMLElementEventMap>(eventtype: K, listener: (ev: HTMLElementEventMap[K]) => void): this;
    }
    interface Object {
        With$HFX<T extends Object>(this: T, run: (obj: T) => void): T;
    }
}
