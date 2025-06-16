import {
  VNode,
  Div,
  P,
  Button,
  H2,
  H3,
  createSignal,
  reactiveText,
  If,
  For,
  throttle,
  t,
  Span,
} from "hyperfx";

export function createAdvancedFeaturesDemo(): VNode {
  // Demo state
  const selectedDemo = createSignal<string>('conditional');
  const showDemo = createSignal(false);
  const items = createSignal(['Item 1', 'Item 2', 'Item 3']);
  const throttleCount = createSignal(0);

  // Throttled function
  const throttledIncrement = throttle(() => {
    throttleCount(throttleCount() + 1);
  }, 500);

  const addItem = () => {
    const newItems = items();
    newItems.push(`Item ${newItems.length + 1}`);
    items([...newItems]);
  };

  const removeItem = () => {
    const newItems = items();
    if (newItems.length > 0) {
      newItems.pop();
      items([...newItems]);
    }
  };

  return Div({ class: "space-y-8" }, [
    // Header
    Div({ class: "text-center" }, [
      H2({ class: "text-3xl font-bold text-purple-400 mb-4" }, [t('🚀 Enhanced HyperFX Features')]),
      P({ class: "text-gray-300 mb-6" }, [t('Discover the new capabilities of the HyperFX framework')])
    ]),

    // Demo selector
    Div({ class: "flex flex-wrap gap-2 justify-center mb-8" }, [
      Button({
        class: "px-4 py-2 rounded transition-colors bg-purple-600 text-white",
        onclick: () => selectedDemo('conditional')
      }, [t('Conditional Rendering')]),

      Button({
        class: "px-4 py-2 rounded transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600",
        onclick: () => selectedDemo('lists')
      }, [t('Smart Lists')]),

      Button({
        class: "px-4 py-2 rounded transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600",
        onclick: () => selectedDemo('performance')
      }, [t('Performance')])
    ]),

    // Demo content
    Div({ class: "bg-gray-800 rounded-lg p-6 border border-gray-700" }, [
      // Conditional Rendering Demo
      If(() => selectedDemo() === 'conditional', () =>
        Div({ class: "space-y-4" }, [
          H3({ class: "text-xl font-semibold text-blue-400 mb-4" }, [t('🔀 Conditional Rendering')]),
          P({ class: "text-gray-300 mb-4" }, [t('Toggle content in and out of the DOM efficiently.')]),
          
          Button({
            class: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors",
            onclick: () => showDemo(!showDemo())
          }, [
            reactiveText(() => showDemo() ? 'Hide Demo' : 'Show Demo')
          ]),

          Div({ class: "mt-4" }, [
            // Using If component
            If(showDemo, () =>
              Div({ class: "p-4 bg-green-900 border border-green-600 rounded" }, [
                P({ class: "text-green-200" }, [t('✨ This content is conditionally rendered!')]),
                P({ class: "text-green-300 text-sm mt-2" }, [t('It only exists in the DOM when showDemo is true.')])
              ])
            )
          ])
        ])
      ),

      // Smart Lists Demo
      If(() => selectedDemo() === 'lists', () =>
        Div({ class: "space-y-4" }, [
          H3({ class: "text-xl font-semibold text-green-400 mb-4" }, [t('📋 Smart Lists')]),
          P({ class: "text-gray-300 mb-4" }, [t('Efficiently render dynamic lists with minimal updates.')]),
          
          Div({ class: "flex gap-2 mb-4" }, [
            Button({
              class: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors",
              onclick: addItem
            }, [t('Add Item')]),
            
            Button({
              class: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors",
              onclick: removeItem
            }, [t('Remove Item')])
          ]),

          Div({ class: "space-y-2" }, [
            P({ class: "text-gray-400" }, [
              reactiveText(() => `Items: ${items().length}`)
            ]),
            
            For(items, (item, index) =>
              Div({
                class: "p-3 bg-gray-700 rounded border border-gray-600 flex justify-between items-center"
              }, [
                Span({ class: "text-gray-200" }, [t(item)]),
                Span({ class: "text-gray-400 text-sm" }, [t(`#${index + 1}`)])
              ])
            )
          ])
        ])
      ),

      // Performance Demo
      If(() => selectedDemo() === 'performance', () =>
        Div({ class: "space-y-4" }, [
          H3({ class: "text-xl font-semibold text-red-400 mb-4" }, [t('⚡ Performance Features')]),
          P({ class: "text-gray-300 mb-4" }, [t('Built-in performance optimizations and utilities.')]),
          
          Div({ class: "p-4 bg-yellow-900 border border-yellow-600 rounded" }, [
            H3({ class: "text-yellow-200 font-semibold mb-2" }, [t('🕒 Throttling Demo')]),
            P({ class: "text-yellow-300 mb-3" }, [t('Click rapidly - updates are throttled to 500ms intervals.')]),
            
            Button({
              class: "px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors",
              onclick: throttledIncrement
            }, [t('Throttled Click')]),
            
            P({ class: "text-yellow-200 mt-2" }, [
              t('Throttled count: '),
              reactiveText(() => throttleCount().toString())
            ])
          ]),

          Div({ class: "p-4 bg-indigo-900 border border-indigo-600 rounded mt-4" }, [
            H3({ class: "text-indigo-200 font-semibold mb-2" }, [t('🔄 Fine-grained Reactivity')]),
            P({ class: "text-indigo-300 mb-3" }, [t('Only the specific DOM elements update when data changes.')]),
            P({ class: "text-indigo-400 text-sm" }, [
              t('Open browser dev tools to see minimal DOM updates in action!')
            ])
          ])
        ])
      )
    ])
  ]);
}
