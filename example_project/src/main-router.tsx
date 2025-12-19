import { FineGrainedTest } from './fine-grained-test';
/// <reference types="hyperfx/jsx" />
import './index.css';
import { Router, Route, Link, usePath, useNavigate } from "hyperfx";

// Navigation Component
function Navigation(): JSX.Element {
  return (
    <nav class="bg-gray-800 border-b border-gray-700">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-bold text-white">HyperFX Router</h1>
          </div>
          <div class="flex space-x-4">
            <Link to="/" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/counter" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Counter
            </Link>
            <Link to="/todo" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Todo
            </Link>
            <Link to="/form" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Form
            </Link>
            <Link to="/about" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link to="/test" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Fine-Grained Test
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Home Page Component
function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const currentPath = usePath();

  return (
    <div class="space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-blue-400 mb-4">
          Welcome to Component-Based Routing
        </h1>
        <p class="text-xl text-gray-300 mb-8">
          HyperFX with React Router-style routing
        </p>
        <div class="text-lg text-gray-400 mb-4">
          Current Path: {currentPath()}
        </div>
        <button
          type="button"
          onClick={() => navigate('/counter')}
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Counter
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-semibold text-green-400 mb-4">
            Router Components
          </h2>
          <ul class="space-y-2 text-gray-300">
            <li><code class="bg-gray-700 px-2 py-1 rounded">&lt;Router&gt;</code> - Root routing context</li>
            <li><code class="bg-gray-700 px-2 py-1 rounded">&lt;Route&gt;</code> - Path-based rendering</li>
            <li><code class="bg-gray-700 px-2 py-1 rounded">&lt;Link&gt;</code> - Navigation links</li>
            <li><code class="bg-gray-700 px-2 py-1 rounded">usePath()</code> - Get current path</li>
            <li><code class="bg-gray-700 px-2 py-1 rounded">useNavigate()</code> - Programmatic navigation</li>
          </ul>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-semibold text-purple-400 mb-4">
            Direct DOM Benefits
          </h2>
          <ul class="space-y-2 text-gray-300">
            <li>⚡ No Virtual DOM overhead</li>
            <li>🎯 Direct DOM manipulation</li>
            <li>🔥 Reactive signals integration</li>
            <li>📦 Smaller bundle size</li>
            <li>🚀 Better performance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// About Page Component
function AboutPage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-cyan-400 mb-4">
          About HyperFX Router
        </h1>
        <p class="text-xl text-gray-300">
          Component-based routing without virtual DOM
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-gray-800 p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-green-400 mb-4">How It Works</h3>
          <div class="space-y-3 text-gray-300">
            <p>
              <strong>Router Component:</strong> Provides routing context to child components
            </p>
            <p>
              <strong>Route Components:</strong> Render content based on current path matching
            </p>
            <p>
              <strong>Link Components:</strong> Handle navigation with active state management
            </p>
            <p>
              <strong>Reactive Integration:</strong> Path changes trigger reactive updates
            </p>
          </div>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-yellow-400 mb-4">Navigation</h3>
          <div class="space-y-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
            <button
              type="button"
              onClick={() => navigate('/counter')}
              class="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Try Counter Demo
            </button>
            <button
              type="button"
              onClick={() => navigate('/todo')}
              class="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Todo App
            </button>
            <button
              type="button"
              onClick={() => navigate('/form')}
              class="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Form Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 404 Page Component
function NotFoundPage(): JSX.Element {
  const navigate = useNavigate();
  const currentPath = usePath();

  return (
    <div class="text-center py-16">
      <div class="text-6xl mb-4">🤷‍♂️</div>
      <h1 class="text-4xl font-bold text-red-400 mb-4">
        Page Not Found
      </h1>
      <p class="text-xl text-gray-300 mb-8">
        The page <code class="bg-gray-700 px-2 py-1 rounded">{currentPath()}</code> doesn't exist.
      </p>
      <button
        type="button"
        onClick={() => navigate('/')}
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Home
      </button>
    </div>
  );
}

// Main App Component
function App(): JSX.Element {
  return (
    <Router>
      <div class="min-h-screen bg-gray-900 text-white">
        <Navigation />
        <main class="container mx-auto px-4 py-8">
          {/* Route definitions */}
          <Route path="/" component={HomePage} exact />
          <Route path="/about" component={AboutPage} />
          <Route path="/test" component={FineGrainedTest} title="Fine Grained Reactivity" />
          <Route path="/counter" component={() => <div>Counter component would go here</div>} />
          <Route path="/todo" component={() => <div>Todo component would go here</div>} />
          <Route path="/form" component={() => <div>Form component would go here</div>} />

          {/* 404 Route - catches all unmatched paths */}
          <Route path="" component={NotFoundPage} />
        </main>
      </div>
    </Router>
  );
}

// Mount the app
const appContainer = document.getElementById('app')!;
appContainer.replaceChildren(App());