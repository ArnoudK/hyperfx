


export type OverrideType<T, U> = Omit<T, keyof U> & U;

/**
 * Utility type to make hovering a type more readable
 * Usefull for Intersecting types
 * https://www.totaltypescript.com/concepts/the-prettify-helper
 */
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};