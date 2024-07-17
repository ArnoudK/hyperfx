import { RenderToBody, Div, t } from "./elem/elem";
import { P, Span, A, Abbr, B, Bdi, Bdo, Cite, I } from "./elem/text";
import { H1, H2, H3, H4, H5, H6 } from "./elem/headings";
import { Hr, Br } from "./elem/style";
import { Img } from "./elem/img";
import { Input, Label } from "./elem/input";

import { Title, MetaDescription } from "./elem/head";

import {
  Table,
  TableBody,
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
  TableCaption,
} from "./elem/table";

import {
  Article,
  Address,
  Aside,
  Button,
  Nav,
  Main,
  Footer,
} from "./elem/semantic";

import { Component, RootComponent, PageComponent } from "./reactive/component";

import { WithEventListener } from "./reactive/event";

import { navigateTo } from "./pages/navigate";

import {
  RouteRegister,
  GetParamValue,
  GetQueryValue,
  GetQueryValues,
} from "./pages/register";

import { fetcher } from "./fetcher";

/* Extension methods */

Object.defineProperty(HTMLElement.prototype, "WithEvent$HFX", {
  value: function <T extends HTMLElement, K extends keyof HTMLElementEventMap>(
    this: T,
    eventtype: K,
    listener: (ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => void,
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
      listener: (ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => void,
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
  Bdi,
  Bdo,
  Button,
  Br,
  Cite,
  Div,
  Footer,
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
  Nav,
  P,
  t,
  Span,

  /* Table stuff */
  Table,
  TableBody,
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
  TableCaption,

  /* Other DOM stuff */
  RenderToBody,
  Title,
  MetaDescription,
  /* Reactive stuff */
  WithEventListener,

  /* Components */
  Component,
  RootComponent,
  PageComponent,

  /* Routing */
  navigateTo,
  RouteRegister,
  GetParamValue,
  GetQueryValue,
  GetQueryValues,
  /* fetcher */
  fetcher,
};
