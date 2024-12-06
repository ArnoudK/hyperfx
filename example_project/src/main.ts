import {
  Component,
  A,
  P,
  RootComponent,
  t,
  Input,
  Div,
  RouteRegister,
  PageComponent,
  Label,
  Span,
  GetParamValue,
  GetQueryValue,
  Main,
} from "hyperfx";

import { Navbar } from "./components/nav";

const root = RootComponent();

const myComp = Component(root, { a: "" }, (d, c) => {
  return Div({ class: " p-2" }, [
    P({ class: "text-2xl text-red-500" }, [
      Span({ class: "font-semibold" }, "Text: "),
      t(d.a),
    ]),
    Label({ for: "live_type" }, [t("live update ")]),
    P({}, [
      t("This is basic text with a "),
      Span({ style: "font-weight: bold;" }, "bold"),
      t(" text in the middle."),
    ]),
    Input({
      class: "border-2 rounded-xl p-2 ",
      name: "live_type",
      id: "live_type_input",
      type: "text",
      value: d.a,
    }).WithEvent$HFX("input", (e) => {
      //@ts-expect-error (.value is not implented/documented by the MDN types reference)
      const nval = e.target!.value;
      c.Update({ a: nval });
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
        const content: HTMLElement[] = [
          Navbar(),
          myComp.Render(),
          P({}, [t("main page")]),
          P({ class: "text-red-500" }, [t("This is a red paragraph")]),
          A({ class: "underline text-blue-500", href: `/?val=${val + 1}` }, [
            t(`Incr I ${val}`),
          ]),
        ];
        return Div({}, content);
      },
      () => {}
    )
  )
  .registerRoute(
    "/deez",
    PageComponent(
      root,
      null,
      () => {
        const amount = 1e5 as const;
        const a = [
          Navbar(),
          myComp.Render(),
          P({}, [t("DEEZ IS ALSO WORKING")]),
          P({}, [t(`Rendering with: ${amount}`)]),
        ];
        for (let i = 0; i < amount; i++) {
          a.push(P({ class: "p-2 " }, [t(`paragraph: ${i}`)]));
        }
        return Div({}, a);
      },
      () => {}
    )
  )
  .registerRoute(
    "/deez/[myparam]",
    PageComponent(
      root,
      null,
      () => {
        return Div({}, [
          Navbar(),
          Main({ class: "p-4" }, [
            P({}, [
              t(`myparam value: ${GetParamValue("myparam") ?? "undefined"}`),
            ]),
          ]),
        ]);
      },
      () => {}
    )
  )
  .enable();
