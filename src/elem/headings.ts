import type { GlobalAttr } from './attr';

type heads = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

function Head(t: heads, attributes: GlobalAttr, children: Text[]) {
	const res = document.createElement(t);
	const attrs = Object.keys(attributes);

	for (const attr of attrs) {
		res.setAttribute(attr, attributes[attr as keyof GlobalAttr]!);
	}
	for (const child of children) {
		res.appendChild(child);
	}
	return res;
}

export const H1 = (attributes: GlobalAttr, children: Text[]) =>
	Head('h1', attributes, children);

export const H2 = (attributes: GlobalAttr, children: Text[]) =>
	Head('h2', attributes, children);

export const H3 = (attributes: GlobalAttr, children: Text[]) =>
	Head('h3', attributes, children);

export const H4 = (attributes: GlobalAttr, children: Text[]) =>
	Head('h4', attributes, children);

export const H5 = (attributes: GlobalAttr, children: Text[]) =>
	Head('h5', attributes, children);

export const H6 = (attributes: GlobalAttr, children: Text[]) =>
	Head('h6', attributes, children);
