import { getRouter } from '../pages/router';
import { jsx } from './jsx-runtime';
/**
 * RouterLink component for client-side navigation with improved type safety
 */
export function RouterLink(props) {
    return jsx('a', {
        href: props.href,
        class: props.className,
        target: props.target,
        rel: props.rel,
        onclick: (event) => {
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
//# sourceMappingURL=router-link.js.map