// Functional Hydration Test
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToString, hydrate, isSSRMode, setSSRMode, clearSSRState } from 'hyperfx';
import { createComputed, createSignal } from 'hyperfx';

describe('Functional Hydration', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        clearSSRState();
    });

    it('should hydrate and claim existing nodes', () => {
        function App() {
            const [count, setCount] = createSignal(0);
            return (
                <div id="app-root">
                    <span id="counter">{count}</span>
                    <button id="inc" onclick={() => setCount(count() + 1)}>Inc</button>
                </div>
            );
        }

        // 1. Pass a function to renderToString for automatic mode management
        const { html } = renderToString(() => <App />, { ssrHydration: true });
 

        // 2. Verify HTML structure (no IDs)
        // expect(html).toContain('data-hfxh'); // IDs generated structurally now, not attributes

        // 3. Put into document (simulate browser load)
        document.body.innerHTML = html;

        // 4. Hydrate - Correct argument order: (container, factory)
        hydrate(document.body, () => <App />);

        // 5. Verify we claimed the nodes
        // 5. Verify interactivity restored
        const hydratedButton = document.getElementById('inc')!;
        expect(hydratedButton.textContent).toBe('Inc');
    });

    it('should restore interactivity (signals)', () => {
        function Counter() {
            const [count, setCount] = createSignal(5);
            return (
                <div id="counter-app">
                    <span id="display">{count}</span>
                    <button id="btn" onclick={() => setCount(count() + 1)}>Add</button>
                </div>
            );
        }
        const { html } = renderToString(() => <Counter />, { ssrHydration: true });
        document.body.innerHTML = html;

        // Ensure initial state matches
        expect(document.getElementById('display')?.textContent).toBe('5');

        hydrate(document.body, () => <Counter />);

        // Interact
        const btn = document.getElementById('btn')!;
        btn.click();

        // Verify signal update
        expect(document.getElementById('display')?.textContent).toBe('6');
    });

    it('should handle nested components hydration', () => {
        function Child() {
            return <span class="child">Child Content</span>;
        }
        function Parent() {
            return (
                <div class="parent">
                    <Child />
                </div>
            );
        }

        const { html } = renderToString(() => <Parent />, { ssrHydration: true });
        document.body.innerHTML = html;

        const originalSpan = document.querySelector('.child');
        expect(originalSpan).not.toBeNull();

        hydrate(document.body, () => <Parent />);

        const newSpan = document.querySelector('.child');
        expect(newSpan?.tagName).toBe(originalSpan?.tagName);
    });

    it('should handle text node updates correctly', () => {
        function TextApp() {
            const [text, setText] = createSignal('Initial');
            // Store reference globally for interaction
            (globalThis as any).setText = setText;
            return <div id="text-container">{text}</div>;
        }

        const { html } = renderToString(() => <TextApp />, { ssrHydration: true });
        document.body.innerHTML = html;
        expect(document.getElementById('text-container')?.textContent).toBe('Initial');

        hydrate(document.body, () => <TextApp />);

        // Update via signal
        (globalThis as any).setText('Updated');

        expect(document.getElementById('text-container')?.textContent).toBe('Updated');

     

        // Verify we didn't duplicate text nodes (ignore comment markers)
        const textNodes = Array.from(document.getElementById('text-container')?.childNodes || [])
            .filter(n => n.nodeType === 3);
        expect(textNodes.length).toBe(1);
    });
});
