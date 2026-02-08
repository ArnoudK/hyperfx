// Hydration and SSR State - Global Shared Source of Truth
// Using globalThis to ensure synchronization across multiple module instances (common in tests)
// Use a very specific key to avoid any conflicts and ensure sharing even if modules are duplicated
const SSR_STATE_KEY = '__HYPERFX_SSR_STATE_V2__';
if (!globalThis[SSR_STATE_KEY]) {
    globalThis[SSR_STATE_KEY] = {
        hydrationEnabled: false,
        ssrMode: false,
        clientNodeCounter: 0,
        ssrNodeCounter: 0,
        hydrationContainer: null,
        hydrationPointer: null,
        hydrationStack: []
    };
}
const SSR_STATE = globalThis[SSR_STATE_KEY];
export function startHydration(container) {
    SSR_STATE.hydrationEnabled = true;
    if (container) {
        SSR_STATE.hydrationContainer = container;
        SSR_STATE.hydrationPointer = container.firstChild;
    }
    SSR_STATE.hydrationStack = [];
}
export function endHydration() {
    SSR_STATE.hydrationEnabled = false;
    SSR_STATE.hydrationContainer = null;
    SSR_STATE.hydrationPointer = null;
    SSR_STATE.hydrationStack = [];
}
export function isHydrationEnabled() {
    return SSR_STATE.hydrationEnabled;
}
export function getHydrationContainer() {
    return SSR_STATE.hydrationContainer;
}
export function setSSRMode(enabled) {
    SSR_STATE.ssrMode = enabled;
}
export function isSSRMode() {
    return SSR_STATE.ssrMode;
}
export function getHydrationPointer() {
    return SSR_STATE.hydrationPointer;
}
export function setHydrationPointer(node) {
    SSR_STATE.hydrationPointer = node;
}
export function pushHydrationContext(nextPointer) {
    SSR_STATE.hydrationStack.push(SSR_STATE.hydrationPointer);
    SSR_STATE.hydrationPointer = nextPointer;
}
export function popHydrationContext() {
    SSR_STATE.hydrationPointer = SSR_STATE.hydrationStack.pop() || null;
}
export function clearSSRState() {
    SSR_STATE.hydrationEnabled = false;
    SSR_STATE.ssrMode = false;
    SSR_STATE.clientNodeCounter = 0;
    SSR_STATE.ssrNodeCounter = 0;
    SSR_STATE.hydrationContainer = null;
}
// Helper to claim the next element matching the tag
export function claimHydrationElement(tag) {
    if (!SSR_STATE.hydrationEnabled || !SSR_STATE.hydrationContainer)
        return null;
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
    if (current && current.nodeType === 1 && current.tagName.toLowerCase() === tag.toLowerCase()) {
        // Move pointer to next sibling for the NEXT claim
        // But wait, if we claim this element, we might want to enter it?
        // The factory calls renderChildren which handles entering?
        // No, factory creates the element. Then renderChildren receives the element.
        // The `hydrationPointer` tracks siblings in the CURRENT parent.
        // So we claim this one. The pointer for the *current* context moves past it.
        SSR_STATE.hydrationPointer = current.nextSibling;
        return current;
    }
    return null;
}
export function createNodeId() {
    // SSR_STATE.ssrNodeCounter++;
    // return String(SSR_STATE.ssrNodeCounter).padStart(6, '0');
    // Deprecated/No-op for ID-less hydration
    return "";
}
//# sourceMappingURL=hydration.js.map