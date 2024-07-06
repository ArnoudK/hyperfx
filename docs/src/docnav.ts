import { Nav, t, A, Aside } from "hyperfx";
import { docsMD, prefix_md_doc } from "./docregister";

export function DocNav() {
  //TODO mobile first???
  return Nav(
    { class: "flex p-2 bg-slate-950 text-gray-200" },
    A({ class: "p-2", href: "/hyperfx" }, t("home")),
    A(
      { class: "p-2", href: `${prefix_md_doc}${docsMD[0].route_name}` },
      t("Get started")
    )
  );
}

export function SideNav() {
  return Aside(
    {
      class:
        "w-52 max-w-52 p-4 overflow-y-auto flex flex-col flex-auto flex-grow bg-slate-900 text-gray-100 text-xl",
    },
    ...docsMD.map((a) => {
      return A(
        {
          class: "p-2 w-min underline text-blue-300",
          href: `${prefix_md_doc}${a.route_name}`,
        },
        t(a.title)
      );
    })
  );
}
