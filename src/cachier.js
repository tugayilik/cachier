import Events from './events';

export default class Cashier {

    constructor (config = {}) {
        const defaults = {
            version: 1
        };

        this.config = Object.assign({}, defaults, config);
        this.events = new Events();
        this.initializeServiceWorker();
    }

    add (urls) {
        this.events.add(urls);
    }

    get (url) {
        this.events.get(url);
    }

    delete (url) {
        this.events.delete(url);
    }

    update (url) {
        this.events.update(url);
    }

    initializeServiceWorker () {
        this.events.initializeServiceWorker(this.config);
    }
}