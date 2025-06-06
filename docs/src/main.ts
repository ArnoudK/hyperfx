import {
  A,
  Article,
  Br,
  Code,
  Div,
  Footer,
  GetQueryValue,
  Main,
  MetaDescription,
  P,
  PageComponent,
  Pre,
  RootComponent,
  RouteRegister,
  Span,
  Title,
  navigateTo,
  t,
} from "hyperfx";

import { parse } from "marked";

const myStr = "Hello, world!";
import index_md from "../assets/index.md?raw";

import { DocNav, SideNavComp } from "./docnav";

import { docsMD } from "./docregister";

import hljs from "highlight.js/lib/core";

import bash from "highlight.js/lib/languages/bash";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { editor } from "./editor";

import editor_code from "./editor?raw";

hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("html", html);
hljs.registerLanguage("bash", bash);

const app_root = document.getElementById("app");
if (!app_root) {
  throw "ERROR: app root not found??";
}


const hello_text = parse(index_md) as string;

const md_space = Main({ class: "flex flex-auto flex-col" }, []);

const layout = Div({ class: "flex flex-auto flex-col" }, [
  DocNav(),
  md_space,
  Footer({ class: "bg-slate-900 mx-auto w-full min-h-12 p-4 text-center" }, [
    A(
      {
        href: "https://github.com/ArnoudK/hyperfx",
        target: "_blank",
        class: "underline",
      },
      [t("Github")]
    ),
    Span({ class: "w-full " }, " - © Arnoud Kerkhof"),
  ]),
]);

app_root.replaceChildren(layout);

/* Register routing + it triggers popstate (url changes)
 *    register '/' to redirect to /hyperfx
 *    register '/hyperfx' to load the doc when the url changes 'popstate' and
 *              load the corresponding docs
 */
RouteRegister(md_space)
  .registerRoute(
    "/",
    PageComponent(
      RootComponent(),
      null,  // Changed from '' to null to be more explicit about no data needed
      () => {
        return Article({}, [P({}, [t("Could not load??")])]);
      },
      () => {
        setTimeout(() => navigateTo("/hyperfx"), 6);
      }
    )
  )
  .registerRoute(
    "/hyperfx",
    PageComponent(
      RootComponent(),
      null,  // Changed from 1 to null since we're not using the data
      () => {
        const doc = GetQueryValue("doc") || "main";
        const md_doc = docsMD.find((a) => a.route_name == doc);

        if (md_doc) {
          const doc_element = Div({ class: "flex flex-auto " }, [
            SideNavComp.currentRender,
            Article({
              class: "p-4 flex flex-col overflow-auto mx-auto",
            }).With$HFX((e) => {
              e.innerHTML = parse(md_doc.data) as string;
            }),
          ]);

          const code_blocks = doc_element.querySelectorAll("pre code");

          for (const code_block of code_blocks) {
            hljs.highlightElement(code_block as HTMLElement);
          }
          Title(`${md_doc.title} | HyperFX`);
          MetaDescription(`HyperFX docs about ${md_doc.title}.`);

          return doc_element;
        } else if (doc == "main") {
          Title("HyperFX docs");
          MetaDescription("Learn HyperFX todo and 'Read The Friendly Manual'!");

          return Div({}, [

            Article({ class: "p-4 mx-auto" }, []).With$HFX((a) => {
              a.innerHTML = hello_text;
            }),
            Div({ class: 'p-2 bg-red-950 text-white' }, [
              P({ class: "text-xl" }, [
                t`This is a work in progress!`,
              ]),
              P({ class: "text-xl" }, [
                t`The docs are not finished yet!`,
              ]),
              P({ class: "text-xl" }, [
                t`Does ${myStr} template to textnode even work?`,
              ]),
            ])
          ]);
        } else Title(`Doc '${doc}' not found :( | HyperFX`);
        MetaDescription(`This docs for '${doc}' does not exist!`);

        return Div({ class: "text-xl p-4" }, [
          P({}, [t(`The docs for '${doc}' could not be found : (`)]),
          Br({}),
          A({ href: "/hyperfx", class: "underline text-blue-400" }, [
            t("Go back"),
          ]),
        ]);
      },
      () => { }
    )
  )
  .registerRoute(
    "editor",
    PageComponent(
      RootComponent(),
      null,  // Changed from undefined to null to match ComponentData type
      () => {
        return Div({ class: "flex flex-col p-4 max-w-[80vw] mx-auto" }, [
          Div({ class: "p-2" }, [
            P({ class: "mx-auto" }, [
              t("This is the code used to create the editor."),
              Span({ class: "text-purple-500/80" }, [
                t(
                  " (The editor is far from done but it is still cool IMO. (The web standards for creating a editor with 'contenteditable' is still kinda rough, especially the `selector` thing is annoying (and I have skill issues/(not enough times)). (uhm i need to seperate a lot stuff into easier functions and stuff) ))"
                ),
              ]),
            ]),
            Div({ class: " px-4 overflow-y-scroll overflow-x-scroll" }, [
              Pre({ class: "mx-auto !max-w-[70vw] max-h-[50vw]" }, [
                Code({}, [t(editor_code)]),
              ]),
            ]).With$HFX((div) => {
              hljs.highlightElement(div.firstChild!.firstChild as HTMLElement);
            }),
          ]),
          editor(),
        ]);
      },
      () => { }
    )
  )
  .enable();
