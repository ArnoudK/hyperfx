import type { GlobalAttr, HtmlAtrribute } from './attr';

type BodyChild = HTMLDivElement | HTMLSpanElement | HTMLParagraphElement;

export function Div(attributes: GlobalAttr, children: BodyChild[]) {
	const res = document.createElement('div');
	const attrs = Object.keys(attributes);
	for (const attr of attrs) {
		res.setAttribute(attr, attributes[attr as keyof GlobalAttr]!);
	}

	for (const child of children) {
		res.appendChild(child);
	}

	return res;
}

/** Render text (the text content inside a tag): */
export const t = (t: string) => document.createTextNode(t);

export const RenderToBody = (el: HTMLElement) => document.body.appendChild(el);
