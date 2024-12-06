import {
  Div,
  elementToHFXObject,
  HFXObjectToElement,
  P,
  t,
  Output,
  Title,
  Pre,
  nodeToHFXObject,
  Button,
  Article,
  Span,
} from "hyperfx";
import type { HFXObject } from "hyperfx";
const state = {
  article: "todo" as HFXObject,
  title: "Editor, you need to set a title :)",
};
const editor_content_id = "editor_content" as const;
const editor_preview_id = "editor_preview" as const;
const editor_json_id = "editor_json" as const;

export function editor() {
  const prev = preview();
  return Div({ class: "p-2 w-full flex flex-auto gap-4 flex-col" }, [
    Div({ id: "article_editor" }, [
      Div({ id: "edit_buttons", class: "p-2 flex" }, [
        P({}, [t("What")]),
        Button(
          {
            class:
              "p-2 rounded-md bg-zinc-800 border-2 border-zinc-950 font-bold",
          },
          [t("Bold selection")]
        ).WithEvent$HFX("mousedown", (_) => {
          const selection = document.getSelection();
          if (!selection) return;
          if (!selection.anchorNode) return;
          const start = selection.anchorNode;
          if (start instanceof Text) {
            const toBold = start.splitText(selection.anchorOffset);
            const parent = start.parentElement!;
            const toInsert = Span(
              {
                style: `font-weight: ${parent.style.fontWeight.includes("bold") ? "normal" : "bold"}`,
              },
              [t(toBold.textContent ?? "")]
            );
            parent.insertBefore(toInsert, toBold);
            parent.removeChild(toBold);
          } else {
            const node = start as HTMLElement;
            if (node.style.fontWeight.includes("bold")) {
              node.style.fontWeight = "normal";
            } else {
              node.style.fontWeight = "bold";
            }
          }
          //    const offset = selection.anchorOffset;
        }),
      ]),
      Div({ class: "border-2 rounded-md p-2 bg-white text-black" }, [
        Div(
          {
            id: editor_content_id,
            class: "",
          },
          [
            attachtListener(
              Article({ contenteditable: "true" }, [P({}, [t("Edit me!")])])
            ),
          ]
        ),
      ]),
    ]),
    Div({}, [P({ class: "text-xl font-semibold" }, [t("Preview:")]), prev]),
    Div({ class: "p-2 bg-purple-950 rounded-md " }, [
      P({ class: "text-xl font-semibold" }, [t("JSON:")]),
      json_representation(prev),
    ]),
  ]);
}

function CreateEditDiv() {
  return attachtListener(Div({}, [P({}, [t(" ")])]));
}

function attachtListener<T extends HTMLElement>(el: T): T {
  return el.WithEvent$HFX("input", (e) => {
    const editorEl = (e as InputEvent).target as HTMLElement;
    for (const c of editorEl.children) {
      if (c instanceof Text) {
        const n = CreateEditDiv();
        n.innerText = c.textContent || " ";
        c.replaceWith(n);
      }
    }
    state.article = nodeToHFXObject(
      document.getElementById(editor_content_id)!
    );
    const nPrev = preview();
    document.getElementById(editor_preview_id)!.replaceWith(nPrev);
    document
      .getElementById(editor_json_id)!
      .replaceWith(json_representation(nPrev));
    // editorEl.focus();
  });
}

function preview() {
  Title(state.title);
  const render = HFXObjectToElement(state.article);
  if (render instanceof Text) {
    return Div({ class: "p-2", id: editor_preview_id }, [
      P({ class: "border rounded-md p-2" }, [
        t("Start editing to get a preview!"),
      ]),
    ]);
  }
  removeContentEditable(render);
  return Div(
    { class: "p-2 border-2 bg-white text-black", id: editor_preview_id },
    [render as HTMLElement]
  );
}
function removeContentEditable(e: Element) {
  e.removeAttribute("contenteditable");
  for (const e2 of e.children) {
    removeContentEditable(e2);
  }
}

function json_representation(prev: Element) {
  return Div(
    {
      id: editor_json_id,
      class: "bg-black/20 p-2 border-2 border-gray-500 rounded-md",
    },
    [
      Output(
        {
          class: " ",
          name: "json_output",
          for: editor_content_id,
        },
        [
          Pre({ class: "overflow-x-scroll" }, [
            t(JSON.stringify(elementToHFXObject(prev), null, "  ")),
          ]),
        ]
      ),
    ]
  );
}
