// Service Worker Mock
Object.defineProperty(navigator, 'serviceWorker', {
    value: {
        register: () => {
            return new Promise((resolve, reject) => {})
        }
    }
});