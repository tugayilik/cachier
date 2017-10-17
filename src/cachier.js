import Events from './events';

export default class Cashier {

    constructor (config = {}) {
        const defaults = {
            version: 1,
            serviceWorkerPath: './cachier-service-worker.js',
            debug: false
        };

        this.config = Object.assign({}, defaults, config);
        this.events = new Events(this.config);
        this.initializeServiceWorker();
    }

    add (urls, callback) {
        this.events.add(urls, callback);
    }

    get (urls, callback) {
        this.events.get(urls, callback);
    }

    delete (urls, callback) {
        this.events.delete(urls, callback);
    }

    update (urls, callback) {
        this.events.update(urls, callback);
    }

    clear (callback) {
        this.events.clear(callback);
    }

    initializeServiceWorker () {
        this.events.initializeServiceWorker();
    }
}
