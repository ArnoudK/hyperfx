// Test SSR data-hfxh improvements
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToString, createNodeId, resetNodeCounter } from '../src/ssr/render';
import { r } from '../src/jsx/jsx-runtime';

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
    const count = r(() => 0);
    // Create elements using document.createElement since JSX components aren't exported
    const container = document.createElement('div');
    container.setAttribute('class', 'test-container');

    const text = document.createTextNode('Hello World');
    container.appendChild(text);

    const button = document.createElement('button');
    button.setAttribute('class', 'increment-btn');
    button.textContent = 'Increment';
    container.appendChild(button);

    const { html } = renderToString(container);

    // Check that all elements have data-hfxh attributes
    expect(html).toContain('data-hfxh="000001"');
    expect(html).toContain('data-hfxh="000002"');

    // Count occurrences of data-hfxh
    const dataHfxhMatches = html.match(/data-hfxh="[^"]+"/g) || [];
    expect(dataHfxhMatches.length).toBeGreaterThanOrEqual(2);
  });

  it('should handle complex nested structures', () => {
    // Create nested structure using DOM API
    const element = document.createElement('div');
    element.setAttribute('id', 'app');

    // Header
    const header = document.createElement('div');
    header.setAttribute('class', 'header');
    header.textContent = 'Header';
    element.appendChild(header);

    // Content
    const content = document.createElement('div');
    content.setAttribute('class', 'content');

    // Sidebar
    const sidebar = document.createElement('div');
    sidebar.setAttribute('class', 'sidebar');
    sidebar.textContent = 'Sidebar';
    content.appendChild(sidebar);

    // Main
    const main = document.createElement('div');
    main.setAttribute('class', 'main');
    main.textContent = 'Main content';
    content.appendChild(main);

    // Action button
    const actionBtn = document.createElement('button');
    actionBtn.setAttribute('class', 'action-btn');
    actionBtn.textContent = 'Action';
    main.appendChild(actionBtn);

    element.appendChild(content);

    // Footer
    const footer = document.createElement('div');
    footer.setAttribute('class', 'footer');
    footer.textContent = 'Footer';
    element.appendChild(footer);

    const { html } = renderToString(element);

    // Count all data-hfxh attributes
    const nodeIds = html.match(/data-hfxh="[^"]+"/g) || [];

    // Should have 6 elements: app, header, content, sidebar, main, button, footer
    expect(nodeIds.length).toBeGreaterThanOrEqual(6);

    // Verify unique IDs
    const ids = nodeIds.map(match => match.match(/data-hfxh="([^"]+)"/)![1]);
    const uniqueIds = [...new Set(ids)];
    expect(uniqueIds).toHaveLength(ids.length);

    // Verify sequential numbering
    expect(uniqueIds[0]).toBe('000001');
    expect(uniqueIds[1]).toBe('000002');
  });
});