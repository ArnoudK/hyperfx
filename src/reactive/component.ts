import morphdom from 'morphdom';

export type WhateverComponent = Comp<any>;

class Comp<K extends any> {
	render: (data: K, comp: Comp<K>) => HTMLElement;
	childComps: WhateverComponent[] = [];
	protected parent: WhateverComponent;
	protected data: K;

	public getParent() {
		return this.parent;
	}

	/**
	 * Usefull when updating before the component needs to be rendered!
	 */
	public UpdateNoRender(data: K) {
		this.data = data;
	}

	public Update(newData: K) {
		this.data = newData;
		this.Render();
	}

	/** The current dom element*/
	public currentRender: HTMLElement | undefined;

	/** Get a (shallow) copy of the array of children */
	public getChildren() {
		return [...this.childComps];
	}

	/** Returns the child */
	public addChild(c: WhateverComponent) {
		//@ts-ignore
		if (c == this) {
			throw Error("Can't add yourself as a child!?");
		}
		this.childComps.push(c);
	}
	public removeChild(c: WhateverComponent) {
		this.childComps = this.childComps.filter((ch) => c != ch);
	}

	public Render() {
		const newR = this.render(this.data, this);

		if (this.currentRender) {
			// TODO make own morp function
			morphdom(this.currentRender, newR, {});

			return this.currentRender;
		}
		this.currentRender = newR;
		return newR;
	}

	constructor(
		parent: WhateverComponent,
		data: K,
		render: (data: K, comp: Comp<K>) => HTMLElement
	) {
		this.render = render;
		this.data = data;

		this.parent = parent;

		/* effect will always be run when created so it will create the render */
		this.Render();
	}
}

export class RootComp extends Comp<undefined> {
	constructor() {
		super({} as any, undefined, () => {
			// hacky method that works because the Root render does nothing and is equal the the previous render
			return document.body;
		});
		this.parent = this as WhateverComponent;
	}
}

/** A component can be used to Bind a Value to a Render */
export function Component<K extends any>(
	parent: WhateverComponent,
	data: K,
	render: (data: K, comp: Comp<K>) => HTMLElement
) {
	const comp = new Comp(parent, data, render);

	return comp;
}

export type WhateverPageComponent = PageComponent<any>;
/**
 *
 * @param pageLoad Function is called when the route-path and matches the route this registered with in the 'pagehandler'. NOTE WHEN USING .Update ON COMPONENT IT WILL RENDER!!! (if you do so use no render)
 */
export class PageComponent<K extends any> extends Comp<K> {
	onPageLoad: (data: K, comp: PageComponent<K>) => void;

	public renderOnLoad: boolean;

	OnPageLoad() {
		this.onPageLoad(this.data, this);

		if (this.renderOnLoad) {
			this.Render();
		}
	}

	public constructor(
		parent: WhateverComponent,
		data: K,
		render: (data: K, comp: Comp<K>) => HTMLElement,
		onPageLoad: (data: K, comp: PageComponent<K>) => void,
		renderOnLoad: boolean = true
	) {
		super(parent, data, render);
		this.onPageLoad = onPageLoad;
		this.renderOnLoad = renderOnLoad;
	}
}
