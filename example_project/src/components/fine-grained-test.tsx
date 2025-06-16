// Fine-grained Rendering Test Component
import { createSignal, For } from "hyperfx";

interface TestItem {
  id: number;
  text: string;
  color: string;
}

export function FineGrainedTest() {
  let nextId = 4;
  const items = createSignal<TestItem[]>([
    { id: 1, text: "Item 1", color: "blue" },
    { id: 2, text: "Item 2", color: "green" },
    { id: 3, text: "Item 3", color: "red" }
  ]);

  const renderItem = (item: TestItem, _index: number) => {
    const timestamp = Date.now();
    console.log(`🔄 Rendering item ${item.id}: "${item.text}" at ${timestamp}`);
    
    return (
      <div
        className={`p-4 border-2 rounded-lg mb-2 transition-all duration-300 bg-${item.color}-900 border-${item.color}-700`}
        data-item-id={String(item.id)}
        data-render-time={String(timestamp)}
      >
        <div className="flex justify-between items-center">
          <span className="text-white font-bold">ID: {item.id}</span>
          <span className="text-gray-300">{item.text}</span>
          <button
            className="px-2 py-1 bg-white text-black rounded text-sm"
            onClick={() => changeColor(item.id)}
          >
            Change Color
          </button>
        </div>
        
        <p 
          className="text-xs text-gray-400 mt-2"
          data-node-tracker={String(item.id)}
        >
          Rendered at: {new Date(timestamp).toLocaleTimeString()}
        </p>
      </div>
    );
  };

  const addItem = () => {
    const colors = ['blue', 'green', 'red', 'purple', 'yellow', 'pink'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newItem: TestItem = {
      id: nextId++,
      text: `Item ${nextId - 1}`,
      color: randomColor
    };
    items([...items(), newItem]);
    console.log(`➕ Added item ${newItem.id} with color ${newItem.color}`);
  };

  const removeItem = () => {
    const currentItems = items();
    if (currentItems.length > 0) {
      const removed = currentItems[currentItems.length - 1];
      items(currentItems.slice(0, -1));
      console.log(`➖ Removed item ${removed.id}`);
    }
  };

  const changeColor = (id: number) => {
    const colors = ['blue', 'green', 'red', 'purple', 'yellow', 'pink'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const updatedItems = items().map(item => 
      item.id === id ? { ...item, color: randomColor } : item
    );
    items(updatedItems);
    console.log(`🎨 Changed color of item ${id} to ${randomColor}`);
  };

  const updateText = (id: number) => {
    const newText = `Updated Item ${id} - ${Date.now()}`;
    const updatedItems = items().map(item => 
      item.id === id ? { ...item, text: newText } : item
    );
    items(updatedItems);
    console.log(`📝 Updated text of item ${id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6">
      <h3 className="text-2xl font-bold text-blue-400 mb-4">🔬 Fine-Grained Rendering Test</h3>
      
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 mb-4">
        <p className="text-yellow-300 font-semibold mb-2">🧪 Test Instructions:</p>
        <p className="text-gray-300 text-sm mb-2">
          1. Open browser console to see rendering logs
        </p>
        <p className="text-gray-300 text-sm mb-2">
          2. Watch console logs - only changed items should log "Rendering"
        </p>
        <p className="text-gray-300 text-sm mb-2">
          3. Existing items should NOT re-render when adding/removing other items
        </p>
        <p className="text-gray-300 text-sm">
          4. Check timestamps in items - unchanged items keep old timestamps
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          onClick={addItem}
        >
          ➕ Add Item
        </button>
        
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          onClick={removeItem}
        >
          ➖ Remove Last
        </button>
        
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          onClick={() => {
            const currentItems = items();
            if (currentItems.length > 0) {
              updateText(currentItems[0].id);
            }
          }}
        >
          📝 Update First Item
        </button>
      </div>

      {/* Status */}
      <p className="text-yellow-300 font-medium mb-4">
        Total Items: {items().length}
      </p>

      {/* Fine-grained list test */}
      <div className="space-y-2">
        {For(items, renderItem, (item) => item.id)}
      </div>
    </div>
  );
}
