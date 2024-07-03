/* Elements that should be inside the head */

import type { targetValues } from './attr';

type BaseAttrOpt = {
	href: string;
	target: targetValues;
};

type BaseAttr = Partial<BaseAttrOpt> &
	(Pick<BaseAttrOpt, 'href'> | Pick<BaseAttrOpt, 'target'>);
/**
 * Must be inside <head>
 * If used there should only be 1 inside the document
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base
 * The <base> HTML element specifies the base URL to use for all relative URLs in a document. There can be only one <base> element in a document.
 *
 *A document's used base URL can be accessed by scripts with Node.baseURI. If the document has no <base> elements, then baseURI defaults to location.href.
 */
function Base(attr: BaseAttr) {
	const b = document.createElement('base');
	if (attr.href) b.setAttribute('href', attr.href);
	if (attr.target) b.setAttribute('target', attr.target);
	return b;
}
