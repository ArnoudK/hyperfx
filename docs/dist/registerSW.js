if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/hyperfx/sw.js', { scope: '/hyperfx/' })})}