import { navigateTo } from "./navigate";
export class PageRegister {
    /**
     * Add a route with a custom component. Those will be loaded on page load or a softnavigate with navigateTo.
     * params can be added with [name] e.g.: '/mypage/[myparam]/info'
     */
    registerRoute(route, comp) {
        const routesplit = route.split("/");
        let resultStr = "";
        const params = [];
        const splitLen = routesplit.length;
        if (splitLen == 0 || route == "/") {
            resultStr = "/";
        }
        else {
            for (let i = 0; i < splitLen; i++) {
                const s = routesplit[i];
                if (!s || s.length == 0) {
                    continue;
                }
                if (s[0] == "[" && s[s.length - 1] == "]") {
                    const name = s.split("[")[1].split("]")[0];
                    const nparam = {
                        name: name,
                        pos: i,
                    };
                    params.push(nparam);
                    resultStr += `\/[A-Za-z1-9_\\-]+`;
                    continue;
                }
                resultStr += "/" + s;
            }
        }
        const routeI = {
            comp: comp,
            params: params,
            path: route,
            route: new RegExp(resultStr),
        };
        if (this.routes.find((a) => a.route == routeI.route)) {
            throw new Error(`Route already exist '${route}'.\nRegex: '${routeI.route.source}'\nRouteData: ${JSON.stringify(routeI)}`);
        }
        this.routes.push(routeI);
        return this;
    }
    getParamValue(name) {
        if (this.currentRoute) {
            for (const p of this.currentRoute.params) {
                if (p.name == name) {
                    return p.value;
                }
            }
        }
    }
    enable() {
        // TODO not populate the window space (with this prefix it should really matter)
        window.__$HFX__Register = this;
        window.addEventListener("popstate", onPageChange);
        onPageChange();
        return this;
    }
    constructor(anchor) {
        this.Anchor = anchor;
        this.routes = [];
        this.queryParams = new URLSearchParams(window.location.search);
    }
}
/**
 * Add a route with a custom component. Those will be loaded on page load or a softnavigate with navigateTo.
 * params can be added with [name] e.g.: '/mypage/[myparam]/info'
 */
export function RouteRegister(el) {
    return new PageRegister(el);
}
function onPageChange() {
    const reg = window.__$HFX__Register;
    // reset the current values
    reg.currentPage = undefined;
    if (reg.currentRoute) {
        reg.currentRoute.comp.removeAllChildren();
        for (const p of reg.currentRoute.params) {
            p.value = undefined;
        }
    }
    reg.currentRoute = undefined;
    reg.queryParams = new URLSearchParams(window.location.search);
    let url = window.location.pathname;
    // take care of trailing /
    if (url.length > 1 && url.at(-1) == "/") {
        url = url.slice(0, url.length - 1);
    }
    // load the current page
    for (const r of reg.routes) {
        const match = url.match(r.route);
        reg.currentRoute = r;
        if (match && match[0].length >= url.length) {
            const splits = url.split("/");
            for (const p of r.params) {
                p.value = splits[p.pos];
            }
            r.comp.OnPageLoad();
            reg.Anchor.replaceChildren(r.comp.Render(true));
            reg.currentPage = r.comp;
            return;
        }
    }
    // nothing found => 404 page
    if (url.startsWith("/404") || url.startsWith("404")) {
        return;
    }
    navigateTo(`/404?page=${url}`);
}
/** Get a param value from the current Route */
export function GetParamValue(name) {
    const reg = window.__$HFX__Register;
    if (reg) {
        return reg.getParamValue(name);
    }
    return undefined;
}
/** Get a query param (?name=value) value from the current url */
export function GetQueryValue(name) {
    const reg = window.__$HFX__Register;
    if (reg) {
        return reg.queryParams.get(name);
    }
    return null;
}
/** Get an array[] with all query params that match the name (?name=value&name=otherValue) from the current url*/
export function GetQueryValues(name) {
    const reg = window.__$HFX__Register;
    if (reg) {
        return reg.queryParams.getAll(name);
    }
    return [];
}
//# sourceMappingURL=register.js.map