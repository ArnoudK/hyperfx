import { Link } from '../app';
import { AboutRoute } from '../routes/about';
import { HomeRoute } from '../routes/homepage';
import { ProductsRoute } from '../routes/products';

export function TopNav() {
    return (
        <header class="bg-linear-to-r from-gray-800/95 via-gray-700/95 to-gray-800/95 backdrop-blur-md border-b border-gray-600/50 sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav class="flex justify-center space-x-12 py-6" role="navigation" aria-label="Main navigation">
                    <Link
                        to={HomeRoute}
                        class="group text-blue-400 hover:text-blue-300 transition-all duration-300 text-lg font-medium relative"
                    >
                        <span class="flex items-center gap-2">
                            <span class="text-xl group-hover:animate-bounce">🏠</span>
                            Home
                        </span>
                        <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link
                        to={AboutRoute}
                        class="group text-blue-400 hover:text-blue-300 transition-all duration-300 text-lg font-medium relative"
                    >
                        <span class="flex items-center gap-2">
                            <span class="text-xl group-hover:animate-bounce">📖</span>
                            About
                        </span>
                        <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link
                        to={ProductsRoute}
                        class="group text-blue-400 hover:text-blue-300 transition-all duration-300 text-lg font-medium relative"
                    >
                        <span class="flex items-center gap-2">
                            <span class="text-xl group-hover:animate-bounce">🛍️</span>
                            Products
                        </span>
                        <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}