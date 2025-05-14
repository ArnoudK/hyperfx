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
    value: function (eventtype, listener) {
        this.addEventListener(eventtype, listener);
        return this;
    },
});
Object.defineProperty(Object.prototype, "With$HFX", {
    value: function (func) {
        func(this);
        return this;
    },
});
//# sourceMappingURL=index.js.map