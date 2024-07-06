import {
  Div,
  RouteRegister,
  PageComponent,
  RootComponent,
  navigateTo,
} from "hyperfx";
import { parse } from "marked";
import md from "../assets/index.md?raw";
import { DocNav } from "./docnav";
import { RegisterDocs } from "./docregister";
const appRoot = document.getElementById("app")!;

const rootComp = RootComponent();

const helloText = parse(md) as string;

const mdSpace = Div({ class: "flex flex-auto flex-col" });

const layOut = Div(
  { class: "flex flex-auto flex-col" },
  DocNav(),
  mdSpace
  //Footer()
);
appRoot.appendChild(layOut);

const rr = RouteRegister(mdSpace)
  .registerRoute(
    "/",
    PageComponent(
      rootComp,
      null,
      () => {
        return Div({}).Modify$HFX((a) => {
          a.innerHTML = helloText;
        });
      },
      () => {
        navigateTo("/hyperfx");
      }
    )
  )
  .registerRoute(
    "/hyperfx",
    PageComponent(
      rootComp,
      null,
      () => {
        return Div({}).Modify$HFX((a) => {
          a.innerHTML = helloText;
        });
      },
      () => {}
    )
  );

RegisterDocs(rr);
rr.enable();
