import { RouterLink } from "hyperfx";

export function TopNav(){
    return (
        <header className="bg-gradient-to-r from-gray-800/95 via-gray-700/95 to-gray-800/95 backdrop-blur-md border-b border-gray-600/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex justify-center space-x-12 py-6" role="navigation" aria-label="Main navigation">
                    <RouterLink 
                        href="/" 
                        className="group text-blue-400 hover:text-blue-300 transition-all duration-300 text-lg font-medium relative"
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-xl group-hover:animate-bounce">🏠</span>
                            Home
                        </span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                    </RouterLink>
                    <RouterLink 
                        href="/about" 
                        className="group text-blue-400 hover:text-blue-300 transition-all duration-300 text-lg font-medium relative"
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-xl group-hover:animate-bounce">📖</span>
                            About
                        </span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                    </RouterLink>
                    <RouterLink 
                        href="/products" 
                        className="group text-blue-400 hover:text-blue-300 transition-all duration-300 text-lg font-medium relative"
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-xl group-hover:animate-bounce">🛍️</span>
                            Products
                        </span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                    </RouterLink>
                </nav>
            </div>
        </header>
    );
}