import { getRouter } from '../pages/router';
import { jsx } from './jsx-runtime';
/**
 * RouterLink component for client-side navigation
 */
export function RouterLink(props) {
    return jsx('a', {
        href: props.href,
        class: props.className,
        onclick: (event) => {
            event.preventDefault();
            const router = getRouter();
            router.navigate(props.href);
        },
        children: props.children
    });
}
//# sourceMappingURL=router-link.js.map