import { type WhateverPageComponent } from "../reactive/component";
import { navigateTo } from "./navigate";

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

export class PageRegister {
  public Anchor: HTMLElement;
  public routes: routeItem[];

  public currentPage: WhateverPageComponent | undefined;
  public currentRoute: routeItem | undefined;
  /**
   * Add a route with a custom component. Those will be loaded on page load or a softnavigate with navigateTo.
   * params can be added with [name] e.g.: '/mypage/[myparam]/info'
   */
  public registerRoute(route: string, comp: WhateverPageComponent) {
    const routesplit = route.split("/");
    let resultStr = "";

    const params: paramItem[] = [];

    const splitLen = routesplit.length;
    if (splitLen == 0 || route == "/") {
      resultStr = "/";
    } else {
      for (let i = 0; i < splitLen; i++) {
        const s = routesplit[i];
        if (!s || s.length == 0) {
          continue;
        }
        if (s[0] == "[" && s[s.length - 1] == "]") {
          const name = s.split("[")[1]!.split("]")[0];
          const nparam = {
            name: name!,
            pos: i,
          } satisfies paramItem;
          params.push(nparam);
          resultStr += `\/[A-Za-z1-9_\\-]+`;

          continue;
        }
        resultStr += `\/${s}`;
      }
    }
    const routeI = {
      comp: comp,
      params: params,
      path: route,
      route: new RegExp(resultStr),
    } satisfies routeItem;
    if (this.routes.find((a) => a.route == routeI.route)) {
      throw new Error(
        `Route already exist '${route}'.\nRegex: '${routeI.route.source}'\nRouteData: ${JSON.stringify(routeI)}`
      );
    }

    this.routes.push(routeI);
    return this;
  }

  public getParamValue(name: string) {
    if (this.currentRoute) {
      for (const p of this.currentRoute.params) {
        if (p.name == name) {
          return p.value;
        }
      }
    }
  }

  public enable() {
    // TODO not populate the window space (with this prefix it should really matter)
    (window as any).__$HFX__Register = this;
    window.addEventListener("popstate", onPageChange);
    onPageChange();
    return this;
  }

  public constructor(anchor: HTMLElement) {
    this.Anchor = anchor;
    this.routes = [];
  }
}

/**
 * Add a route with a custom component. Those will be loaded on page load or a softnavigate with navigateTo.
 * params can be added with [name] e.g.: '/mypage/[myparam]/info'
 */
export function RouteRegister(el: HTMLElement) {
  return new PageRegister(el);
}

function onPageChange() {
  const reg: PageRegister = (window as any).__$HFX__Register;

  // reset the current values
  reg.currentPage = undefined;

  if (reg.currentRoute) {
    reg.currentRoute.comp.removeAllChildren();
    for (const p of reg.currentRoute.params) {
      p.value = undefined;
    }
  }
  reg.currentRoute = undefined;

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

export function GetParamValue(name: string) {
  const reg: PageRegister = (window as any).__$HFX__Register;
  if (reg) {
    return reg.getParamValue(name);
  }
  return undefined;
}
