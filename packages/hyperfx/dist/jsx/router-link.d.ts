import type { VNode } from '../elem/elem';
interface RouterLinkProps {
    href: string;
    className?: string;
    children: any;
}
/**
 * RouterLink component for client-side navigation
 */
export declare function RouterLink(props: RouterLinkProps): VNode;
export {};
