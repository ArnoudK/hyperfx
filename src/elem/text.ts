import { navigateTo } from '../pages/navigate';
import type { GlobalAttr, targetValues } from './attr';
import { t } from './elem';
/** 
    * this file is for Elements with phrasing content that should have text as children
    * Phrasing context:  https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#phrasing_content
    But only the ones that are not just semantic divs
    */

export function Span(attributes: GlobalAttr, text: string) {
	const res = document.createElement('span');
	const attrs = Object.keys(attributes);
	for (const attr of attrs) {
		res.setAttribute(attr, attributes[attr as keyof GlobalAttr]!);
	}
	res.appendChild(t(text));
	return res;
}
type TextChild = Text | HTMLElement;

export function P(attributes: GlobalAttr, children: TextChild[]) {
	const res = document.createElement('p');
	const attrs = Object.keys(attributes);

	for (const attr of attrs) {
		res.setAttribute(attr, attributes[attr as keyof GlobalAttr]!);
	}
	for (const child of children) {
		res.appendChild(child);
	}
	return res;
}

export function Abbr(attributes: GlobalAttr, children: Text[]) {
	const res = document.createElement('abbr');
	const attrs = Object.keys(attributes);

	for (const attr of attrs) {
		res.setAttribute(attr, attributes[attr as keyof GlobalAttr]!);
	}
	for (const child of children) {
		res.appendChild(child);
	}
	return res;
}

type anchorAttr = Partial<GlobalAttr> & {
	href: string;
	target?: targetValues;
	download?: 'download';
	filename?: string;
	hreflang?: string;
	ping?: string;
	referrerpolicy?:
		| 'no-referrer'
		| 'no-referrer-when-downgrade'
		| 'origin'
		| 'origin-when-cross-origin'
		| 'same-origin'
		| 'strict-origin'
		| 'strict-origin-when-cross-origin'
		| 'unsafe-url';
	rel?: string;
};

export function A(attributes: anchorAttr, children: TextChild[]) {
	const res = document.createElement('a');
	const attrs = Object.keys(attributes);

	for (const attr of attrs) {
		res.setAttribute(attr, attributes[attr as keyof GlobalAttr]!);
	}
	for (const child of children) {
		res.appendChild(child);
	}

	if (attributes.href[0] == '/') {
		res.addEventListener('click', (ev) => {
			navigateTo((ev.target as HTMLAnchorElement).href);
			ev.preventDefault();
			return false;
		});
	}
	return res;
}

export function B(attributes: GlobalAttr, children: Text[]) {
	const res = document.createElement('b');
	const attrs = Object.keys(attributes);

	for (const attr of attrs) {
		res.setAttribute(attr, attributes[attr as keyof GlobalAttr]!);
	}
	for (const child of children) {
		res.appendChild(child);
	}
	return res;
}

export function Bdi(attributes: GlobalAttr, children: Text[]) {
	const res = document.createElement('bdi');
	const attrs = Object.keys(attributes);

	for (const attr of attrs) {
		res.setAttribute(attr, attributes[attr as keyof GlobalAttr]!);
	}
	for (const child of children) {
		res.appendChild(child);
	}
	return res;
}

export function Bdo(attributes: GlobalAttr, children: Text[]) {
	const res = document.createElement('bdo');
	const attrs = Object.keys(attributes);

	for (const attr of attrs) {
		res.setAttribute(attr, attributes[attr as keyof GlobalAttr]!);
	}
	for (const child of children) {
		res.appendChild(child);
	}
	return res;
}

export function I(attributes: GlobalAttr, children: Text[]) {
	const res = document.createElement('bdo');
	const attrs = Object.keys(attributes);

	for (const attr of attrs) {
		res.setAttribute(attr, attributes[attr as keyof GlobalAttr]!);
	}
	for (const child of children) {
		res.appendChild(child);
	}
	return res;
}

export function Cite(attributes: GlobalAttr, children: TextChild[]) {
	const res = document.createElement('bdo');
	const attrs = Object.keys(attributes);

	for (const attr of attrs) {
		res.setAttribute(attr, attributes[attr as keyof GlobalAttr]!);
	}
	for (const child of children) {
		res.appendChild(child);
	}
	return res;
}
