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

    add (urls) {
        this.events.add(urls);

        return this;
    }

    get (url) {
        this.events.get(url);

        return this;
    }

    delete (url) {
        this.events.delete(url);

        return this;
    }

    update (url) {
        this.events.update(url);

        return this;
    }

    initializeServiceWorker () {
        this.events.initializeServiceWorker();
    }
}