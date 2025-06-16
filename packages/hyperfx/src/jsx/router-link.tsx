import { getRouter } from '../pages/router';
import { jsx, JSXChildren } from './jsx-runtime';
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
export function RouterLink(props: RouterLinkProps): VNode {
  return jsx('a', {
    href: props.href,
    class: props.className,
    target: props.target,
    rel: props.rel,
    onclick: (event: MouseEvent) => {
      // Call custom onClick handler if provided
      if (props.onClick) {
        props.onClick(event);
      }
      
      // Only prevent default and navigate if it's not a modified click or external link
      if (!event.defaultPrevented && 
          !event.ctrlKey && 
          !event.metaKey && 
          !event.shiftKey && 
          (!props.target || props.target === '_self')) {
        event.preventDefault();
        const router = getRouter();
        router.navigate(props.href);
      }
    },
    children: props.children
  });
}
