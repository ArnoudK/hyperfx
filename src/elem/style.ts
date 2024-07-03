import type { GlobalAttr } from './attr';

export function Br(attributes: GlobalAttr) {
	const res = document.createElement('br');
	const attrs = Object.keys(attributes);
	for (const attr of attrs) {
		res.setAttribute(attr, attributes[attr as keyof GlobalAttr]!);
	}

	return res;
}
export function Hr(attributes: GlobalAttr) {
	const res = document.createElement('hr');
	const attrs = Object.keys(attributes);
	for (const attr of attrs) {
		res.setAttribute(attr, attributes[attr as keyof GlobalAttr]!);
	}

	return res;
}
