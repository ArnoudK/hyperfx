import { createSignal, createComputed, For } from "hyperfx";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const filterOptions = ['all', 'active', 'completed'];
type FilterType = typeof filterOptions[number];

export function TodoPage() {
  const todos = createSignal<Todo[]>([
    { id: 1, text: "Learn HyperFX", completed: false },
    { id: 2, text: "Build a demo app", completed: true },
    { id: 3, text: "Write documentation", completed: false }
  ]);

  const newTodoText = createSignal('');
  const filterStatus = createSignal<FilterType>('all');



  // Computed values
  const filteredTodos = createComputed(() => {
    const allTodos = todos();
    const currentFilter = filterStatus();

    switch (currentFilter) {
      case 'active':
        return allTodos.filter(todo => !todo.completed);
      case 'completed':
        return allTodos.filter(todo => todo.completed);
      default:
        return allTodos;
    }
  });

  // Individual reactive stats
  const totalTodos = createComputed(() => todos().length);
  const completedTodos = createComputed(() => todos().filter(t => t.completed).length);
  const activeTodos = createComputed(() => totalTodos() - completedTodos());

  // Computed filter buttons with reactive styling
  const filterButtons = createComputed(() =>
    filterOptions.map(option => ({
      option,
      isActive: filterStatus() === option
    }))
  );

  // Computed for empty state message
  const emptyMessage = createComputed(() => {
    return filterStatus() === 'all'
      ? "No tasks yet. Add one above!"
      : `No ${filterStatus()} tasks.`;
  });

  // Computed for whether to show the list or empty state
  const showList = createComputed(() => filteredTodos().length > 0);

  // Actions
  const addTodo = () => {
    const text = newTodoText.get().trim();
    if (!text) return;

    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false
    };

    todos.set([...todos.get(), newTodo]);
    newTodoText.set(''); // Reactive binding will clear the input
  };

  const toggleTodo = (id: number) => {
    todos.set(todos.get().map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    todos.set(todos.get().filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    todos.set(todos.get().filter(todo => !todo.completed));
  };

  const toggleAll = () => {
    const hasIncomplete = todos.get().some(todo => !todo.completed);
    todos.set(todos.get().map(todo => ({ ...todo, completed: hasIncomplete })));
  };

  return (
    <div class="max-w-4xl mx-auto space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-blue-400 mb-4">
          Todo List Demo
        </h1>
        <p class="text-xl text-gray-300">
          Demonstrates list management, filtering, and complex state updates
        </p>
      </div>



      {/* Stats */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-gray-800 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-blue-400">{totalTodos}</div>
          <div class="text-sm text-gray-400">Total Tasks</div>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-green-400">{completedTodos}</div>
          <div class="text-sm text-gray-400">Completed</div>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-yellow-400">{activeTodos}</div>
          <div class="text-sm text-gray-400">Active</div>
        </div>
      </div>

      {/* Add New Todo */}
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold text-green-400 mb-4">
          Add New Task
        </h2>
        <div class="flex space-x-2">
          <input
            type="text"
            class="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="What needs to be done?"
            value={newTodoText}
            onInput={(e) => newTodoText.set((e.target as HTMLInputElement).value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addTodo();
              }
            }}
          />
          <button
            type="button"
            onClick={addTodo}
            class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
             Add
           </button>
         </div>
      </div>

      {/* Controls */}
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex space-x-2">
            <h2 class="text-xl font-semibold text-purple-400">Filter:</h2>
              <For each={filterButtons}>
                {({ option, isActive }) => (
                <button
                  key={option}
                  type="button"
                    onClick={() => filterStatus(option)}
                  class={`px-3 py-1 rounded-md transition-colors capitalize ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {option}
                </button>
                )}
              </For>
          </div>
          
          <div class="flex space-x-2">
             {todos().length > 0 && (
               <button
                 type="button"
                 onClick={toggleAll}
                 class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
               >
                 Toggle All
                </button>
              )}
              {completedTodos() > 0 && (
                <button
                  type="button"
                  onClick={clearCompleted}
                  class="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                >
                  Clear Completed
                </button>
              )}
            </div>
         </div>
       </div>

       {/* Todo List */}
       <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
         {showList() ? (
           <div class="divide-y divide-gray-700">
             <For each={filteredTodos}>
               {(todoItem) => (
                 <div class="flex items-center p-4 hover:bg-gray-750 transition-colors">
                   <div class='w-full'>
                   <label >
                   <input
                     type="checkbox"
                     checked={todoItem.completed}
                     onChange={() => toggleTodo(todoItem.id)}
                     class="w-5 h-5 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                     />
                   <span
                     class={`flex-1 ml-3 text-lg ${
                       todoItem.completed
                       ? 'line-through text-gray-500'
                       : 'text-white'
                       }`}
                       >
                     {todoItem.text}
                   </span>
                   </label>
                   </div>
                     <button
                       type="button"
                       onClick={() => deleteTodo(todoItem.id)}
                       class="ml-2 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                       >
                       Delete
                     </button>
                   </div>
               )}
             </For>
           </div>
         ) : (
            <div class="p-8 text-center text-gray-400">
              {emptyMessage()}
            </div>
          )}
        </div>
        </div>
  );
}
