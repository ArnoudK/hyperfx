import type { ReactiveString } from './base';
import type { GlobalHTMLAttributes } from './global-attributes';
/**
 * Base interface for custom elements with flexible attribute support
 * Use this for web components or third-party libraries
 */
export interface CustomElementAttributes extends GlobalHTMLAttributes {
    /** Allow custom attributes for extensibility */
    [key: string]: unknown;
}
/**
 * Interface for extending JSX.IntrinsicElements with custom elements
 * Usage in consuming code:
 *
 * declare global {
 *   namespace JSX {
 *     interface IntrinsicElements {
 *       'my-custom-element': CustomElementAttributes & {
 *         'custom-prop': ReactiveString;
 *       };
 *     }
 *   }
 * }
 *
 * Note: Import this file to extend the JSX namespace globally
 */
/**
 * Attributes for web components that follow common patterns
 */
export interface WebComponentAttributes extends GlobalHTMLAttributes {
    'part'?: ReactiveString;
    'exportparts'?: ReactiveString;
    'theme'?: ReactiveString;
    'variant'?: ReactiveString;
    'event-prefix'?: ReactiveString;
}
/**
 * Attributes for custom elements that support data binding
 */
export interface DataBoundElementAttributes extends WebComponentAttributes {
    'data-prop'?: ReactiveString;
    'bind-value'?: ReactiveString;
    'bind-checked'?: ReactiveString;
    'bind-class'?: ReactiveString;
    'bind-style'?: ReactiveString;
}
/**
 * Attributes for custom elements that support slots
 */
export interface SlottedElementAttributes extends WebComponentAttributes {
    'slot-name'?: ReactiveString;
    'slot-fallback'?: ReactiveString;
}
/**
 * Type helper to create custom element attributes
 * @example
 * type MyElementProps = CreateCustomElementAttributes<{
 *   count: ReactiveNumber;
 *   name: ReactiveString;
 * }>;
 */
export type CreateCustomElementAttributes<T> = GlobalHTMLAttributes & T;
/**
 * Type helper for polymorphic custom elements
 * @example
 * type CardElementProps<T extends string> = CreatePolymorphicElementAttributes<T, {
 *   variant: 'primary' | 'secondary';
 * }>;
 */
export type CreatePolymorphicElementAttributes<T, P = {}> = P & {
    as?: T;
} & GlobalHTMLAttributes;
/**
 * Fallback interface for unknown custom elements
 * Only use when strict typing is not possible
 */
export interface UnknownCustomElementAttributes extends GlobalHTMLAttributes {
    /** Allow attributes (use sparingly) */
    [key: `data-${string}`]: ReactiveString | undefined;
    [key: string]: unknown;
}
