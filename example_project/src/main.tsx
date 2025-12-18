// import './index.css';
import { createRouter, jsx, Fragment } from "hyperfx";
import { HomePage } from './pages/home';
import { CounterPage } from './pages/counter';
import { TodoPage } from './pages/todo';
import { FormPage } from './pages/form';
import { NavigationBar } from './components/navigation';

// Expose JSX globals for esbuild jsx transform
(window as any).jsx = jsx;
(window as any).Fragment = Fragment;

// Create the main app container
const appContainer = document.getElementById('app')!;




const b = NavigationBar();
console.log('NavigationBar component:', b);

// Create the main layout
function App(): JSX.Element {
  return (
    <div class="min-h-screen bg-gray-900 text-white">
      <NavigationBar />
      <main class="container mx-auto px-4 py-8">
        <div class="flex-1" id="page-router-outlet"></div>
      </main>
    </div>
  );
}

console.log('App container:', appContainer);

// Mount the app directly
appContainer.replaceChildren(App());

const pageContainer = document.getElementById('page-router-outlet')!;

console.log('Page container for routing:', pageContainer);

// Setup routing with new direct DOM router
createRouter(pageContainer)
  .registerRoute('/', HomePage)
  .registerRoute('/counter', CounterPage)
  .registerRoute('/todo', TodoPage)
  .registerRoute('/form', FormPage)
  .enable();
