if('serviceWorker' in navigator) navigator.serviceWorker.register('/hyperfx/dev-sw.js?dev-sw', { scope: '/hyperfx/', type: 'classic' })