import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('JSX fragments', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.innerHTML = '';
  });

  it('should render fragment children in order', () => {
    const element = (
      <>
        <span>First</span>
        <span>Second</span>
      </>
    );

    container.appendChild(document.createElement('div'));
    const host = container.firstElementChild as HTMLElement;
    host.appendChild(element as Node);
    expect(host.textContent).toBe('FirstSecond');
  });

  it('should render nested fragments', () => {
    const element = (
      <>
        <>Hello</>
        <>World</>
      </>
    );

    container.appendChild(document.createElement('div'));
    const host = container.firstElementChild as HTMLElement;
    host.appendChild(element as Node);
    expect(host.textContent).toBe('HelloWorld');
  });
});
