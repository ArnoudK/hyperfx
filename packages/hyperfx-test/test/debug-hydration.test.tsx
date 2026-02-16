import { describe, it, expect, beforeEach } from 'vitest';
import { renderToString, hydrate, clearSSRState } from 'hyperfx';

describe('Debug Hydration', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        clearSSRState();
    });

    it('should debug nested components', () => {
        function Child() {
            const result = <span class="child">Child Content</span>;
            return result;
        }
        
        function Parent() {
            const result = (
                <div class="parent">
                    <Child />
                </div>
            );
            return result;
        }

        const { html } = renderToString(() => <Parent />, { ssrHydration: true });
        
        document.body.innerHTML = html;
    
        hydrate(document.body, () => <Parent />);
        
        const span = document.querySelector('.child');
        
        expect(span).not.toBeNull();
        expect(span?.tagName).toBe('SPAN');
    });
});
