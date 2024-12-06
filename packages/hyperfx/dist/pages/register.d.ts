import { type WhateverPageComponent } from "../reactive/component";
type routeItem = {
    path: string;
    route: RegExp;
    comp: WhateverPageComponent;
    params: paramItem[];
};
type paramItem = {
    pos: number;
    name: string;
    value?: string;
};
export declare class PageRegister {
    Anchor: HTMLElement;
    routes: routeItem[];
    currentPage: WhateverPageComponent | undefined;
    currentRoute: routeItem | undefined;
    queryParams: URLSearchParams;
    /**
     * Add a route with a custom component. Those will be loaded on page load or a softnavigate with navigateTo.
     * params can be added with [name] e.g.: '/mypage/[myparam]/info'
     */
    registerRoute(route: string, comp: WhateverPageComponent): this;
    getParamValue(name: string): string | undefined;
    enable(): this;
    constructor(anchor: HTMLElement);
}
/**
 * Add a route with a custom component. Those will be loaded on page load or a softnavigate with navigateTo.
 * params can be added with [name] e.g.: '/mypage/[myparam]/info'
 */
export declare function RouteRegister(el: HTMLElement): PageRegister;
/** Get a param value from the current Route */
export declare function GetParamValue(name: string): string | undefined;
/** Get a query param (?name=value) value from the current url */
export declare function GetQueryValue(name: string): string | null;
/** Get an array[] with all query params that match the name (?name=value&name=otherValue) from the current url*/
export declare function GetQueryValues(name: string): string[];
export {};
//# sourceMappingURL=register.d.ts.map