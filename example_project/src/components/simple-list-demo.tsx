// Simple List Demo for For Component Optimization
import { createSignal, For } from "hyperfx";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export function SimpleListDemo() {
  let nextId = 4;
  const todos = createSignal<TodoItem[]>([
    { id: 1, text: "Learn HyperFX", completed: false },
    { id: 2, text: "Build awesome app", completed: false },
    { id: 3, text: "Test smart lists", completed: true }
  ]);

  // This function will only be called when new items are created
  const renderTodoItem = (todo: TodoItem, _index: number) => {
    console.log(`🔄 Rendering todo item: "${todo.text}" (ID: ${todo.id})`);
    
    return (
      <div className={`p-4 border rounded-lg flex items-center justify-between mb-2 transition-colors ${
        todo.completed ? 'bg-green-900 border-green-700' : 'bg-gray-800 border-gray-600'
      }`}>
        <div className="flex items-center space-x-3">
          <span className="text-gray-400 text-sm font-mono">
            #{todo.id}
          </span>
          <p className={`${todo.completed ? 'line-through text-gray-400' : 'text-gray-200'}`}>
            {todo.text}
          </p>
        </div>
        
        <button
          className={`px-3 py-1 rounded text-sm transition-colors ${
            todo.completed 
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
          onClick={() => toggleTodo(todo.id)}
        >
          {todo.completed ? 'Undo' : 'Done'}
        </button>
      </div>
    );
  };

  const addTodo = () => {
    const newTodo: TodoItem = {
      id: nextId++,
      text: `New task #${nextId - 1}`,
      completed: false
    };
    todos([...todos(), newTodo]);
    console.log(`➕ Added new todo: "${newTodo.text}"`);
  };

  const removeTodo = () => {
    const currentTodos = todos();
    if (currentTodos.length > 0) {
      const removed = currentTodos[currentTodos.length - 1];
      todos(currentTodos.slice(0, -1));
      console.log(`➖ Removed todo: "${removed.text}"`);
    }
  };

  const toggleTodo = (id: number) => {
    const updatedTodos = todos().map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    todos(updatedTodos);
    console.log(`✅ Toggled todo with ID: ${id}`);
  };

  const shuffleTodos = () => {
    const shuffled = [...todos()];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    todos(shuffled);
    console.log(`🔀 Shuffled todos`);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6">
      <h3 className="text-2xl font-bold text-purple-400 mb-4">📝 Smart Todo List Demo</h3>
      
      <p className="text-gray-300 mb-4">
        This demo shows VNode reuse optimization. Open browser console to see render logs. 
        Notice that existing items don't re-render when you add/remove/shuffle items!
      </p>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={addTodo}
        >
          + Add Todo
        </button>
        
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          onClick={removeTodo}
        >
          - Remove Last
        </button>
        
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          onClick={shuffleTodos}
        >
          🔀 Shuffle
        </button>
      </div>

      {/* Status */}
      <p className="text-yellow-300 font-medium mb-4">
        Total Items: {todos().length} | Completed: {todos().filter(t => t.completed).length}
      </p>

      {/* Smart List with For component using stable keys */}
      <div className="space-y-2">
        {For(todos, renderTodoItem, (todo) => todo.id)}
      </div>
    </div>
  );
}

