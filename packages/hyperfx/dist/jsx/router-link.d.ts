import { JSXChildren } from './jsx-runtime';
import type { VNode } from '../elem/elem';
interface RouterLinkProps {
    href: string;
    className?: string;
    children: JSXChildren;
    onClick?: (event: MouseEvent) => void;
    target?: '_blank' | '_self' | '_parent' | '_top';
    rel?: string;
}
/**
 * RouterLink component for client-side navigation with improved type safety
 */
export declare function RouterLink(props: RouterLinkProps): VNode;
export {};
