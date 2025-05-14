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
declare global {
    interface HTMLElement {
        /** Add an event listener and return the Element */
        WithEvent$HFX<K extends keyof HTMLElementEventMap>(eventtype: K, listener: (ev: HTMLElementEventMap[K]) => void): this;
    }
    interface Object {
        With$HFX<T extends Object>(this: T, run: (obj: T) => void): T;
    }
}
