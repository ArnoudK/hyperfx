import { A, Aside, Button, Component, Nav, RootComponent, t } from "hyperfx";
import { docsMD, prefix_md_doc } from "./docregister";

export function DocNav() {
  //TODO mobile first???
  return Nav({ class: "flex text-2xl p-2 bg-slate-950 text-gray-200" }, [
    A({ class: "p-2", href: "/hyperfx" }, [t("Home")]),
    A({ class: "p-2", href: `${prefix_md_doc}${docsMD[0].route_name}` }, [
      t(docsMD[0].title),
    ]),
    A({ class: "p-2", href: "/editor" }, [t("Example")]),
  ]);
}

export const SideNavComp = Component(
  RootComponent(),
  { phoneExpand: false },
  (expand, c) =>
    Aside(
      {
        class:
          "bg-slate-900 text-gray-100 text-xl border-r border-indigo-950 p-2",
      },
      [
        Button(
          {
            class: "text-indigo-300 border border-indigo-300 p-2 rounded-xl",
          },
          []
        )
          .WithEvent$HFX("click", () => {
            c.Update({ phoneExpand: !c.data.phoneExpand });
          })
          .With$HFX((e) => {
            if (expand.phoneExpand) {
              e.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" /></svg`;
            } else {
              e.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>`;
            }
          }),
        Nav(
          {
            class: "flex-col flex-auto flex-grow",
            style: c.data.phoneExpand ? "display:flex" : "display:none",
          },
          docsMD.map((a) => {
            return A(
              {
                class: "p-2 w-min underline text-blue-300",
                href: `${prefix_md_doc}${a.route_name}`,
              },
              [t(a.title)]
            );
          })
        ),
      ]
    )
);
