import { RenderToBody, Div, t } from './elem/elem';
import { P, Span, A, Abbr, B, Bdi, Bdo, Cite, I } from './elem/text';
import { H1, H2, H3, H4, H5, H6 } from './elem/headings';
import { Hr, Br } from './elem/style';
import { Img } from './elem/img';
import { Input } from './elem/input';
import { Article, Address, Aside, Button } from './elem/semantic';

import { Component, RootComp, PageComponent } from './reactive/component';

import { WithEventListener } from './reactive/event';

import { navigateTo } from './pages/navigate';

import { PageRegister } from './pages/register';

import { fetcher } from './fetcher';

export {
	/* HTML Tags */
	A,
	Abbr,
	Address,
	Article,
	Aside,
	B,
	Bdi,
	Bdo,
	Button,
	Br,
	Cite,
	Div,
	H1,
	H2,
	H3,
	H4,
	H5,
	H6,
	Hr,
	I,
	Img,
	Input,
	P,
	t,
	Span,

	/* Other DOM stuff */
	RenderToBody,

	/* Reactive stuff */
	WithEventListener,

	/* Components */
	Component,
	RootComp,
	PageComponent,

	/* Routing */
	navigateTo as pushUrl,
	PageRegister,

	/* fetcher */
	fetcher,
};
