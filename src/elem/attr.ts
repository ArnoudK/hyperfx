type Name = { name: string };

type Context = { content: string };

export type MetaAttribute = Name | Context;

/** See: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#lang */
type Lang = { lang: string };

export type targetValues =
	| '_self'
	| '_blank'
	| '_parent'
	| '_top'
	| '_unfencedTop';

export type HtmlAtrribute = Lang;
/** See: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
 * These are used on almost all elements allowed in the body
 */
type globalAttrs = {
	/**  See https://webaim.org/techniques/keyboard/accesskey#spec */
	accesskey: string;
	autocapitalize:
		| 'none'
		| 'off'
		| 'sentences'
		| 'on'
		| 'words'
		| 'characters';
	autofocus: 'autofocus';
	class: string;
	contenteditable: 'true' | 'false' | 'plaintext-only';
	/**  content direction */
	dir: 'ltr' | 'rtl' | 'auto';
	draggable: 'true' | 'false';
	enterkeyhint:
		| 'enter'
		| 'done'
		| 'go'
		| 'next'
		| 'previous'
		| 'search'
		| 'send';
	exportparts: string;
	hidden: '' | 'hidden' | 'until-found';
	id: string;
	inert: 'inert';
	inputmode:
		| 'none'
		| 'text'
		| 'decimal'
		| 'numeric'
		| 'tel'
		| 'search'
		| 'email'
		| 'url';
	/**  https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is */
	is: string;
	/**  https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemid */
	itemid: string;
	/** https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop */
	itemprop: string;
	itemref: string;
	itemscope: string;
	itemtype: string;
	lang: string;
	nonce: string;
	part: string;
	popover: string;
	role: string;
	slot: string;
	spellcheck: '' | 'true' | 'false';
	style: string;
	/** For now just -1 and 0 
    https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex */
	tabindex: '-1' | '0';
	title: string;
	/** Prevent translation (such as Google translate). Should only be used for names
    https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate */
	translate: '' | 'yes' | 'no';
	/**  https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/virtualkeyboardpolicy */
	virtualkeyboardpolicy: '' | 'auto' | 'manual';
};

export type GlobalAttr = Partial<globalAttrs>;
