

export function NavigationBar() {
  return (
    <nav class="bg-gray-800 shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <a href="/" class="text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
              HyperFX Demo
            </a>
          </div>
          <ul class="flex space-x-6" role="navigation">
            <li>
              <a href="/" class="text-gray-300 hover:text-white transition-colors cursor-pointer">
                Home
              </a>
            </li>
            <li>
              <a href="/counter" class="text-gray-300 hover:text-white transition-colors cursor-pointer">
                Counter
              </a>
            </li>
            <li>
              <a href="/todo" class="text-gray-300 hover:text-white transition-colors cursor-pointer">
                Todo List
              </a>
            </li>
            <li>
              <a href="/form" class="text-gray-300 hover:text-white transition-colors cursor-pointer">
                Form Demo
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
