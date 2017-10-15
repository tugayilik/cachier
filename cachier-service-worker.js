const DB_NAME = 'cachier';
const TRANSACTION_OBJECT = 'config';
let CACHES = null;
/**
 * Listen serviceWorker activation event
 * It automatically cleans out of date caches
 * and inform clients at the end
 *
 */
self.addEventListener('activate', event => {
    event.waitUntil(
        init().then(config => {
            CACHES = {
                cachier: 'cachier-cache-v' + config.value.value
            }
        }).then(() => {
            cleanOutOfDateCaches().then(() => {
                return clients.claim();
            })
        })
    );
});

/**
 * Listen network requests and fetch over service Worker
 * If the file is already in cache
 *
 */
self.addEventListener('fetch', event => {
    event.respondWith(async function () {
        const cachedResponse = await caches.match(event.request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // Network request for the files which are not in cache
        return fetch(event.request)
    }())
});


/**
 * Capture all message coming from Client
 * And manage events according to command name
 * Which sent from user
 */
self.addEventListener('message', event => {
    let promise = caches.open(CACHES.cachier).then(cache => {
        switch (event.data.command) {
            // This command returns a list of the URLs
            // corresponding to the Request objects
            // that serve as keys for the current cache.
            case 'keys':
                get(cache, event);
                break;
            // This command adds multiple request/response pair to its cache
            case 'add':
                add(cache, event);
                break;
            // This command removes a request/response pair
            // from the cache (assuming it exists).
            case 'delete':
                deleteUrls(cache, event);
                break;

            case 'update':
                update(cache, event);
                break;
            default:
                // This will be handled by the outer .catch().
                throw Error('Unknown command: ' + event.data.command);
        }
    }).catch(error => {
        // If the promise rejects, handle it by
        // returning a standardized error message to the controlled page.
        sendMessageToClient({
            event,
            error: error.toString(),
        });
    });

    // Beginning in Chrome 51, event is an ExtendableMessageEvent, which
    // supports the waitUntil() method for extending the lifetime of the event
    // handler until the promise is resolved.
    if ('waitUntil' in event) {
        event.waitUntil(promise);
    }
});

/**
 * Sets required initial settings
 *
 * @param event
 */
let init = () => {
    return new Promise(resolve => {
        resolve(getConfig());
    })
};



/**
 * Delete all out dated caches in the CACHES list
 *
 * @returns {Promise}
 */
let cleanOutOfDateCaches = () => {
    let expectedCacheNames = Object.keys(CACHES).map(key => {
        return CACHES[key];
    });

    return caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cacheName => {
                if (expectedCacheNames.indexOf(cacheName) === -1) {
                    console.log('Deleting out of date cache:', cacheName);
                    return caches.delete(cacheName);
                }
            })
        );
    });
};

/**
 * Get all cached URLS
 * If event.data.url is provided by client
 * It gets single key and returns true or false in the state
 *
 * @param cache
 * @param event
 * @returns {Promise}
 */
let get = (cache, event) => {
    return cache.keys().then(requests => {
        let urls = requests.map(request => {
            return request.url;
        });

        // If the client asking for a specific URL for its existence
        // It returns true or false according to its result
        if (event.data.url) {
            console.log(urls,event.data.url);
            return urls.indexOf(event.data.url) > -1;
        }

        return urls.sort();
    }).then(urls => {
        sendMessageToClient({
            event,
            message: {
                url: urls,
                status: true
            }
        })
    });
};

/**
 * From client side if an array sent as
 * Url List, it will get into this function call
 *
 * @param cache
 * @param event
 * @returns {Promise}
 */
let add = (cache, event) => {
    return Promise.all(event.data.url.map(async url => {
        let cacheMatch = await cache.match(url);

        if (cacheMatch) {
            return false;
        }

        let request = new Request(url, {mode: 'no-cors'});

        fetch(request).then(response => {
            if (!response.ok) {
                return false;
            }

            cache.put(url, response);
        })
    })).then(
        sendMessageToClient({
            event,
            message: {
                url: event.data.url,
                status: true
            }
        })
    );
};

/**
 * Delete cached url(s) from CacheStorage
 *
 * @param cache <Object>
 * @param event
 * @returns {Promise}
 */
let deleteUrls = (cache, event) => {
    return Promise.all(event.data.url.map(async url => {
        return await cache.delete(url)
    })).then(success => {
        sendMessageToClient({
            event: event,
            error: success[0] ? null : 'Item was not found in the cache.',
            message: {
                url: event.data.url,
                status: success[0]
            }
        });
    });
};

/**
 * Update already existing cache
 *
 * @param cache
 * @param event
 */
let update = (cache, event) => {
    return Promise.all(event.data.url.map(url => {
        return caches.match(url).then(() => {
            let request = new Request(url, {mode: 'no-cors'});
            fetch(request).then(response => {
                cache.put(url, response);
            });
        })
    })).then(() => {
        sendMessageToClient({
            event: event,
            message: {
                url: event.data.url,
                status: true
            }
        });
    });
};

let getConfig = () => {
    return new Promise((resolve, reject) => {
        let DBOpenRequest = indexedDB.open(DB_NAME);
        DBOpenRequest.onsuccess = () => {
            const database = DBOpenRequest.result;
            const objectStore = database.transaction(TRANSACTION_OBJECT, 'readonly').objectStore(TRANSACTION_OBJECT);
            const getConfig = objectStore.index('value');

            getConfig.openCursor().onsuccess = (event) => {
                resolve(event.target.result);
            }
        };

        DBOpenRequest.onerror = (error) => {
            reject(error);
        }
    });

};

/**
 * Send message to client
 *
 * @param data {Object}
 */
let sendMessageToClient = data => {
    return self.clients.matchAll().then(clients => {
        for (let i = 0; i < clients.length; i++) {
            const client = clients[i];
            client.postMessage({
                error: data.error || null,
                message: data.message || null,
            });
        }
    });
};