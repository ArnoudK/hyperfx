// Hydration and SSR State - Global Shared Source of Truth
// Using globalThis to ensure synchronization across multiple module instances (common in tests)

// Use a specific key to avoid conflicts and ensure sharing even if modules are duplicated
const SSR_STATE_KEY = '__HYPERFX_SSR_STATE_V2__';

type SSRGlobalState = {
  hydrationEnabled: boolean;
  ssrMode: boolean;
  clientNodeCounter: number;
  ssrNodeCounter: number;
  hydrationContainer: Node | null;
  hydrationPointer: Node | null;
  hydrationStack: Array<Node | null>;
};

const globalState = globalThis as { [SSR_STATE_KEY]?: SSRGlobalState };

if (!globalState[SSR_STATE_KEY]) {
  globalState[SSR_STATE_KEY] = {
    hydrationEnabled: false,
    ssrMode: false,
    clientNodeCounter: 0,
    ssrNodeCounter: 0,
    hydrationContainer: null,
    hydrationPointer: null as Node | null,
    hydrationStack: [] as (Node | null)[]
  };
}

const SSR_STATE = globalState[SSR_STATE_KEY] as SSRGlobalState;

export function startHydration(container?: Node | null): void {
  SSR_STATE.hydrationEnabled = true;
  if (container) {
    SSR_STATE.hydrationContainer = container;
    SSR_STATE.hydrationPointer = container.firstChild;
  }
  SSR_STATE.hydrationStack = [];
}

export function endHydration(): void {
  SSR_STATE.hydrationEnabled = false;
  SSR_STATE.hydrationContainer = null;
  SSR_STATE.hydrationPointer = null;
  SSR_STATE.hydrationStack = [];
}

export function isHydrationEnabled(): boolean {
  return SSR_STATE.hydrationEnabled;
}

export function getHydrationContainer(): Node | null {
  return SSR_STATE.hydrationContainer;
}

export function setSSRMode(enabled: boolean): void {
  SSR_STATE.ssrMode = enabled;
}

export function isSSRMode(): boolean {
  return SSR_STATE.ssrMode;
}

export function getHydrationPointer(): Node | null {
  return SSR_STATE.hydrationPointer;
}

export function setHydrationPointer(node: Node | null): void {
  SSR_STATE.hydrationPointer = node;
}

export function pushHydrationContext(nextPointer: Node | null): void {
  SSR_STATE.hydrationStack.push(SSR_STATE.hydrationPointer);
  SSR_STATE.hydrationPointer = nextPointer;
}

export function popHydrationContext(): void {
  SSR_STATE.hydrationPointer = SSR_STATE.hydrationStack.pop() || null;
}


export function clearSSRState(): void {
  SSR_STATE.hydrationEnabled = false;
  SSR_STATE.ssrMode = false;
  SSR_STATE.clientNodeCounter = 0;
  SSR_STATE.ssrNodeCounter = 0;
  SSR_STATE.hydrationContainer = null;
}

// Helper to claim the next element matching the tag
export function claimHydrationElement(tag: string): HTMLElement | null {
  if (!SSR_STATE.hydrationEnabled || !SSR_STATE.hydrationContainer) return null;

  let current = SSR_STATE.hydrationPointer;

  // Skip non-element nodes (like text or comments) that might be in between
  // But be careful not to skip content that SHOULD be there???
  // For now, in a structural walk, we expect mostly exact matches or text.
  // We should probably just look at the current pointer.

  // Simple check: is the current node an element with the right tag?
  while (current && current.nodeType !== 1) {
    // If it's a comment or empty text, skip it? 
    // For now, let's assume we strictly match structure.
    current = current.nextSibling;
  }

  if (current && current.nodeType === 1 && (current as HTMLElement).tagName.toLowerCase() === tag.toLowerCase()) {
    // Move pointer to next sibling for the NEXT claim
    // But wait, if we claim this element, we might want to enter it?
    // The factory calls renderChildren which handles entering?
    // No, factory creates the element. Then renderChildren receives the element.
    // The `hydrationPointer` tracks siblings in the CURRENT parent.
    // So we claim this one. The pointer for the *current* context moves past it.
    SSR_STATE.hydrationPointer = current.nextSibling;
    return current as HTMLElement;
  }

  return null;
}

export function createNodeId(): string {
  // SSR_STATE.ssrNodeCounter++;
  // return String(SSR_STATE.ssrNodeCounter).padStart(6, '0');
  // Deprecated/No-op for ID-less hydration
  return "";
}
