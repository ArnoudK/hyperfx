import jsdom from 'jsdom';
const { JSDOM } = jsdom;
const dom = new JSDOM(`<html><head></head><body></body></html>`, {
	runScripts: 'outside-only',
	storageQuota: 10000000,
	includeNodeLocations: true,
});
const doc = dom.window.document;
// we need to set document as a var (otherwise the elements will cry when they are created)
global.document = doc;
global.window = doc.defaultView!;
global.HTMLElement = window.HTMLElement;
import {
	Article,
	Div,
	P,
	Span,
	t,
	Img,
	WithEventListener,
	A,
	RootComp,
	Component,
} from '../src/index';
import { equal } from 'assert';
const start = Date.now();

type testType = { kek: string };

async function make_test_object1() {
	const root = new RootComp();
	let data: testType = { kek: 'brap' };
	const parentNode = document.createElement('div');
	const c = Component(root, data, (d: testType) => {
		return Div({ class: 'kekw' }, [
			P({ class: 'text-xl' }, [
				t('(Text from T)'),
				Span({}, ' -SPAN- '),
				t('(more T text)'),
			]),
			Article({ class: 'kek' }, [
				Img({
					src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/330px-Firefox_logo%2C_2019.svg.png',
					alt: 'Firefox logo',
					style: 'width: 100px; height: 100%',
				}),
			]),
			WithEventListener(
				A({ href: 'kek' }, [t(d.kek)]),
				'click',
				(e) => {},
			),
		]);
	});
	parentNode.appendChild(c.currentRender!);

	c.Update({ kek: 'kekw' });
	// we need to get to the end of the microqueue
	// because we use an effect
	await setTimeout(() => {}, 1);

	return c.currentRender!.outerHTML;
}

// make_test_object1().then((a) => {
//   console.log(
//     `time taken (loading + creating HTML_Div with childs) ${Date.now() - start}`
//   );
// });

// value the P test should be equal to
const P_testO = document.createElement('p');
const P_test_Text = document.createTextNode('p text');
P_testO.appendChild(P_test_Text);
P_testO.setAttribute('class', 'class_text');

async function Tests() {
	equal(
		P({ class: 'class_text' }, [t('p text')]).outerHTML,
		P_testO.outerHTML,
		'test if P works',
	);
	console.log('Testing P passed');

	equal(
		await make_test_object1(),
		'<div class="kekw"><p class="text-xl">(Text from T)<span> -SPAN- </span>(more T text)</p><article class="kek"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/330px-Firefox_logo%2C_2019.svg.png" alt="Firefox logo" style="width: 100px; height: 100%"></article><a href="kek">kekw</a></div>',
		'Test simple html',
	);
}
Tests().then(() => {
	console.log('Testing simple Html passed');
	console.log(`\nall test finished after: ${Date.now() - start}ms`);
});
