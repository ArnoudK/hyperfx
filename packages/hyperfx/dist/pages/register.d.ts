import { PageComp } from "../reactive/component";
import { VNode } from "../elem/elem";
type routeItem = {
    path: string;
    route: RegExp;
    comp: PageComp<any, any>;
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
    currentPage: PageComp<any, any> | undefined;
    currentRoute: routeItem | undefined;
    currentVNode: VNode | undefined;
    queryParams: URLSearchParams;
    /**
     * Add a route with a custom component. Those will be loaded on page load or a softnavigate with navigateTo.
     * params can be added with [name] e.g.: '/mypage/[myparam]/info'
     */
    registerRoute(route: string, comp: PageComp<any, any>): this;
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
