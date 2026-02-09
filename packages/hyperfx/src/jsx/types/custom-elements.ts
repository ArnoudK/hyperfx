import type { ReactiveString } from './base';
import type { GlobalHTMLAttributes } from './global-attributes';

// ========================================
// CUSTOM ELEMENTS SUPPORT
// ========================================

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

// ========================================
// WEB COMPONENT PATTERNS
// ========================================

/**
 * Attributes for web components that follow common patterns
 */
export interface WebComponentAttributes extends GlobalHTMLAttributes {
  // Common web component attributes
  'part'?: ReactiveString; // CSS Shadow Parts
  'exportparts'?: ReactiveString; // Exporting shadow parts
  'theme'?: ReactiveString; // Theming support
  'variant'?: ReactiveString; // Variant styling

  // Event forwarding (common in web components)
  'event-prefix'?: ReactiveString; // Prefix for custom events
}

// ========================================
// SPECIFIC WEB COMPONENT LIBRARIES
// ========================================

/**
 * Attributes for custom elements that support data binding
 */
export interface DataBoundElementAttributes extends WebComponentAttributes {
  'data-prop'?: ReactiveString; // Generic data binding
  'bind-value'?: ReactiveString; // Value binding
  'bind-checked'?: ReactiveString; // Checked binding
  'bind-class'?: ReactiveString; // Class binding
  'bind-style'?: ReactiveString; // Style binding
}

/**
 * Attributes for custom elements that support slots
 */
export interface SlottedElementAttributes extends WebComponentAttributes {
  'slot-name'?: ReactiveString; // Named slots
  'slot-fallback'?: ReactiveString; // Fallback content
}

// ========================================
// UTILITIES FOR CUSTOM ELEMENTS
// ========================================

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

// ========================================
// LEGACY CUSTOM ELEMENT SUPPORT
// ========================================

/**
 * Fallback interface for unknown custom elements
 * Only use when strict typing is not possible
 */
export interface UnknownCustomElementAttributes extends GlobalHTMLAttributes {
  /** Allow attributes (use sparingly) */
  [key: `data-${string}`]: ReactiveString | undefined;
  [key: string]: unknown;
}
