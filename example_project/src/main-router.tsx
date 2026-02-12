/**
 * HyperFX Router Example - Using hyperfx-extra with typesafe routing
 */

import './index.css';
import { mount } from 'hyperfx';
import { createRouter } from 'hyperfx-extra';
import {  HomeRoute } from './pages/home';
import { CounterRoute } from './pages/counter';
import { EffectDemoRoute } from './pages/effect-demo';
import { InputRoute } from './pages/input-test';
import { ArrayTestRoute } from './pages/array-test';



const router  = createRouter([
  HomeRoute,
  CounterRoute,
  EffectDemoRoute,
  InputRoute,
  ArrayTestRoute
]);



export const Link = router.Link;
const Router = router.Router

function NotFound(props: { path: string }) {
  return <div class="p-4 bg-gray-700 text-white rounded-md m-4 text-center">
    <h2 class="text-2xl font-bold mb-4">404 - Not Found</h2>
    <p>The path "{props?.path}" does not exist.</p>
  </div>;
}

function App() {
  const initial = window.location.pathname
  return (
    <div class="min-h-screen bg-gray-900 text-gray-50">
      <nav class="bg-gray-800 border-b border-gray-700">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center space-x-4">
              <h1 class="text-xl font-bold text-white">HyperFX Router</h1>
            </div>
            <div class="flex space-x-4">
              <Link to={HomeRoute} class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link to={CounterRoute} class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Counter
              </Link>
              <Link to={InputRoute} class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Input
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div class="p-2">
      <Router notFound={NotFound}  initialPath={initial} />
      </div>
    </div>
  );
}

const app = document.getElementById('app')!;

mount(App, undefined, app, { mode: 'replace' });
