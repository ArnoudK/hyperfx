// Core element attributes and types
export * from "./elem/attr";

// HTML element helpers
export * from "./elem/img";

// Direct DOM Component System
export { createComponent, ClassComponent, mountComponent, unmountComponent, forwardRef } from "./reactive/component-dom";
export { bindAttribute, bindStyle, bindClass, bindCSSVariable, bindEvent, ReactiveList, ReactiveIf, bindTwoWay, reactiveTemplate, batchDOMUpdates, debounceDOMUpdate, measureReactivePerformance, createReactiveComponent } from "./reactive/reactive-dom";
export * from "./reactive/state";
export * from "./reactive/reactive-dom";

// Direct DOM Routing System
export * from "./pages/router-components";

// JSX Runtime for Direct DOM
export { jsx, jsxs, jsxDEV, createElement, Fragment, r } from "./jsx/jsx-runtime";
export { JSX } from "./jsx/jsx-runtime";

// Control Flow Components
export { For, Index, Show, Switch, Match } from "./jsx/control-flow";



// Additional features
export * from "./fetcher";
export * from "./json_representation/hfx_object";
export * from "./performance/optimizations";
export * from "./animation/transitions";
export * from "./dev/dev-tools";
export * from "./ssr";

/* Extension methods */

declare global {
  interface HTMLElement {
    /** Add an event listener and return the Element */
    WithEvent$HFX<K extends keyof HTMLElementEventMap>(
      eventtype: K,
      listener: (ev: HTMLElementEventMap[K]) => void
    ): this;
  }
  interface Object {
    With$HFX<T extends Object>(this: T, run: (obj: T) => void): T;
  }
}