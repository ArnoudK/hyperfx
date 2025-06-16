import { getRouter } from '../pages/router';
import { jsx } from './jsx-runtime';
import type { VNode } from '../elem/elem';

interface RouterLinkProps {
  href: string;
  className?: string;
  children: any;
}

/**
 * RouterLink component for client-side navigation
 */
export function RouterLink(props: RouterLinkProps): VNode {
  return jsx('a', {
    href: props.href,
    class: props.className,
    onclick: (event: Event) => {
      event.preventDefault();
      const router = getRouter();
      router.navigate(props.href);
    },
    children: props.children
  });
}
