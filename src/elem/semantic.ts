import type { GlobalAttr } from './attr';

export function Address(attributes: GlobalAttr, children: HTMLElement[]) {
	const res = document.createElement('address');
	const attrs = Object.keys(attributes);
	for (const attr of attrs) {
		res.setAttribute(attr, attributes[attr as keyof GlobalAttr]!);
	}

	for (const child of children) {
		res.appendChild(child);
	}

	return res;
}

/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article */
export function Article(attributes: GlobalAttr, children: HTMLElement[]) {
	const res = document.createElement('article');
	const attrs = Object.keys(attributes);
	for (const attr of attrs) {
		res.setAttribute(attr, attributes[attr as keyof GlobalAttr]!);
	}

	for (const child of children) {
		res.appendChild(child);
	}

	return res;
}

/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside */
export function Aside(attributes: GlobalAttr, children: HTMLElement[]) {
	const res = document.createElement('aside');
	const attrs = Object.keys(attributes);
	for (const attr of attrs) {
		res.setAttribute(attr, attributes[attr as keyof GlobalAttr]!);
	}

	for (const child of children) {
		res.appendChild(child);
	}

	return res;
}

export function Button(attributes: GlobalAttr, children: HTMLElement[]) {}
