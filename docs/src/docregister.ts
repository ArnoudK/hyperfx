// import MD files
import basics from "../assets/docs/basics.md?raw";
import example from "../assets/docs/example.md?raw";
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
    title: "HyperFX example code",
    route_name: "example",
    data: example,
  },
] as const;
