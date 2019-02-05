// Service Worker Mock
Object.defineProperty(navigator, 'serviceWorker', {
    value: {
        register: () => {
            return new Promise((resolve, reject) => {
                resolve();
                reject();
            })
        },
        addEventListener: () => {},
        ready: new Promise((resolve, reject) => {
            resolve();
        })
    }
});

// Service Worker Mock
Object.defineProperty(window, 'indexedDB', {
    value: {
        open: () => {
            return {
                onupgradeneeded: null
            }
        }
    }
});

Object.defineProperty(window, 'MessageChannel', {
    value: function () {
        return {
            port1: { onmessage: null },
            port2: { onmessage: null },
        };
    },
});
