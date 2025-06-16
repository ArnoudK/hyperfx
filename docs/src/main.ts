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
  RenderToBody,
  VNode,
  Fragment,
} from "hyperfx";

import { DocNav, SideNavComp } from "./docnav";

import { parse } from "marked";

import index_md from "../assets/index.md?raw";

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

const myStr = "Hello, world!";
const hello_text = parse(index_md) as string;

const md_space_vnode: VNode = Div({ class: "flex flex-auto flex-col" });

const layoutVNode: VNode = Div({ class: "flex flex-auto flex-col min-h-screen" }, [
  DocNav(),
  Main({ class: "flex flex-auto flex-col" }, [md_space_vnode]),
  Footer({ class: "bg-slate-900 mx-auto w-full min-h-12 p-4 text-center mt-auto" }, [
    A(
      {
        href: "https://github.com/ArnoudK/hyperfx",
        target: "_blank",
        class: "underline",
      },
      [t("Github")]
    ),
    Span({ class: "w-full " }, [t(" - © Arnoud Kerkhof")]),
  ]),
]);

RenderToBody(layoutVNode);

if (!md_space_vnode.dom) {
  console.error("Critical: md_space_vnode.dom was not populated after RenderToBody.");
}

RouteRegister(md_space_vnode.dom as HTMLElement)
  .registerRoute(
    "/",
    PageComponent(
      RootComponent(),
      null,
      (): VNode => {
        return Article({}, [P({}, [t("Loading...")])]);
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
      null,
      (): VNode => {
        const doc = GetQueryValue("doc") || "main";
        const md_doc = docsMD.find((a) => a.route_name == doc);

        if (md_doc) {
          const parsedMarkdown = parse(md_doc.data) as string;
          const articleContentVNode = Div({
            class: "markdown-body",
            innerHTML: parsedMarkdown,
          });

          setTimeout(() => {
            if (articleContentVNode.dom) {
              const code_blocks = (articleContentVNode.dom as HTMLElement).querySelectorAll("pre code");
              for (const code_block of code_blocks) {
                hljs.highlightElement(code_block as HTMLElement);
              }
            }
          }, 0);

          const sideNavNode = SideNavComp.currentRender;
          const sideNavContent = Array.isArray(sideNavNode) 
            ? Fragment(sideNavNode) 
            : sideNavNode || Fragment([]); // Use empty fragment if undefined

          const doc_vnode = Div({ class: "flex flex-auto" }, [
            sideNavContent,
            Article(
              { class: "p-4 flex flex-col overflow-auto mx-auto" },
              [articleContentVNode]
            ),
          ]);

          Title(`${md_doc.title} | HyperFX`);
          MetaDescription(`HyperFX docs about ${md_doc.title}.`);
          return doc_vnode;
        } else if (doc == "main") {
          Title("HyperFX docs");
          MetaDescription("Learn HyperFX todo and 'Read The Friendly Manual'!");

          const mainContentVNode = Div({
            class: "markdown-body-main",
            innerHTML: hello_text,
          });

          return Div({ class: "flex-grow flex flex-col" }, [
            Article({ class: "p-4 mx-auto" }, [mainContentVNode]),
            Div({ class: "p-2 bg-red-950 text-white mt-4" }, [
              P({ class: "text-xl" }, [t`This is a work in progress!`]),
              P({ class: "text-xl" }, [t`The docs are not finished yet!`]),
              P({ class: "text-xl" }, [
                t`Does ${myStr} template to textnode even work?`,
              ]),
            ]),
          ]);
        }
        Title(`Doc '${doc}' not found :( | HyperFX`);
        MetaDescription(`This docs for '${doc}' does not exist!`);

        return Div({ class: "text-xl p-4" }, [
          P({}, [t(`The docs for '${doc}' could not be found : (`)]),
          Br({}),
          A({ href: "/hyperfx", class: "underline text-blue-400" }, [
            t("Go back"),
          ]),
        ]);
      },
      () => {}
    )
  )
  .registerRoute(
    "hyperfx/editor",
    PageComponent(
      RootComponent(),
      null,
      (): VNode => {
        const editorInstanceVNode = editor();
        const codeBlockContentVNode = Code({}, [t(editor_code)]);
        const codeBlockVNode = Pre(
          { class: "mx-auto !max-w-[70vw] max-h-[50vw]" },
          [codeBlockContentVNode]
        );

        setTimeout(() => {
          if (codeBlockContentVNode.dom) {
            hljs.highlightElement(codeBlockContentVNode.dom as HTMLElement);
          } else if (codeBlockVNode.dom) {
            const codeElement = (codeBlockVNode.dom as HTMLElement).querySelector("code");
            if (codeElement) hljs.highlightElement(codeElement as HTMLElement);
          }
        }, 0);

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
              codeBlockVNode,
            ]),
          ]),
          editorInstanceVNode,
        ]);
      },
      () => {}
    )
  )
  .enable();
