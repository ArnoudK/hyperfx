import {
  JSX,
  createEffect,
  createComputed,
  Show,
  mountComponent,
} from "hyperfx";

import { DocNav, SideNavComp } from "./docnav";
import { parse } from "marked";
import index_md from "../assets/index.md?raw";
import { docsMD } from "./docregister";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";
import { editor } from "./editor";
import editor_code from "./editor?raw";
import { createRoute, createRouter } from "hyperfx-extra";

hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("html", html);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("json", json);

const hello_text = parse(index_md) as string
// Helper functions for metadata
function Title(title: string) {
  document.title = title;
}

function MetaDescription(description: string) {
  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    meta.setAttribute('content', description);
  }
}

export const DocumentationRoute = createRoute("/hyperfx", {
  view: DocumentationPage,
});

export const EditorRoute = createRoute("/hyperfx/editor", {
  view: EditorPage,
});

const router = createRouter([DocumentationRoute, EditorRoute]);

const RouterComponent = router.Router;

export const Link = router.Link

// Documentation page component
function DocumentationPage(_props: {
  search: {
document?: string;
  }
}) {
  
  const docToRender = createComputed(() => {
    // path();
    // console.log(path());
    const doc = (router.currentSearch().document || "main") as string;
    console.log('docname:', doc);
    const md_doc = docsMD.find((a) => a.route_name == doc);
    if (md_doc) {
      Title(`${md_doc.title} | HyperFX`);
      MetaDescription(`HyperFX docs about ${md_doc.title}.`);
    } else {
      Title("HyperFX");
      MetaDescription("HyperFX docs");
    }
    return md_doc;
  });

  const parsedMarkdown = createComputed(() => {
    const md_doc = docToRender();
    if (md_doc) {
      const data = parse(md_doc.data) as string;
      console.log(data.slice(0, 100));
      return data;
    }
    return "";
  });





  // Highlight code blocks after render
  createEffect(() => {
    router.currentPath(); // Track path for re-highlighting on navigation
    setTimeout(() => {
      const codeBlocks = document.querySelectorAll("pre code");
      for (const codeBlock of codeBlocks) {
        hljs.highlightElement(codeBlock as HTMLElement);
      }
    }, 1);
  });

  return <>
    <Show when={() => parsedMarkdown} >
      <div class="flex flex-auto">
        <SideNavComp />
        <article class="p-4 flex flex-col overflow-auto mx-auto w-full max-w-4xl">
          <div class="markdown-body" innerHTML={parsedMarkdown} />
        </article>
      </div>
    </Show>

    <Show when={() => docToRender() === undefined || docToRender()!.route_name === "main"}>
      <div class="grow flex flex-col">
        <article class="p-4 mx-auto w-full max-w-4xl">
          <div
            class="markdown-body-main"
            innerHTML={hello_text}
          />
        </article>

        <div class="p-2 bg-red-950 text-white mt-4 mx-auto">
          <p class="text-xl">This is a work in progress!</p>
          <p class="text-xl">The docs are not finished yet!</p>
        </div>
      </div>
    </Show>
  </>
}




// Editor page component
function EditorPage(): JSX.Element {
  const editorInstance = editor();

  const codeBlock = (
    <pre class="mx-auto max-w-[70vw]! max-h-[50vw]">
      <code class='language-tsx' >{editor_code}</code>
    </pre>
  );

  // Highlight code after render
  createEffect(() => {
    setTimeout(() => {
      const codeElement = document.querySelector("pre code");
      if (codeElement) {
        if (codeElement.attributes.getNamedItem('data-highlighted')?.value != 'yes')
          hljs.highlightElement(codeElement as HTMLElement);
      }
    }, 0);
  });

  return (
    <div class="flex flex-col p-4 max-w-[80vw] mx-auto">
      <div class="p-2">
        <p class="mx-auto">
          This is the code used to create the editor.
          <span class="text-purple-500/80">
            {" "}(The editor is far from done but it is still cool IMO.)
          </span>
        </p>
        <div class="w-full">
          {codeBlock}
        </div>
      </div>
      {editorInstance}
    </div>
  );
}

function MainLayout(): JSX.Element {
  const navigate = router.navigate;
  const path = router.currentPath;

  createEffect(() => {
    if (path() === "/") {
      navigate("/hyperfx");
    }
  });

  return (
    <div class="flex flex-auto flex-col min-h-screen">
      <DocNav />
      <main class="flex flex-auto flex-col" id="main-content">
        <p class="p-2 bg-red-800 text-white text-center w-full! max-w-full!" >
          A LOT OF CHANGES. DOCS ARE NOT UP TO DATE.
        </p>
      <div>
      <RouterComponent />
      </div>
      </main>
      <footer class="bg-slate-900 mx-auto w-full min-h-12 p-4 text-center mt-auto">
        <a
          href="https://github.com/ArnoudK/hyperfx"
          target="_blank"
          class="underline"
        >
          Github
        </a>
      </footer>
    </div>
  );
}

function App() {
  return <MainLayout />;
}

// Mount the app
const appContainer = document.getElementById('app')!;
// appContainer.replaceChildren(App() as Node);
appContainer.innerHTML = ""; // Clear existing content
mountComponent(App, undefined ,appContainer);