import {
  Span,
  Div,
  Main,
  Footer,
  RouteRegister,
  PageComponent,
  RootComponent,
  navigateTo,
  GetQueryValue,
  Title,
  P,
  t,
  Article,
  MetaDescription,
} from "hyperfx";
import { parse } from "marked";
import md from "../assets/index.md?raw";
import { DocNav, SideNav } from "./docnav";

import { docsMD } from "./docregister";

import hljs from "highlight.js/lib/core";

import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import bash from "highlight.js/lib/languages/bash";

hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("html", html);
hljs.registerLanguage("bash", bash);

const appRoot = document.getElementById("app");
if (!appRoot) {
  throw "ERROR: app root not found??";
}
const rootComp = RootComponent();

const helloText = parse(md) as string;

const mdSpace = Main({ class: "flex flex-auto flex-col" });

const layOut = Div(
  { class: "flex flex-auto flex-col" },
  DocNav(),
  mdSpace,
  Footer(
    { class: "bg-slate-900 mx-auto w-full min-h-12 p-4 text-center" },
    Span({ class: "w-full " }, "© Arnoud Kerkhof"),
  ),
);
appRoot.replaceChildren(layOut);

RouteRegister(mdSpace)
  .registerRoute(
    "/",
    PageComponent(
      rootComp,
      null,
      () => {
        return Article({}, P({}, t("Could not load??")));
      },
      () => {
        setTimeout(() => navigateTo("/hyperfx"), 6);
      },
    ),
  )
  .registerRoute(
    "/hyperfx",
    PageComponent(
      rootComp,
      null,
      () => {
        const doc = GetQueryValue("doc");
        // console.log("doc: ", doc);
        // console.log("mdSpace: ", mdSpace);
        if (doc) {
          const mdDoc = docsMD.find((a) => a.route_name == doc);
          // console.log("mdDoc: ", mdDoc);
          if (mdDoc) {
            const docElement = Div(
              { class: "flex flex-auto " },
              SideNav(),
              Article({
                class: "p-4 flex flex-col overflow-auto mx-auto",
              }).With$HFX((e) => {
                e.innerHTML = parse(mdDoc.data) as string;
                return e;
              }),
            );
            const codeEls = docElement.querySelectorAll("pre code");
            for (const codeblock of codeEls) {
              hljs.highlightElement(codeblock as HTMLElement);
            }
            Title(`${mdDoc.title} | HyperFX`);
            MetaDescription(`HyperFX docs about ${mdDoc.title}.`);
            return docElement;
          } else {
            Title("Doc not found :( | HyperFX");
            return Div({}, P({}, t("The docs could not be found.")));
          }
        } else {
          Title("HyperFX docs");
          return Div(
            {},
            Article({ class: "p-4 mx-auto" }).With$HFX((a) => {
              a.innerHTML = helloText;
              return a;
            }),
          );
        }
      },
      () => {},
    ),
  )
  .enable();
