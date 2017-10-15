import Utils from './utils';
import StateManager from './state';
import Config from './config';

/**
 * Core events are defined here
 */
export default class Events {

    initializeServiceWorker (config) {
        if ('serviceWorker' in navigator) {
            this.initializeIndexedDB(config, () => {
                Events.storeDataInIndexedDB(Config.TABLE_NAME, {
                    id: 1,
                    name: 'version',
                    value: Utils.adjustIndexedDbVersion(config.version)
                });
            }).then(this.registerServiceWorker());
        } else {
            return Utils.exceptionHandler('Browser doesn\'t support serviceWorker.');
        }
    }

    /**
     * Registers service worker if its available
     * Triggers ready after registration
     */
    registerServiceWorker () {
        navigator.serviceWorker.register(Config.SERVICE_WORKER_PATH, {
            scope: '/'
        }).then(() => {
            return navigator.serviceWorker.ready;
        }).catch(error => {
            Utils.exceptionHandler('Service Worker Registration error:' + error);
        });
    }

    /**
     * Creates new indexedDB with default config | <version>
     *
     * @param config <Object>
     * @param callback <Function>
     * @returns {Promise}
     */
    initializeIndexedDB (config = {}, callback = () => {}) {

        return new Promise((resolve, reject) => {
            let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            let DBOpenRequest = indexedDB.open(Config.DB_NAME, Utils.adjustIndexedDbVersion(config.version));

            DBOpenRequest.onupgradeneeded = event => {
                Config.DATABASE = event.target.result;
                Config.TRANSACTION = event.target.transaction;

                // Remove previous object store for upgrading version
                Events.clearOutOfDateObjectStore(event);

                let store = Config.DATABASE.createObjectStore(Config.TABLE_NAME, {
                    keyPath: 'id',
                    autoIncrement: true
                });

                store.createIndex('name', 'name', {unique: true});
                store.createIndex('value', 'value', {unique: true});
                callback();
                resolve();
            };

            DBOpenRequest.onerror = error => {
                reject(error);
            }
        })
    }

    /**
     * Store default config in indexedDB
     * For accessing it over serviceWorker
     *
     * @param table
     * @param data
     */
    static storeDataInIndexedDB (table, data) {
        let objectStore = Config.TRANSACTION.objectStore(table);
        objectStore.add(data);
    }

    /**
     * When there is version upgrade
     * Removes previous indexedBStore
     *
     * @returns {Promise}
     */
    static clearOutOfDateObjectStore (event) {
        if (event.oldVersion > 0 && event.oldVersion !== event.newVersion) {
            Config.DATABASE.deleteObjectStore(Config.TABLE_NAME);
        }
    }


    /**
     * Adds the given file urls to CacheStorage
     * @param urls <Array|String>
     */
    add (urls) {
        if (!(urls instanceof Array)) {
            Utils.exceptionHandler('Argument type ' + typeof urls +
                ' is not supported for add. It accepts array.');
        }

        this.dialogWithServiceWorker({
            command: 'add',
            url: urls
        }).then(event => {
            StateManager.set('add', event);
        });
    }

    /**
     * Gets all cache keys from CacheStorage as array
     * If the url is provided, it gets single key and returns
     * true or false in url property of state
     *
     * @param urls <String>
     */
    get (urls) {
        this.dialogWithServiceWorker({
            command: 'keys',
            urls
        }).then(event => {
            StateManager.set('keys', event);
        });
    }

    /**
     * Delete e specific key from storage
     * @param urls
     */
    delete (urls) {
        if (!(urls instanceof Array)) {
            return Utils.exceptionHandler('Argument type ' + typeof urls +
                ' is not supported for delete. It accepts array.');
        }

        this.dialogWithServiceWorker({
            command: 'delete',
            url: urls
        }).then(event => {
            StateManager.set('delete', event);
        });
    }

    /**
     * Update cache urls
     *
     * @param urls
     * @returns {*}
     */
    update (urls) {
        if (!(urls instanceof Array)) {
            return Utils.exceptionHandler('Argument type ' + typeof urls +
                ' is not supported for update. It accepts array.');
        }

        this.dialogWithServiceWorker({
            command: 'update',
            url: urls
        }).then(event => {
            StateManager.set('update', event);
        });
    }

    /**
     * Allows communicate with ServiceWorker
     * It does both job, send message and receives it
     * Triggering the client message event happens on ServiceWorker <service-worker.js>
     *
     * @param message <Object>
     * @returns {Promise}
     */
    dialogWithServiceWorker (message) {
        const serviceWorker = navigator.serviceWorker;
        return new Promise((resolve, reject) => {
            let messageChannel = new MessageChannel();

            // Start listening messages received over ServiceWorker
            serviceWorker.addEventListener('message', event => {
                if (event.data.error) {
                    Events.listenServiceWorkerMessages(event);
                    reject(event.data.error);
                } else {
                    Events.listenServiceWorkerMessages(event);
                    resolve(event.data)
                }
            });

            // Send incoming message to ServiceWorker
            serviceWorker.ready.then(() => {
                // When promise resolved for the first time, controller is not active yet
                if (serviceWorker.controller) {
                    serviceWorker.controller.postMessage(message, [messageChannel.port2]);
                } else {
                    serviceWorker.addEventListener('controllerchange', () => {
                        serviceWorker.controller.postMessage(message, [messageChannel.port2]);
                    })
                }
            });

        });
    }

    /**
     * If debug is true in config.js
     * This will start logging on console
     *
     * @param event
     */
    static listenServiceWorkerMessages (event) {
        Utils.statusHandler(`ServiceWorker message received: ${JSON.stringify(event)}`);
    }

}