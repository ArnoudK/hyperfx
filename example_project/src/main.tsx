import { Router, Route } from "hyperfx";
import { HomePage } from './pages/home';
import { CounterPage } from './pages/counter';
import { TodoPage } from './pages/todo';
import { FormPage } from './pages/form';
import { NavigationBar } from './components/navigation';

// Create the main app container
const appContainer = document.getElementById('app')!;

// Create the application with routing
function App(): JSX.Element {
  return (
    <Router children={<>
      <div class="min-h-screen bg-gray-900 text-white">
        <NavigationBar />
        <main class="container mx-auto px-4 py-8">
          <Route path="/" component={HomePage} exact />
          <Route path="/counter" component={CounterPage} />
          <Route path="/todo" component={TodoPage} />
          <Route path="/form" component={FormPage} />
        </main>
      </div>
    </>
    } />
  );
}

// Mount the app
appContainer.replaceChildren(App());
