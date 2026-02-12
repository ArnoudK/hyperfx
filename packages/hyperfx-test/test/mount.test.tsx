import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createComponent, mount } from 'hyperfx';

describe('mount', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.innerHTML = '';
  });

  it('replaces existing content when mode is replace', () => {
    container.innerHTML = '<span id="old">Old</span>';

    const dispose = mount(() => <div id="new">New</div>, container, { mode: 'replace' });

    expect(container.querySelector('#new')).toBeTruthy();
    expect(container.querySelector('#old')).toBeNull();

    dispose();
  });

  it('appends content and preserves existing nodes when mode is append', () => {
    const existing = document.createElement('span');
    existing.id = 'old';
    container.appendChild(existing);

    const dispose = mount(() => <div id="new">New</div>, container, { mode: 'append' });

    expect(container.querySelector('#old')).toBeTruthy();
    expect(container.querySelector('#new')).toBeTruthy();

    dispose();

    expect(container.querySelector('#old')).toBeTruthy();
    expect(container.querySelector('#new')).toBeNull();
  });

  it('runs lifecycle hooks for component mounts', () => {
    let mounted = 0;
    let unmounted = 0;

    const Component = createComponent(
      () => <div id="lifecycle">Lifecycle</div>,
      {
        onMount: () => { mounted += 1; },
        onUnmount: () => { unmounted += 1; }
      }
    );

    const dispose = mount(Component, {}, container, { mode: 'replace' });

    expect(container.querySelector('#lifecycle')).toBeTruthy();
    expect(mounted).toBe(1);
    expect(unmounted).toBe(0);

    dispose();

    expect(container.querySelector('#lifecycle')).toBeNull();
    expect(unmounted).toBe(1);
  });
});
