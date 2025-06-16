import { A, Nav, t } from "hyperfx";
export function Navbar() {
  return Nav({ class: "bg-green-800 p-4 font-medium" }, [
    A({ class: "underline text-blue-300 p-2", href: "/" }, [t("home")]),
    A(
      {
        class: "text-blue-300 underline p-2",
        href: "/deez",
      },
      [t("deez")]
    ),
    A({ class: "underline text-blue-300 p-2", href: "/deez/the_param_value" }, [
      t("deez with param"),
    ]),
    A({ class: "underline text-blue-300 p-2", href: "/features" }, [
      t("advanced features"),
    ]),
    A({ class: "underline text-blue-300 p-2", href: "/jsx-demo" }, [
      t("JSX demo"),
    ]),
    A({ class: "underline text-blue-300 p-2", href: "/list-test" }, [
      t("list performance"),
    ]),
    A({ class: "underline text-blue-300 p-2", href: "/todo-demo" }, [
      t("smart todo list"),
    ]),
    A({ class: "underline text-blue-300 p-2", href: "/fine-grained-test" }, [
      t("fine-grained test"),
    ]),
    A({ class: "underline text-blue-300 p-2", href: "/ssr-demo" }, [
      t("SSR demo"),
    ]),
  ]);
}
