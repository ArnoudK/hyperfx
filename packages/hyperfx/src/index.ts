// Core element attributes and types

//export * from "./elem/attr";

// HTML element helpers
//export * from "./elem/img";

// Direct DOM Component System
export * from "./reactive/component-dom";
export * from "./reactive/reactive-dom";
export * from "./reactive/state";
export * from "./reactive/context";
export * from "./reactive/reactive-dom";

// Effect Integration
export * from "./reactive/resource";
export * from "./reactive/resource-state";
export * from "./reactive/async-component";
export * from "./runtime";

// Direct DOM Routing System
export * from "./pages/router-components";
export * from "./pages/router-helpers";

// JSX Runtime for Direct DOM
export * from "./jsx/jsx-runtime";


// Control Flow Components
export * from "./jsx/control-flow";



// Additional features
export * from "./json_representation/hfx_object";
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