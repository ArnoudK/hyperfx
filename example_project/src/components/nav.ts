import { A, Nav, t } from "hyperfx";
export function Navbar() {
  return Nav(
    { class: "bg-green-800 p-4 font-medium" },
    A({ class: "underline text-blue-300 p-2", href: "/" }, t("home")),
    A(
      {
        class: "text-blue-300 underline p-2",
        href: "/deez",
      },
      t("deez")
    ),
    A(
      { class: "underline text-blue-300 p-2", href: "/deez/the_param_value" },
      t("deez with param")
    )
  );
}
