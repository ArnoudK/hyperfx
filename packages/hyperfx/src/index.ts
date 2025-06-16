export * from "./elem/attr"; // Exports ElementAttributes (priority)
export * from "./elem/elem";
export * from "./elem/reactive"; // Export reactive helpers
export * from "./elem/keyed-list"; // Export keyed list utilities
export * from "./elem/control-flow"; // Export control flow components

export * from "./elem/headings";
export * from "./elem/img";
export * from "./elem/input";

export * from "./elem/text"; // Exports Br (priority)
export * from "./elem/style";

export * from "./elem/head";
export * from "./elem/table";
export * from "./elem/semantic";
export * from "./reactive/component";
export * from "./reactive/state";
export * from "./pages/navigate";
export * from "./pages/register";
export * from "./pages/router"; // Export the new router
export * from "./fetcher";
export * from "./json_representation/hfx_object";

// Performance and optimization exports
export * from "./performance/optimizations";

// Animation and transition exports
export * from "./animation/transitions";

// Development tools (only in development)
export * from "./dev/dev-tools";

// Server-Side Rendering (SSR) exports
export * from "./ssr";

// JSX Runtime exports (explicit re-exports to avoid conflicts)
export { jsx, jsxs, jsxDEV, createElement as jsxCreateElement, Fragment as JSXFragment } from "./jsx/jsx-runtime";
export { ReactiveList } from "./jsx/reactive-list";
export { For } from "./jsx/for";
export { reactive } from "./jsx/reactive-helper";
export { RouterLink } from "./jsx/router-link";

// Template literal helpers (available from both elem and jsx)
export { template as jsxTemplate, r } from "./jsx/jsx-runtime";
export { template, t } from "./elem/elem";

// Export JSX namespace for TypeScript
export { JSX } from "./jsx/jsx-runtime";

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