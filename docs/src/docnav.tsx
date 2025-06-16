import { createSignal, VNode } from "hyperfx";
import { docsMD, prefix_md_doc } from "./docregister";
import { SoftNav } from "./softnav";

export function DocNav(): VNode {
  return (
    <nav className="flex text-2xl p-2 bg-slate-950 text-gray-200">
      <SoftNav className="p-2" href="/hyperfx"
        text="Home"
      />
      <SoftNav className="p-2" href={`${prefix_md_doc}${docsMD[0].route_name}`}
        text={docsMD[0].title}
      />
      
      <SoftNav className="p-2" href="/hyperfx/editor"
        text="Example"
      />
    </nav>
  );
}

const expandSignal = createSignal(false);
function handleToggle() {
  console.log("Toggling side nav");
  const currentExpand = expandSignal();

  expandSignal(!currentExpand);

}

export function SideNavComp(){
    return (
      <aside className="bg-slate-900 text-gray-100 text-xl border-r border-indigo-950 p-2">
        <button
          className="text-indigo-300 border border-indigo-300 p-2 rounded-xl sm:hidden"
          title="Toggle Navigation"
          onclick={handleToggle}
        >
          <span className="text-2xl">☰</span>
          <span className="sr-only">Toggle Navigation</span>
        </button>

        <nav className={() => `flex-col flex-auto flex-grow sm:flex ${expandSignal() ? "flex" : "hidden"}`}>
          {docsMD.map((a) => (
            <SoftNav
              key={a.route_name}
              className="p-2 w-min underline text-blue-300"
              href={`${prefix_md_doc}${a.route_name}`}
              text={a.title}
            >
            </SoftNav>
          ))}
        </nav>
      </aside>
    );
  }



