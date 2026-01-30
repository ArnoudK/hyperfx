import { createSignal } from 'hyperfx';

function Counter() {
  const [count, setCount] = createSignal(0);
  const [isNegative, setIsNegative] = createSignal(false);

  // Update negative state when count changes
  const updateNegative = () => {
    setIsNegative(count() < 0);
  };

  const increment = () => {
    setCount(c => c + 1);
    updateNegative();
  };

  const decrement = () => {
    setCount(c => c - 1);
    updateNegative();
  };

  const reset = () => {
    setCount(0);
    updateNegative();
  };

  return (
    <div class="card">
      <div class="counter">
        <h2>Counter Example</h2>
        <div class={isNegative() ? "count-display negative" : "count-display positive"}>
          {count()}
        </div>
        <div>
          <button onclick={decrement}>-</button>
          <button onclick={reset}>Reset</button>
          <button onclick={increment}>+</button>
        </div>
      </div>
    </div>
  );
}

function KeyedList() {
  const [todos, setTodos] = createSignal([
    { id: 1, text: 'Learn HyperFX', completed: false },
    { id: 2, text: 'Build something awesome', completed: false },
    { id: 3, text: 'Ship it!', completed: false },
  ]);

  const toggleTodo = (id: number) => {
    setTodos(todos => todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const removeTodo = (id: number) => {
    setTodos(todos => todos.filter(t => t.id !== id));
  };

  const shuffle = () => {
    setTodos(todos => {
      const arr = [...todos];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
  };

  const addTodo = () => {
    const newId = Math.max(0, ...todos().map(t => t.id)) + 1;
    setTodos([...todos(), { id: newId, text: `New Task ${newId}`, completed: false }]);
  };

  return (
    <div class="card">
      <div class="keyed-list">
        <h2>Keyed List (Efficient Diffing)</h2>
        <div class="controls">
          <button onclick={addTodo}>Add Task</button>
          <button onclick={shuffle}>Shuffle</button>
        </div>
        <ul class="todo-list">
          {todos().map(todo => (
            <li key={todo.id} class={todo.completed ? 'completed' : ''}>
              <input 
                type="checkbox" 
                checked={todo.completed}
                onclick={() => toggleTodo(todo.id)}
              />
              <span class="todo-text">{todo.text}</span>
              <button class="delete-btn" onclick={() => removeTodo(todo.id)}>×</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>HyperFX Compiled Example</h1>
      <p class="subtitle">Using unplugin-hyperfx for optimized builds</p>
      
      <Counter />
      <KeyedList />
      
      <div class="info">
        <strong>🚀 This app is compiled!</strong>
        <br />
        Open DevTools and check the Network tab to see the optimized bundle.
        Static JSX is extracted into templates for faster rendering.
        <br />
        <br />
        <strong>Features demonstrated:</strong>
        <ul>
          <li>✅ Static template extraction</li>
          <li>✅ Dynamic content insertion with {'{count()}'}</li>
          <li>✅ Reactive attributes with {'{isNegative()}'}</li>
          <li>✅ Event delegation for onclick handlers</li>
          <li>✅ Keyed list rendering with efficient diffing</li>
        </ul>
      </div>
    </div>
  );
}

// Mount the app
const root = document.getElementById('app');
if (root) {
  root.appendChild(App() as Node);
}
