import type { StrictImageAttributes } from "./attr";
/**
 * Type-safe image element with required src and alt attributes
 * Uses the strict image attributes from attr.ts for better type safety
 */
export declare const Img: (attrs: StrictImageAttributes) => import("./elem").VNode<"img">;
