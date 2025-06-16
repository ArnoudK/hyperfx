// JSX Types and Utilities Index
// Export all JSX-related types and utilities for better developer experience

export type {
    JSXChild,
    JSXChildren,
    ComponentProps,
    FunctionComponent,
    EventHandlers,
    ReactiveValue,
    ReactiveString,
    ReactiveNumber,
    ReactiveBoolean,
    ReactiveStringExpression,
    ReactiveElementAttributes,
} from './jsx-runtime';

export {
    jsx,
    jsxs,
    jsxDEV,
    Fragment,
    createElement,
    template,
    r,
} from './jsx-runtime';

export type {
    ForProps,
} from './for';

export {
    For,
} from './for';

export type {
    ReactiveListProps,
} from './reactive-list';

export {
    ReactiveList,
} from './reactive-list';

export type {
    ReactiveExpression,
} from './reactive-helper';

export {
    reactive,
    isReactiveExpression,
} from './reactive-helper';

export {
    RouterLink,
} from './router-link';

// Re-export JSX namespace
export { JSX } from './jsx-runtime';

// Utility types
export type {
    ComponentPropsOf,
    OptionalProps,
    WithChildren,
    WithoutChildren,
    WithKey,
    Reactive,
    ReactiveChildren,
    ReactiveProps,
    EventHandlerProps,
    WithRef,
} from './types';

export {
    isVNode,
    isValidJSXChild,
    hasReactiveChildren,
    defineComponent,
} from './types';
