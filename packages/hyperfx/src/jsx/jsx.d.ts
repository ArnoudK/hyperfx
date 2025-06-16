/// <reference path="jsx-runtime.ts" />

import { VNode } from "../elem/elem";

declare global {
  namespace JSX {
    interface Element {
      tag: string | symbol;
      props: Record<string, any>;
      children: any[];
      key?: string | number;
      dom?: HTMLElement | Text | Comment;
      reactiveProps?: Record<string, any>;
      effects?: any[];
    }

    interface IntrinsicElements {
      [elemName: string]: VNode;
    }

    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

export { };
