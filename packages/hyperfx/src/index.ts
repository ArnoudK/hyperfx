// Core element attributes and types

//export * from "./elem/attr";

// HTML element helpers
//export * from "./elem/img";

// Direct DOM Component System
export * from "./reactive/component-dom.js";
export * from "./reactive/reactive-dom.js";
export * from "./reactive/state.js";
export * from "./reactive/context.js";
export * from "./reactive/reactive-dom.js";

// Effect Integration
export * from "./reactive/resource.js";
export * from "./reactive/resource-state.js";
export * from "./reactive/async-component.js";
export * from "./runtime/index.js";

// Direct DOM Routing System
export * from "./pages/router-components.js";
export * from "./pages/router-helpers.js";

// JSX Runtime for Direct DOM
export * from "./jsx/jsx-runtime.js";


// Control Flow Components
export * from "./jsx/control-flow.jsx";



// Additional features
export * from "./json_representation/hfx_object.js";
export * from "./ssr/index.js";

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