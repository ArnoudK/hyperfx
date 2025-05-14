export * from "./elem/elem";
export * from "./elem/headings";
export * from "./elem/img";
export * from "./elem/input";
export * from "./elem/style";
export * from "./elem/text";
export * from "./elem/head";
export * from "./elem/table";
export * from "./elem/semantic";
export * from "./reactive/component";
export * from "./pages/navigate";
export * from "./pages/register";
export * from "./fetcher";
export * from "./json_representation/hfx_object";

/* Extension methods */

Object.defineProperty(HTMLElement.prototype, "WithEvent$HFX", {
  value: function <T extends HTMLElement, K extends keyof HTMLElementEventMap>(
    this: T,
    eventtype: K,
    listener: (ev: HTMLElementEventMap[K]) => void
  ) {
    this.addEventListener(eventtype, listener);
    return this;
  },
});

Object.defineProperty(Object.prototype, "With$HFX", {
  value: function <T extends Object>(this: T, func: (obj: T) => void) {
    func(this);
    return this;
  },
});

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