import { TopNav } from './topnav';

/**
 * 404 Not Found Page Component
 */
export default function NotFoundPage() {
    return (
        <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <TopNav />

            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-[70vh]">
                <div class="text-center">
                    <div class="text-9xl mb-8">🔍</div>
                    <h1 class="text-6xl md:text-8xl font-bold mb-6 bg-linear-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                        404
                    </h1>
                    <p class="text-2xl md:text-3xl text-gray-300 mb-8">
                        Oops! Page Not Found
                    </p>
                    <p class="text-lg text-gray-400 mb-12 max-w-2xl">
                        The page you're looking for doesn't exist or has been moved.
                    </p>

                    <a
                        href="/"
                        class="group px-8 py-4 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 inline-flex items-center gap-3"
                    >
                        <span class="text-2xl group-hover:animate-bounce">🏠</span>
                        Go Back Home
                    </a>
                </div>
            </main>
        </div>
    );
}