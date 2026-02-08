// Test SSR structural output without IDs
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToString, clearSSRState, setSSRMode } from 'hyperfx';
// Import explicitly from the server runtime for testing string output
import { createElement } from 'hyperfx/jsx-server';

describe('SSR structural improvements', () => {
  beforeEach(() => {
    clearSSRState();
    setSSRMode(true); // Enable for direct factory tests
  });

  it('should generate valid HTML without IDs', () => {
    // Basic test
    const { html } = renderToString(() => createElement('div', null));
    expect(html).toContain('<div></div>');
    expect(html).not.toContain('data-hfxh');
  });

  const normalize = (html: string) => html.replace(/\s+/g, '');

  it('should generate valid HTML structure', () => {
    const { html } = renderToString(() => (
      <div id="parent">
        <span id="child">Text</span>
      </div>
    ));
    expect(normalize(html)).toContain(normalize('<div id="parent"><span id="child">Text</span></div>'));
  });

  it('should handle nested components', () => {
    function Child() { return <span>Child</span>; }
    function Parent() {
      return (
        <div>
          <Child />
        </div>
      );
    }
    const { html } = renderToString(() => <Parent />);
    expect(normalize(html)).toContain(normalize('<div><span>Child</span></div>'));
  });
});
