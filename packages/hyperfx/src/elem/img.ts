import type { StrictImageAttributes } from "./attr";
import type { JSXElement } from "../jsx/jsx-runtime";

/**
 * Type-safe image element with required src and alt attributes
 * Uses the strict image attributes from attr.ts for better type safety
 */
export const Img = (_attrs: StrictImageAttributes): JSXElement => {
  throw new Error('HyperFX requires compilation. The runtime JSX factory is not supported.');
};
