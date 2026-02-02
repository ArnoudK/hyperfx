// Test SSR data-hfxh improvements
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToString, createNodeId, resetNodeCounter } from '../src/ssr/render';
import { createElement } from '../src/jsx/runtime/server-factory';

describe('SSR data-hfxh improvements', () => {
  beforeEach(() => {
    resetNodeCounter();
    document.body.innerHTML = '';
  });

  it('should generate unique node IDs', () => {
    const nodeId1 = createNodeId();
    const nodeId2 = createNodeId();
    const nodeId3 = createNodeId();

    expect(nodeId1).toBe('000001');
    expect(nodeId2).toBe('000002');
    expect(nodeId3).toBe('000003');
    expect(nodeId1).not.toBe(nodeId2);
    expect(nodeId2).not.toBe(nodeId3);
  });

  it('should add data-hfxh attributes to all elements during SSR', () => {
    // Create elements using createElement (returns VirtualNodes)
    const container = createElement('div', { class: 'test-container' },
      'Hello World',
      createElement('button', { class: 'increment-btn' }, 'Increment')
    );

    const { html } = renderToString(container);

    // Check that all elements have data-hfxh attributes
    expect(html).toContain('data-hfxh="000001"');
    expect(html).toContain('data-hfxh="000002"');

    // Count occurrences of data-hfxh
    const dataHfxhMatches = html.match(/data-hfxh="[^"]+"/g) || [];
    expect(dataHfxhMatches.length).toBeGreaterThanOrEqual(2);
  });

  it('should handle complex nested structures', () => {
    // Create nested structure using createElement (returns VirtualNodes)
    const element = createElement('div', { id: 'app' },
      createElement('div', { class: 'header' }, 'Header'),
      createElement('div', { class: 'content' },
        createElement('div', { class: 'sidebar' }, 'Sidebar'),
        createElement('div', { class: 'main' },
          'Main content',
          createElement('button', { class: 'action-btn' }, 'Action')
        )
      ),
      createElement('div', { class: 'footer' }, 'Footer')
    );

    const { html } = renderToString(element);

    // Count all data-hfxh attributes
    const nodeIds = html.match(/data-hfxh="[^"]+"/g) || [];

    // Should have 7 elements: app, header, content, sidebar, main, button, footer
    expect(nodeIds.length).toBeGreaterThanOrEqual(7);

    // Verify unique IDs
    const ids = nodeIds.map(match => match.match(/data-hfxh="([^"]+)"/)![1]);
    const uniqueIds = [...new Set(ids)];
    expect(uniqueIds).toHaveLength(ids.length);

    // Verify sequential numbering
    expect(uniqueIds[0]).toBe('000001');
    expect(uniqueIds[1]).toBe('000002');
  });
});