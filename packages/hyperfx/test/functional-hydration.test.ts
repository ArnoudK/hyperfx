import { describe, it, expect, beforeEach } from 'vitest';
import { hydrate } from '../src/ssr/hydrate';
import { renderToString, resetNodeCounter } from '../src/ssr/render';
import { JSXElement, createElement, resetClientNodeCounter } from '../src/jsx/jsx-runtime';
import { signal } from '../src/reactive/signal';

describe('Functional Hydration', () => {
    beforeEach(() => {
        resetNodeCounter();
        resetClientNodeCounter();
        document.body.innerHTML = '';
    });

    it('should hydrate and claim existing nodes', () => {
        // 1. Define Component
        function App(): JSXElement {
            return createElement('div', { id: 'app-root' },
                createElement('h1', null, 'Hello World'),
                createElement('p', null, 'Hydration Test')
            );
        }

        // 2. SSR Render (simulate server)
        // We run the component to get DOM (JSDOM), then stringify it (SSR)
        const { html } = renderToString(App());
        expect(html).toContain('data-hfxh="000001"');

        // 3. Put into document (simulate browser load)
        document.body.innerHTML = html;
        const originalRoot = document.getElementById('app-root');
        expect(originalRoot).toBeTruthy();

        // 4. Hydrate
        hydrate(document.body, App);

        // 5. Verify Claim
        const newRoot = document.getElementById('app-root');
        expect(newRoot).toBe(originalRoot); // Should be exact same instance
    });

    it('should restore interactivity (signals)', () => {
        const count = signal(0);
        let buttonRef: HTMLButtonElement;

        function Counter(): JSXElement {
            const btn = createElement('button', {
                id: 'btn',
                onClick: () => count(count() + 1)
            },
                'Count: ',
                count // Reactive text
            );
            buttonRef = btn as HTMLButtonElement;
            return createElement('div', null, btn);
        }

        // SSR
        const { html } = renderToString(Counter());
        document.body.innerHTML = html;

        // Ensure initial state matches
        expect(document.body.textContent).toContain('Count: 0');

        // Hydrate
        hydrate(document.body, Counter);

        // Trigger update
        const btn = document.getElementById('btn') as HTMLButtonElement;
        btn.click(); // Should trigger new event listener attached during hydration

        // Verify update
        expect(count()).toBe(1);
        expect(btn.textContent).toBe('Count: 1');
    });

    it('should handle nested components hydration', () => {
        function Child() {
            return createElement('span', { class: 'child' }, 'I am child');
        }

        function Parent() {
            return createElement('div', { class: 'parent' },
                'Parent:',
                Child()
            );
        }

        const { html } = renderToString(Parent());
        document.body.innerHTML = html;

        const originalSpan = document.querySelector('.child');

        hydrate(document.body, Parent);

        const newSpan = document.querySelector('.child');
        expect(newSpan).toBe(originalSpan);
    });

    it('should handle text node updates correctly', () => {
        const text = signal('Initial');

        function TextApp() {
            return createElement('div', { id: 'text-container' }, text);
        }

        const { html } = renderToString(TextApp());
        document.body.innerHTML = html;
        expect(document.getElementById('text-container')?.textContent).toBe('Initial');

        hydrate(document.body, TextApp);

        // Update signal
        text('Updated');

        expect(document.getElementById('text-container')?.textContent).toBe('Updated');
        // Verify we didn't duplicate text nodes
        expect(document.getElementById('text-container')?.childNodes.length).toBe(1);
    });
});
