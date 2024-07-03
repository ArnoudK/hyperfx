import { type WhateverPageComponent } from '../reactive/component';

type routeItem = {
	path: string;
	route: RegExp;
	comp: WhateverPageComponent;
	params: paramItem[];
};

type paramItem = {
	type: 'int' | 'string';
	pos: number;
	name: string;
	value?: number | string;
};

export class PageRegister {
	public Anchor: HTMLElement;
	public routes: routeItem[] = [];

	public currentPage: WhateverPageComponent | undefined;

	/* */
	public registerRoute(route: string, comp: WhateverPageComponent) {
		const routesplit = route.split('/');
		let resultStr = '';

		const params: paramItem[] = [];

		const splitLen = routesplit.length;
		if (splitLen == 0 || route == '/') {
			resultStr = '/';
		} else {
			for (let i = 0; i < splitLen; i++) {
				const s = routesplit[i];
				if (s.length == 0) {
					continue;
				}
				if (s[0] == '[' && s[length - 1] == ']') {
					if (s.endsWith(':int]')) {
						const name = s
							.split('[')[1]
							.split(':int]')[0];
						const nparam = {
							name: name,
							pos: i,
							type: 'int',
						} satisfies paramItem;
						params.push(nparam);
						resultStr += /\/\d+/;
					} else {
						const name = s
							.split('[')[1]
							.split(':string]')[0];
						const nparam = {
							name: name,
							pos: i,
							type: 'string',
						} satisfies paramItem;
						params.push(nparam);
						resultStr += /\/(\d|\w)+/;
					}
				} else {
					resultStr += `\/${s}`;
				}
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
				`Route already exist '${route}'.\nRegex: '${routeI.route.source}'\nRouteData: ${JSON.stringify(routeI)}`,
			);
		}

		this.routes.push(routeI);

		return this;
	}

	public enable() {
		window.addEventListener('popstate', () => {
			if (this.currentPage) {
				this.currentPage.currentRender = undefined;
			}
			const url = window.location.pathname;
			for (const r of this.routes) {
				const match = url.match(r.route);
				if (match && match[0].length >= url.length) {
					const splits = url.split('/');
					for (const p of r.params) {
						p.value = splits[p.pos];
					}
					r.comp.OnPageLoad();
					this.Anchor.replaceChildren(
						r.comp.Render(),
					);
					this.currentPage = r.comp;
					break;
				}
			}
		});
	}

	public constructor(anchor: HTMLElement) {
		this.Anchor = anchor;
	}
}
