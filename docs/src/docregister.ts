import { parse } from "marked";

// import MD files
import basics from "../assets/docs/basics.md?raw";
import example from "../assets/docs/example.md?raw";
import getting_started from "../assets/docs/getting_started.md?raw";

import {
  Div,
  Main,
  PageComponent,
  RootComponent,
  RouteRegister,
  Title,
} from "hyperfx";
import { SideNav } from "./docnav";

type regtype = {
  title: string;
  route_name: string;
  data: string;
};

export const prefix_md_doc = "/docs/" as const;
export const docsMD: regtype[] = [
  {
    title: "Getting Started",
    route_name: "start",
    data: getting_started,
  },
  {
    title: "HyperFX basics",
    route_name: "basics",
    data: basics,
  },
  {
    title: "HyperFX example code",
    route_name: "example",
    data: example,
  },
] as const;

export function RegisterDocs(reg: ReturnType<typeof RouteRegister>) {
  for (const doc of docsMD) {
    reg.registerRoute(
      `${prefix_md_doc}${doc.route_name}`,
      PageComponent(
        RootComponent(),
        null,
        () => {
          return Div(
            { class: "flex flex-auto w-full " },
            SideNav(),
            Main({ class: "p-4 w-full" }).Modify$HFX((e) => {
              e.innerHTML = parse(doc.data) as string;
            })
          );
        },
        () => {
          Title(doc.title);
        }
      )
    );
  }
  return reg;
}
