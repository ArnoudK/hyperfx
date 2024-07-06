import { RenderToBody, Div, t } from "./elem/elem";
import { P, Span, A, Abbr, B, Bdi, Bdo, Cite, I } from "./elem/text";
import { H1, H2, H3, H4, H5, H6 } from "./elem/headings";
import { Hr, Br } from "./elem/style";
import { Img } from "./elem/img";
import { Input, Label } from "./elem/input";

import { Title } from "./elem/head";

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

import { RouteRegister, GetParamValue } from "./pages/register";

import { fetcher } from "./fetcher";

/* Extension methods */

Object.defineProperty(HTMLElement.prototype, "WithEventListener$HFX", {
  value: function <T extends HTMLElement, K extends keyof HTMLElementEventMap>(
    this: T,
    eventtype: K,
    listener: (ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => void
  ) {
    this.addEventListener(eventtype, listener);
    return this;
  },
});

Object.defineProperty(HTMLElement.prototype, "Modify$HFX", {
  value: function <T extends HTMLElement>(this: T, modfn: (a: T) => void) {
    modfn(this);
    return this;
  },
});

declare global {
  interface HTMLElement {
    /** Add an event listener and return the Element */
    WithEventListener$HFX<K extends keyof HTMLElementEventMap>(
      eventtype: K,
      listener: (ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => void
    ): this;
    /** Run a function on the Element and return the Element */
    Modify$HFX<T extends HTMLElement>(this: T, modfn: (el: T) => void): this;
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
  
  /* Other DOM stuff */
  RenderToBody,
  
  Title,
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
  /* fetcher */
  fetcher,
};
