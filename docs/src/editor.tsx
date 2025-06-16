import {
  HFXObjectToElement,
  nodeToHFXObject,
  VNode,
  createSignal,
  createComputed,
} from "hyperfx";
import type { HFXObject } from "hyperfx";

// Create reactive signals for state management
const articleSignal = createSignal<HFXObject>("todo" as HFXObject);

// Create a derived signal for the preview HTML
const previewHtml = createComputed(() => {
  const articleContent = articleSignal();
  if (typeof articleContent === 'string' || !articleContent) {
    return '<p class="border rounded-md p-2">Start editing to get a preview!</p>';
  }
  
  const render = HFXObjectToElement(articleContent);
  if (render instanceof Text) {
    return '<p class="border rounded-md p-2">Start editing to get a preview!</p>';
  }
  console.log("Preview HTML:", render.outerHTML);
  removeContentEditable(render);
  return render.outerHTML;
});

const editor_content_id = "editor_content" as const;

export function editor(): VNode {
  const handleBoldClick = (e: MouseEvent) => {
    e.preventDefault();
    
    // Get the current selection
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    if (range.collapsed) return; // No text selected
    
    // Create a bold element
    const boldElement = document.createElement('strong');
    
    try {
      // Wrap the selected content in a bold element
      range.surroundContents(boldElement);
      
      // Clear the selection
      selection.removeAllRanges();
      
      // Update the article signal with the new content
      updateArticleFromEditor();
    } catch (error) {
      // If surroundContents fails (e.g., selection spans multiple elements),
      // extract the contents and wrap them
      try {
        const contents = range.extractContents();
        boldElement.appendChild(contents);
        range.insertNode(boldElement);
        
        // Clear the selection
        selection.removeAllRanges();
        
        // Update the article signal
        updateArticleFromEditor();
      } catch (innerError) {
        console.warn('Could not apply bold formatting:', innerError);
      }
    }
  };

  const updateArticleFromEditor = () => {
    const editorEl = document.getElementById(editor_content_id);
    if (editorEl) {
      articleSignal(nodeToHFXObject(editorEl));
    }
  };

  const handleInput = (_e: InputEvent) => {
    // Update the article signal when content changes
    updateArticleFromEditor();
  };

  return (
    <div className="p-2 w-full flex flex-auto gap-4 flex-col">
      <div id="article_editor">
        <div id="edit_buttons" className="p-2 flex gap-2">
          <span>Formatting:</span>
          <button
            className="p-2 rounded-md bg-zinc-800 border-2 border-zinc-950 font-bold text-white hover:bg-zinc-700"
            onMouseDown={handleBoldClick}
            title="Bold selected text"
          >
            <strong>B</strong>
          </button>
        </div>
        <div className="border-2 rounded-md p-2 bg-white text-black">
          <div id={editor_content_id} className="">
            <article contenteditable="true" onInput={handleInput}>
              <p>Edit me! Select some text and click the <strong>B</strong> button to make it bold.</p>
            </article>
          </div>
        </div>
      </div>
      <div>
        <p className="text-xl font-semibold">Preview:</p>
        <div className="p-2 border-2 bg-white text-black">
          <div innerHTML={previewHtml}></div>
        </div>
      </div>
      <div className="p-2 bg-purple-950 rounded-md">
        <p className="text-xl font-semibold">JSON:</p>
        <div className="bg-black/20 p-2 border-2 border-gray-500 rounded-md">
          <output className="" name="json_output" htmlFor={editor_content_id}>
            <pre className="overflow-x-scroll">
              {() => JSON.stringify(articleSignal(), null, "  ")}
            </pre>
          </output>
        </div>
      </div>
    </div>
  );
}

function removeContentEditable(e: Element) {
  e.removeAttribute("contenteditable");
  for (const e2 of e.children) {
    removeContentEditable(e2);
  }
}