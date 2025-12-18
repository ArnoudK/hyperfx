/// <reference types="hyperfx/jsx" />

// Re-export JSX namespace to global scope
import type { JSX } from "hyperfx/jsx";

declare global {
  namespace JSX {
    type Element = JSX.Element;
    interface ElementChildrenAttribute extends JSX.ElementChildrenAttribute {}
    interface IntrinsicElements extends JSX.IntrinsicElements {}
  }
}