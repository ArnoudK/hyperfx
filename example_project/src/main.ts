import {
  Component,
  P,
  RootComp,
  t,
  Div,
  RouteRegister,
  PageComponent,
  Label,
  Span,
  GetParamValue,
  Main,
  ArrayComponent,
  VNode,
  createSignal,
  reactiveText,
  reactiveElement,
} from "hyperfx";
import { Navbar } from "./components/nav";
import { createAdvancedFeaturesDemo } from "./components/advanced-demo";
import { JSXDemo } from "./components/jsx-demo";
import { ListPerformanceTest } from "./components/list-performance-test";
import { SimpleListDemo } from "./components/simple-list-demo";
import { FineGrainedTest } from "./components/fine-grained-test";
import { SSRDemo } from "./components/ssr-demo";

// Global reactive state
const counterSignal = createSignal(0);
const textSignal = createSignal("Hello, world!");

// Create a container element in the DOM if it doesn't exist
let appContainer = document.getElementById("app-root");
if (!appContainer) {
  appContainer = document.createElement("div");
  appContainer.id = "app-root";
  document.body.appendChild(appContainer);
}

// Create the main RootComp
const root = new RootComp();

// Create the main app layout structure as a single component
const appLayout = Component(root, {}, (): VNode => {
  return Div({ class: "min-h-screen bg-slate-800 text-indigo-300" }, [
    // Navbar at the top
    Navbar(),
    
    // Main content area with router outlet
    Main({ class: "container mx-auto px-4 py-8" }, [
      Div({ id: "page-router-outlet", class: "w-full" }) // This will be the router target
    ])
  ]);
});

// Mount the root component
root.mountTo(appContainer);

// Get the router outlet element after mounting
const routerOutletElement = appContainer.querySelector("#page-router-outlet") as HTMLElement;

if (!routerOutletElement) {
  console.error("Fatal: Router outlet element not found after mounting root component.");
  throw new Error("Router outlet not found");
}

// Initialize the router
RouteRegister(routerOutletElement)
  .registerRoute(
    "/",
    PageComponent(
      appLayout,
      null,
      (_pageData, _pageCompInstance): VNode => {
        // Using the new reactive system for fine-grained updates
        // Now only the specific elements will update, not the entire page
        
        // Create reactive counter display - only this text updates when counter changes
        const counterDisplay = reactiveText(
          () => `Count: ${counterSignal()}`,
          'p'
        );
        counterDisplay.props = { 
          class: "text-lg text-green-400 font-semibold" 
        };
        
        // Create reactive button with dynamic text - only button text updates
        const incrementButton = reactiveElement('button', {
          class: "inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer",
          onclick: (e: Event) => {
            e.preventDefault();
            counterSignal(counterSignal() + 1);
          }
        }, {
          textContent: () => `Increment (${counterSignal()})`
        });
        
        // Create reactive text display for the textarea - only this updates when text changes
        const textDisplay = reactiveText(
          textSignal,
          'pre'
        );
        
        // Create reactive textarea with value binding
        const textInput = reactiveElement('textarea', {
          class: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors",
          name: "live_type",
          id: "live_type_input",
          oninput: (e: Event) => {
            const target = e.target as HTMLTextAreaElement;
            textSignal(target.value);
          },
        }, {
          value: textSignal
        });

        return Div({ class: "space-y-6" }, [
          P({ class: "text-xl font-semibold text-gray-200 mb-4" }, [t`Main Page`]),
          P({ class: "text-red-400 font-medium mb-4" }, [t`This is a red paragraph`]),
          
          // Reactive counter display - fine-grained update
          counterDisplay,
          
          // Reactive increment button - fine-grained update
          incrementButton,
          
          // Interactive text component with fine-grained updates
          Div({ class: "bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto my-4 border border-gray-700" }, [
            P({ class: "text-3xl font-bold text-gray-100 mb-4" }, [
              Span({ class: "text-purple-400" }, [t("Text: ")]),
              textDisplay, // Only this updates when text changes
            ]),
            Label({ for: "live_type_input", class: "block text-sm font-medium text-gray-300 mb-2" }, [t("Live Update")]),
            P({ class: "text-gray-400 mb-4" }, [
              t`This is basic text with a `,
              Span({ class: "font-bold text-purple-400" }, [t("bold")]),
              t` text in the middle.`,
            ]),
            textInput, // Reactive input with value binding
          ])
        ]);
      },
      { onPageLoad: () => console.log("Main page loaded (/)") }
    )
  )
  .registerRoute(
    "/features",
    PageComponent(
      appLayout,
      null,
      (_pageData, _pageCompInstance): VNode => {
        return createAdvancedFeaturesDemo();
      },
      { onPageLoad: () => console.log("Advanced features page loaded (/features)") }
    )
  )
  .registerRoute(
    "/deez",
    PageComponent(
      appLayout,
      { timeTaken: -1 },
      (_pageData, pageCompInstance): VNode => {
        const amount = 1e3; // Keep it reasonable for performance
        const items = Array.from({ length: amount }, (_, i) => `paragraph: ${i}`);

        const arrayComp = ArrayComponent(
          pageCompInstance,
          items,
          (itemData, _i): VNode => 
            P({ class: "p-3 bg-gray-800 rounded-md mb-2 hover:bg-gray-700 transition-colors text-gray-300" }, [t`${itemData}`])
        );
        
        const arrayCompVNodes = arrayComp.Render();

        return Div({ class: "space-y-6" }, [
          P({ class: "text-2xl font-bold text-gray-100 mb-4" }, [t`DEEZ IS ALSO WORKING`]),
          P({ class: "text-lg text-gray-400 mb-6" }, [t`Rendering ${amount} items`]),
          Div({ class: "max-h-96 overflow-y-auto space-y-2" }, arrayCompVNodes),
        ]);
      },
      { onPageLoad: () => console.log("Deez page loaded (/deez)") }
    )
  )
  .registerRoute(
    "/deez/[myparam]",
    PageComponent(
      appLayout,
      null,
      (_pageData, _pageCompInstance): VNode => {
        return Div({ class: "space-y-6" }, [
          Main({ class: "bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700" }, [
            P({ class: "text-xl text-gray-200 mb-4" }, [t`Parameter Demo`]),
            P({ class: "text-lg" }, [
              t`Parameter value: `,
              Span({ class: "font-semibold text-purple-400" }, [t`${GetParamValue("myparam") ?? "undefined"}`]),
            ]),
          ]),
        ]);
      },
      { 
        onPageLoad: (_route, _comp) => {
          const param = GetParamValue("myparam");
          console.log(`Deez param page loaded: /deez/${param}`);
        }
      }
    )
  )
  .registerRoute(
    "/features",
    PageComponent(
      appLayout,
      null,
      (_pageData, _pageCompInstance): VNode => {
        return createAdvancedFeaturesDemo();
      },
      { onPageLoad: () => console.log("Advanced features demo loaded (/features)") }
    )
  )
  .registerRoute(
    "/jsx-demo",
    PageComponent(
      appLayout,
      null,
      (_pageData, _pageCompInstance): VNode => {
        return JSXDemo();
      }
    )
  )
  .registerRoute(
    "/list-test",
    PageComponent(
      appLayout,
      null,
      (_pageData, _pageCompInstance): VNode => {
        return ListPerformanceTest();
      }
    )
  )
  .registerRoute(
    "/todo-demo",
    PageComponent(
      appLayout,
      null,
      (_pageData, _pageCompInstance): VNode => {
        return SimpleListDemo();
      }
    )
  )
  .registerRoute(
    "/fine-grained-test",
    PageComponent(
      appLayout,
      null,
      (_pageData, _pageCompInstance): VNode => {
        return FineGrainedTest();
      }
    )
  )
  .registerRoute(
    "/ssr-demo",
    PageComponent(
      appLayout,
      null,
      (_pageData, _pageCompInstance): VNode => {
        return SSRDemo();
      }
    )
  )
  .enable();


