import {
  Component,
  P,
  RootComponent,
  WithEventListener,
  t,
  Input,
  Div,
  RouteRegister,
  PageComponent,
  Label,
  Span,
  GetParamValue,
  Main,
} from "hyperfx";

import { Navbar } from "./components/nav";

const root = RootComponent();

const myComp = Component(root, { a: "" }, (d, c) => {
  return Div(
    { class: "" },
    P(
      { class: "text-2xl text-red-500" },
      Span({ class: "font-semibold" }, "Text: "),
      t(d.a)
    ),
    Label({ for: "live_type" }, t("live update ")),
    WithEventListener(
      Input<"text">({
        class: "border-2 rounded-xl p-2 ",
        name: "live_type",
        id: "live_type_input",
        type: "text",
        value: d.a,
      }),
      "input",
      (e) => {
        //@ts-expect-error (.value is not implented/documented by the MDN types reference)
        const nval = e.target!.value;
        c.Update({ a: nval });
      }
    )
  );
});

RouteRegister(document.getElementById("deez")!)
  .registerRoute(
    "/",
    PageComponent(
      root,
      null,

      () => {
        const content: HTMLElement[] = [
          Navbar(),
          myComp.Render(),
          P({}, t("main page")),
          P({ class: "text-red-500" }, t("This is a red paragraph")),
        ];
        return Div({}, ...content);
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
        const a = [Navbar(), myComp.Render(), P({}, t("DEEZ IS ALSO WORKING"))];
        for (let i = 0; i < 1e3; i++) {
          a.push(P({}, t(`paragraph: ${i}`)));
        }
        return Div({}, ...a);
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
        return Div(
          {},
          Navbar(),
          Main(
            { class: "p-4" },
            P(
              {},

              t(`myparam value: ${GetParamValue("myparam") ?? "undefined"}`)
            )
          )
        );
      },
      () => {}
    )
  )
  .enable();
