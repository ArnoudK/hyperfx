import { Div, RenderToBody, t } from "./elem/elem";
import { H1, H2, H3, H4, H5, H6 } from "./elem/headings";
import { Img } from "./elem/img";
import { Input, Label } from "./elem/input";
import { Br, Hr } from "./elem/style";
import {
  A,
  Abbr,
  B,
  Bdi,
  Bdo,
  Cite,
  I,
  P,
  Span,
  Code,
  BlockQuote,
} from "./elem/text";

import { MetaDescription, Title, Base } from "./elem/head";

import {
  Table,
  TableBody,
  TableCaption,
  TableData,
  TableFoot,
  TableHead,
  TableHeader,
  TableRow,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "./elem/table";

import {
  Address,
  Article,
  Aside,
  Button,
  Footer,
  Main,
  Output,
  Pre,
  Nav,
} from "./elem/semantic";

import { Component, PageComponent, RootComponent } from "./reactive/component";

import { navigateTo } from "./pages/navigate";

import {
  GetParamValue,
  GetQueryValue,
  GetQueryValues,
  RouteRegister,
} from "./pages/register";

import { fetcher } from "./fetcher";

import {
  elementToHFXObject,
  nodeToHFXObject,
  HFXObjectToElement,
} from "./json_representation/hfx_object";
import type { HFXObject } from "./json_representation/hfx_object";

/* Extension methods */

Object.defineProperty(HTMLElement.prototype, "WithEvent$HFX", {
  value: function <T extends HTMLElement, K extends keyof HTMLElementEventMap>(
    this: T,
    eventtype: K,
    listener: (ev: HTMLElementEventMap[K]) => void
  ) {
    this.addEventListener(eventtype, listener);
    return this;
  },
});

Object.defineProperty(Object.prototype, "With$HFX", {
  value: function <T extends Object>(this: T, func: (obj: T) => void) {
    func(this);
    return this;
  },
});

declare global {
  interface HTMLElement {
    /** Add an event listener and return the Element */
    WithEvent$HFX<K extends keyof HTMLElementEventMap>(
      eventtype: K,
      listener: (ev: HTMLElementEventMap[K]) => void
    ): this;
  }
  interface Object {
    With$HFX<T extends Object>(this: T, run: (obj: T) => void): T;
  }
}

export {
  /* HTML Tags */
  A,
  Abbr,
  Address,
  Article,
  Aside,
  B,
  Base,
  Bdi,
  Bdo,
  Br,
  BlockQuote,
  Button,
  Cite,
  Code,
  /* Components */
  Component,
  Div,
  /* fetcher */
  fetcher,
  Footer,
  GetParamValue,
  GetQueryValue,
  GetQueryValues,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Hr,
  I,
  Img,
  Input,
  Label,
  Main,
  MetaDescription,
  Nav,
  /* Routing */
  navigateTo,
  P,
  PageComponent,
  Pre,
  Output,
  /* Other DOM stuff */
  RenderToBody,
  RootComponent,
  RouteRegister,
  Span,
  t,
  /* Table stuff */
  Table,
  TableBody,
  TableCaption,
  TableData,
  TableFoot,
  TableHead,
  TableHeader,
  TableRow,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Title,
  Tr,
  // json_representation
  elementToHFXObject,
  nodeToHFXObject,
  HFXObjectToElement,
};

export type { HFXObject };
