import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Portal, createRoot, createSignal, isSSRMode, setSSRMode } from 'hyperfx';

// Helper to wait for effects to run
const waitForEffects = () => new Promise(resolve => setTimeout(resolve, 10));

describe('Portal Component', () => {
  let container: HTMLElement;
  let portalTarget: HTMLElement;

  beforeEach(() => {
    // Set up DOM environment
    container = document.createElement('div');
    container.id = 'app';
    document.body.appendChild(container);
    
    portalTarget = document.createElement('div');
    portalTarget.id = 'portal-target';
    document.body.appendChild(portalTarget);
    
    // Ensure we're in client mode
    setSSRMode(false);
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
  });

  describe('basic rendering', () => {
    it('should render children into portal target', async () => {
      const child = document.createElement('div');
      child.id = 'portal-child';
      child.textContent = 'Portal Content';
      
      Portal({
        mount: portalTarget,
        children: child as any,
      });
      
      // Wait for effect to run
      await waitForEffects();
      
      expect(portalTarget.contains(child)).toBe(true);
      expect(child.textContent).toBe('Portal Content');
    });

    it('should default to document.body when mount not specified', async () => {
      const child = document.createElement('div');
      child.id = 'body-portal-child';
      
      Portal({
        children: child as any,
      });
      
      await waitForEffects();
      
      expect(document.body.contains(child)).toBe(true);
    });

    it('should accept mount as a function', async () => {
      const child = document.createElement('div');
      child.id = 'fn-portal-child';
      
      Portal({
        mount: () => portalTarget,
        children: child as any,
      });
      
      await waitForEffects();
      
      expect(portalTarget.contains(child)).toBe(true);
    });
  });

  describe('dynamic mount target', () => {
    it('should move content when mount target changes', async () => {
      const [mountSignal, setMountSignal] = createSignal<Element>(portalTarget);
      const child = document.createElement('div');
      child.id = 'dynamic-portal-child';
      
      const otherTarget = document.createElement('div');
      otherTarget.id = 'other-target';
      document.body.appendChild(otherTarget);
      
      Portal({
        mount: () => mountSignal(),
        children: child as any,
      });
      
      // Wait for initial render
      await waitForEffects();
      
      expect(portalTarget.contains(child)).toBe(true);
      expect(otherTarget.contains(child)).toBe(false);
      
      // Change mount target
      setMountSignal(otherTarget);
      
      await waitForEffects();
      
      expect(portalTarget.contains(child)).toBe(false);
      expect(otherTarget.contains(child)).toBe(true);
    });
  });

  describe('SSR support', () => {
    it('should render children in place during SSR', () => {
      // Enable SSR mode
      setSSRMode(true);
      
      const child = { t: '<div>SSR Content</div>', __ssr: true };
      
      const result = Portal({
        mount: portalTarget,
        children: child as any,
      });
      
      // In SSR mode, portal should just return the children
      expect(result).toBe(child);
      
      // Restore client mode
      setSSRMode(false);
    });

    it('should return correct SSR mode', () => {
      setSSRMode(true);
      expect(isSSRMode()).toBe(true);
      setSSRMode(false);
      expect(isSSRMode()).toBe(false);
    });
  });

  describe('cleanup', () => {
    it('should remove children from portal when unmounted', async () => {
      const child = document.createElement('div');
      child.id = 'cleanup-portal-child';
      
      // Create a root to manage the portal lifecycle
      const { dispose } = createRoot(() => {
        Portal({
          mount: portalTarget,
          children: child as any,
        });
        return null;
      });
      
      await waitForEffects();
      
      expect(portalTarget.contains(child)).toBe(true);
      
      // Dispose the root, which should cleanup the portal
      dispose();
      
      expect(portalTarget.contains(child)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle null mount target gracefully', async () => {
      const child = document.createElement('div');
      
      // Should not throw, just warn
      expect(() => {
        Portal({
          mount: null as any,
          children: child as any,
        });
      }).not.toThrow();
      
      await waitForEffects();
    });

    it('should handle function returning null', async () => {
      const child = document.createElement('div');
      
      expect(() => {
        Portal({
          mount: () => null as any,
          children: child as any,
        });
      }).not.toThrow();
      
      await waitForEffects();
    });

    it('should handle DocumentFragment children', async () => {
      const fragment = document.createDocumentFragment();
      const child1 = document.createElement('div');
      child1.id = 'fragment-child-1';
      const child2 = document.createElement('span');
      child2.id = 'fragment-child-2';
      fragment.appendChild(child1);
      fragment.appendChild(child2);
      
      Portal({
        mount: portalTarget,
        children: fragment as any,
      });
      
      await waitForEffects();
      
      expect(portalTarget.contains(child1)).toBe(true);
      expect(portalTarget.contains(child2)).toBe(true);
    });

    it('should handle text node children', async () => {
      const textNode = document.createTextNode('Text content');
      
      Portal({
        mount: portalTarget,
        children: textNode as any,
      });
      
      await waitForEffects();
      
      expect(portalTarget.textContent).toBe('Text content');
    });
  });
});
