/**
 * Portal Component for HyperFX
 *
 * Renders children into a different DOM element (outside the parent hierarchy).
 * Useful for modals, tooltips, dropdowns, and overlays.
 *
 * SSR Support:
 * - On server: renders children in place (no teleportation)
 * - On client: moves children to the mount point after hydration
 */
import type { JSXElement } from '../jsx/jsx-runtime';
export interface PortalProps {
    /**
     * The DOM element to mount the portal content into.
     * Defaults to document.body if not specified.
     */
    mount?: Element | (() => Element | undefined);
    /**
     * The content to render inside the portal
     */
    children: JSXElement;
}
/**
 * Portal component - renders children into a different part of the DOM.
 *
 * @example
 * ```tsx
 * <Portal mount={document.getElementById('modal-root')}>
 *   <div class="modal">Modal content</div>
 * </Portal>
 * ```
 *
 * @example
 * ```tsx
 * // Default to document.body
 * <Portal>
 *   <Tooltip>Content</Tooltip>
 * </Portal>
 * ```
 */
export declare function Portal(props: PortalProps): JSXElement;
