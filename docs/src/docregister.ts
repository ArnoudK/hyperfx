// import MD files
import basics from "../assets/docs/basics.md?raw";
import spa from "../assets/docs/spa.md?raw";
import components from "../assets/docs/components.md?raw";
import getting_started from "../assets/docs/getting_started.md?raw";
import state_management from "../assets/docs/state-management.md?raw";
import render from "../assets/docs/render.md?raw";
import ssr from "../assets/docs/ssr.md?raw";

type regtype = {
  title: string;
  route_name: string;
  data: string;
};

export const prefix_md_doc = "/hyperfx?doc=" as const;
export const docsMD: regtype[] = [
  {
    title: "Get Started",
    route_name: "get_started",
    data: getting_started,
  },
  {
    title: "HyperFX basics",
    route_name: "basics",
    data: basics,
  },
  {
    title: "State Management",
    route_name: "state-management",
    data: state_management,
  },
  {
    title: "Rendering & Control Flow",
    route_name: "render",
    data: render,
  },
  {
    title: "HyperFX components",
    route_name: "components",
    data: components,
  },
  {
    title: "Single Page Application",
    route_name: "spa",
    data: spa,
  },
  {
    title: "Server-Side Rendering",
    route_name: "ssr",
    data: ssr,
  },
] as const;
