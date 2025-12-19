import type { StrictImageAttributes } from "./attr";
import { createElement } from "../jsx/jsx-runtime";

/**
 * Type-safe image element with required src and alt attributes
 * Uses the strict image attributes from attr.ts for better type safety
 */
export const Img = (attrs: StrictImageAttributes) => createElement("img", attrs);
