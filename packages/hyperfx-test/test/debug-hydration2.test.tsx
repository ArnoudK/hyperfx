import { describe, it, expect, beforeEach } from 'vitest';
import { renderToString, hydrate, clearSSRState } from 'hyperfx';

describe('Debug Hydration 2', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        clearSSRState();
    });

    it('should show full hydration flow', () => {
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
      
        // Manually call factory to see what it returns
        // const manualResult = Parent();
      
        hydrate(document.body, () => <Parent />);
        
        const span = document.querySelector('.child');
        
        expect(span).not.toBeNull();
    });
});
