import { Link } from "hyperfx";


export function NavigationBar() {
  return (
    <nav class="bg-gray-800 shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <Link to="/" class="text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
              HyperFX Demo
            </Link>
          </div>
          <ul class="flex space-x-6" role="navigation">
            <li>
              <Link to="/" class="text-gray-300 hover:text-white transition-colors cursor-pointer">
                Home
              </Link>
            </li>
            <li>
              <Link to="/counter" class="text-gray-300 hover:text-white transition-colors cursor-pointer">
                Counter
              </Link>
            </li>
            <li>
              <Link to="/todo" class="text-gray-300 hover:text-white transition-colors cursor-pointer">
                Todo List
              </Link>
            </li>
            <li>
              <Link to="/form" class="text-gray-300 hover:text-white transition-colors cursor-pointer">
                Form Demo
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
