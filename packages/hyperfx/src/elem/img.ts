import type { GlobalAttr } from "./attr";
import { addAttr, createS } from "./elem";

type requiredImgAttr = { src: string };
type optionImgAttr = {
  alt: string;
  attributionsrc: string;
  crossorigin: "anonymous" | "use-credentials";
  decoding: "sync" | "async" | "auto";
  elementtiming: string;
  fetchpriority: "high" | "low" | "auto";
  height: string;
  width: string;
  loading: "eager" | "lazy";
  referrerpolicy:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";
  sizes: string;
  srcset: string;
};

type imageAttr = requiredImgAttr & GlobalAttr & Partial<optionImgAttr>;

export const Img = (attrs: imageAttr) => createS("img", attrs);
