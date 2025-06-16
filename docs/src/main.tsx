import {
  GetQueryValue,
  MetaDescription,
  PageComponent,
  RootComp,
  RouteRegister,
  Title,
  navigateTo,
  RenderToBody,
  VNode,
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
import { SoftNav } from "./softnav";

hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("html", html);
hljs.registerLanguage("bash", bash);

const myStr = "Hello, world!";
const hello_text = parse(index_md) as string;

// Main layout component using JSX
function MainLayout(): VNode {
  return (
    <div className="flex flex-auto flex-col min-h-screen">
      <DocNav />
      <main className="flex flex-auto flex-col" id="main-content">
        {/* Content will be dynamically inserted here by RouteRegister */}
      </main>
      <footer className="bg-slate-900 mx-auto w-full min-h-12 p-4 text-center mt-auto">
        <a
          href="https://github.com/ArnoudK/hyperfx"
          target="_blank"
          className="underline"
        >
          Github
        </a>
        <span className="w-full "> - © Arnoud Kerkhof</span>
      </footer>
    </div>
  );
}

// Loading component
function LoadingPage(): VNode {
  return (
    <article>
      <p>Loading...</p>
    </article>
  );
}

// Documentation page component
function DocumentationPage(): VNode {
  const doc = GetQueryValue("doc") || "main";
  const md_doc = docsMD.find((a) => a.route_name == doc);

  if (md_doc) {
    const parsedMarkdown = parse(md_doc.data) as string;
    
    // Create article content with parsed markdown
    const articleContent = (
      <div 
        className="markdown-body"       
        innerHTML={parsedMarkdown}
      />
    );

    // Highlight code blocks after render
    setTimeout(() => {
      const codeBlocks = document.querySelectorAll("pre code");
      for (const codeBlock of codeBlocks) {
        hljs.highlightElement(codeBlock as HTMLElement);
      }
    }, 0);

  

    Title(`${md_doc.title} | HyperFX`);
    MetaDescription(`HyperFX docs about ${md_doc.title}.`);
    
    return (
      <div className="flex flex-auto">
        <SideNavComp />
        <article className="p-4 flex flex-col overflow-auto mx-auto">
          {articleContent}
        </article>
      </div>
    );
  } else if (doc == "main") {
    Title("HyperFX docs");
    MetaDescription("Learn HyperFX todo and 'Read The Friendly Manual'!");

    return (
      <div className="flex-grow flex flex-col">
        <article className="p-4 mx-auto">
          <div 
            className="markdown-body-main"
            innerHTML={hello_text}
          />
        </article>
        <div className="p-2 bg-red-950 text-white mt-4">
          <p className="text-xl">This is a work in progress!</p>
          <p className="text-xl">The docs are not finished yet!</p>
          <p className="text-xl">
            Does {myStr} template to textnode even work?
          </p>
        </div>
      </div>
    );
  }

  Title(`Doc '${doc}' not found :( | HyperFX`);
  MetaDescription(`This docs for '${doc}' does not exist!`);

  return (
    <div className="text-xl p-4">
      <p>The docs for '{doc}' could not be found : (</p>
      <br />
      <SoftNav href="/hyperfx" className="underline text-blue-400"
        text="Go back"
      />
    </div>
  );
}

// Editor page component
function EditorPage(): VNode {
  const editorInstance = editor();
  
  const codeBlock = (
    <pre className="mx-auto !max-w-[70vw] max-h-[50vw]">
      <code className='language-tsx' >{editor_code}</code>
    </pre>
  );

  // Highlight code after render
  setTimeout(() => {
    const codeElement = document.querySelector("pre code");
    if (codeElement) {
      hljs.highlightElement(codeElement as HTMLElement);
    }
  }, 0);

  return (
    <div className="flex flex-col p-4 max-w-[80vw] mx-auto">
      <div className="p-2">
        <p className="mx-auto">
          This is the code used to create the editor.
          <span className="text-purple-500/80">
            {" "}(The editor is far from done but it is still cool IMO. (The web standards for creating a editor with 'contenteditable' is still kinda rough, especially the `selector` thing is annoying (and I have skill issues/(not enough times)). (uhm i need to seperate a lot stuff into easier functions and stuff) ))
          </span>
        </p>
        <div className="w-full">
          {codeBlock}
        </div>
      </div>
      {editorInstance}
    </div>
  );
}

// Render the main layout
const layoutVNode = <MainLayout />;
RenderToBody(layoutVNode);

// Wait for DOM to be ready and then register routes
setTimeout(() => {
  // Get the main content container by ID
  const mainElement = document.getElementById("main-content");
  if (!mainElement) {
    console.error("Critical: main-content element was not found after RenderToBody.");
    return;
  }
  const loading = document.getElementById("loading");
  if (loading) {
    loading.remove(); // Remove loading element if it exists
  }

  // Register routes
  RouteRegister(mainElement as HTMLElement)
    .registerRoute(
      "/",
      PageComponent(
        new RootComp(),
        null,
        LoadingPage,
        {
          onPageLoad: () => {
            setTimeout(() => navigateTo("/hyperfx"), 6);
          }
        }
      )
    )
    .registerRoute(
      "/hyperfx",
      PageComponent(
        new RootComp(),
        null,
        DocumentationPage,
        {}
      )
    )
    .registerRoute(
      "hyperfx/editor", 
      PageComponent(
        new RootComp(),
        null,
        EditorPage,
        {}
      )
    )
    .enable();
}, 0);
