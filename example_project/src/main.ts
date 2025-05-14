import {
  Component,
  A,
  P,
  RootComponent,
  t,
  Div,
  RouteRegister,
  PageComponent,
  Label,
  Span,
  GetParamValue,
  GetQueryValue,
  Main,
  Pre,
} from "hyperfx";

import { Navbar } from "./components/nav";
import { TextArea } from "hyperfx/dist/elem/input";

const root = RootComponent();
let initData = { text: "Hello, world!" };
const myComp = Component(root, { ...initData }, (data, component) => {
  console.log("myComp", data);
  return Div({ class: "bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto my-4 border border-gray-700" }, [
    P({ class: "text-3xl font-bold text-gray-100 mb-4" }, [
      Span({ class: "text-purple-400" }, "Text: "),
      Pre({}, [t(data.text)]),
    ]),
    Label({ for: "live_type", class: "block text-sm font-medium text-gray-300 mb-2" }, [t("Live Update")]),
    P({ class: "text-gray-400 mb-4" }, [
      t`This is basic text with a `,
      Span({ class: "font-bold text-purple-400" }, "bold"),
      t` text in the middle.`,
    ]),
    TextArea({
      class: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors",
      name: "live_type",
      id: "live_type_input",
      value: data.text,
    }).WithEvent$HFX("input", (e) => {
      const target = e.target as HTMLTextAreaElement;
      component.Update({ text: target.value });
    }),
  ]);
});

RouteRegister(document.getElementById("deez")!)
  .registerRoute(
    "/",
    PageComponent(
      root,
      null,
      () => {
        const val = +(GetQueryValue("val") || 0);

        return Div({ class: 'min-h-screen bg-gray-900 container mx-auto px-4 py-8' }, [
          Navbar(),
          myComp.Render(),
          P({ class: "text-xl font-semibold text-gray-200 mb-4" }, [t`Main Page`]),
          P({ class: "text-red-400 font-medium mb-4" }, [t`This is a red paragraph`]),
          A({ class: "inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors", href: `/?val=${val + 1}` }, [
            t`Increment (${val})`,
          ]),
        ]);
      },
      () => { }
    )
  )
  .registerRoute(
    "/deez",
    PageComponent(
      root,
      null,
      () => {
        const amount = 1e4 as const;
        const a = [
          Navbar(),
          myComp.Render(),
          P({ class: "text-2xl font-bold text-gray-100 mb-4" }, [t`DEEZ IS ALSO WORKING`]),
          P({ class: "text-lg text-gray-400 mb-6" }, [t`Rendering with: ${amount}`]),
        ];
        for (let i = 0; i < amount; i++) {
          a.push(P({ class: "p-3 bg-gray-800 rounded-md mb-2 hover:bg-gray-700 transition-colors text-gray-300" }, [t`paragraph: ${i}`]));
        }
        return Div({ class: "min-h-screen bg-gray-900 container mx-auto px-4 py-8" }, a);
      },
      () => { }
    )
  )
  .registerRoute(
    "/deez/[myparam]",
    PageComponent(
      root,
      null,
      () => {
        return Div({ class: "min-h-screen bg-gray-900 container mx-auto px-4 py-8" }, [
          Navbar(),
          Main({ class: "bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700" }, [
            P({ class: "text-xl text-gray-200" }, [
              t`Parameter value: `,
              Span({ class: "font-semibold text-purple-400" }, [t`${GetParamValue("myparam") ?? "undefined"}`]),
            ]),
          ]),
        ]);
      },
      () => { }
    )
  )
  .enable();
