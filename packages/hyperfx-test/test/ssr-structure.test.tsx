// Test SSR structural output without IDs
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToString, clearSSRState, setSSRMode } from 'hyperfx';

describe('SSR structural improvements', () => {
  beforeEach(() => {
    clearSSRState();
    setSSRMode(true); // Enable for direct factory tests
  });

  it('should generate valid HTML without IDs', () => {
    // Basic test
    const { html } = renderToString(() => <div />);
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
    // Markers are kept for potential hydration
    expect(normalize(html)).toContain(normalize('<div><span>Child</span>'));
    expect(normalize(html)).toContain('hfx:dyn');
  });
});
