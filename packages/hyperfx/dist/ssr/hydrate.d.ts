import { VNode } from "../elem/elem";
import { HydrationData } from "./render";
/**
 * Hydrate SSR-rendered content with interactive VNodes
 */
export declare function hydrate(vnode: VNode, container: HTMLElement, hydrationData?: HydrationData): void;
/**
 * Automatic hydration - finds all elements with hydration markers and reattaches event handlers
 * Also sets up reactive effects for signal-based content
 */
export declare function autoHydrate(componentFunction: () => VNode, containerElement?: HTMLElement): void;
