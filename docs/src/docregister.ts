// import MD files
import basics from "../assets/docs/basics.md?raw";
import spa from "../assets/docs/spa.md?raw";
import components from "../assets/docs/components.md?raw";
import getting_started from "../assets/docs/getting_started.md?raw";

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
    title: "HyperFX components",
    route_name: "components",
    data: components,
  },
  {
    title: "HyperFX example spa",
    route_name: "spa",
    data: spa,
  },
] as const;
