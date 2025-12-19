import { createSignal, JSX, Link, For, createComputed } from "hyperfx";
import { docsMD, prefix_md_doc } from "./docregister";

export function DocNav(): JSX.Element {

  return (
    <nav class="flex text-xl p-3 bg-slate-950 text-gray-200 border-b border-indigo-950/50 shadow-lg">
      <Link
        class="px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400"
        to="/hyperfx"
      >
        Home
      </Link>
      <Link
        class="px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400"
        to="/hyperfx?doc=get_started"
      >
        Docs
      </Link>
      <Link
        class="px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400"
        to="/hyperfx/editor"
      >
        Example
      </Link>
    </nav>
  );
}

const expandSignal = createSignal(false);
function handleToggle() {
  console.log(expandSignal(!expandSignal()));
}

export function SideNavComp(): JSX.Element {
  const expandClass = createComputed(() => {
    return `flex-col sm:flex gap-1 ${expandSignal() ? "flex" : "hidden"}`
  })

  return (
    <aside class="bg-slate-900 text-gray-100  border-r border-indigo-950/50 p-2 sm:p-4 shadow-xl">
      <div class="flex items-center justify-between mb-6 sm:hidden">
        <button
          class="text-indigo-300 border border-indigo-800/50 p-2 rounded-xl active:scale-95 transition-transform"
          title="Toggle Navigation"
          onclick={handleToggle}
        >
          <span class="text-lg">☰</span>
          <span class="sr-only">Toggle Navigation</span>
        </button>
      </div>

      <nav class={expandClass}>
        <p class="hidden sm:block text-xs font-bold uppercase min-w-64 tracking-widest text-indigo-400/40 mb-3 px-3">
          Fundamentals
        </p>
        <For each={docsMD}>
          {a => (
            <Link
              class="px-3 py-2 rounded-lg text-base transition-all duration-200 no-underline block"
              to={`${prefix_md_doc}${a.route_name}`}
            >
              {a.title}
            </Link>
          )}
        </For>
      </nav>
    </aside>
  );
}



