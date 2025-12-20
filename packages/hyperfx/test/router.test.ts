
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Router, Route } from '../src/pages/router-components';
import { JSXElement } from '../src/jsx/jsx-runtime';

describe('Router', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        window.history.pushState({}, '', '/');
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    it('matches exact path correctly ignoring query params', async () => {
        // Test that /hyperfx/editor does NOT match /hyperfx when exact is true
        const App = () => Router({
            initialPath: '/hyperfx/editor',
            children: () => [
                Route({ path: '/hyperfx', exact: true, children: 'Main Page' as any as JSXElement }),
                Route({ path: '/hyperfx/editor', children: 'Editor Page' as any as JSXElement }),
            ]
        });

        container.appendChild(App() as Node);

        // Give time for effects to run
        await new Promise(resolve => setTimeout(resolve, 10));

        // Expectation: 'Editor Page' should be visible. 'Main Page' should NOT be visible.
        expect(container.textContent).toContain('Editor Page');
        expect(container.textContent).not.toContain('Main Page');
    });

    it('matches path with query params when using exact', async () => {
        const App = () => Router({
            initialPath: '/hyperfx?doc=foo',
            children: () => [
                Route({ path: '/hyperfx', exact: true, children: 'Main Page' as any as JSXElement }),
            ]
        });
        container.appendChild(App() as Node);

        await new Promise(resolve => setTimeout(resolve, 10));

        // With current bug, this might fail because '/hyperfx?doc=foo' !== '/hyperfx'
        expect(container.textContent).toContain('Main Page');
    });
});
