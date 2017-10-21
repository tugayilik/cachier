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
            };
        }).then(() => {
            cleanOutOfDateCaches().then(() => {
                return clients.claim();
            });
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
        return fetch(event.request);
    }());
});

/**
 * Capture all message coming from Client
 * And manage events according to command name
 * Which sent from user
 *
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
            // Update existing cache key
            case 'update':
                update(cache, event);
                break;
            // Clear all cache storage
            case 'clear':
                clear(cache, event);
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
            error: error.toString()
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
 * @returns {Promise}
 */
let init = () => {
    return new Promise(resolve => {
        resolve(getConfig());
    });
};

/**
 * Delete all out dated caches in the CACHES list
 *
 * @returns {Promise.<TResult>}
 */
let cleanOutOfDateCaches = () => {
    let expectedCacheNames = Object.keys(CACHES).map(key => {
        return CACHES[key];
    });

    return caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cacheName => {
                if (expectedCacheNames.indexOf(cacheName) === -1) {
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
 * @returns {Promise.<TResult>}
 */
let get = (cache, event) => {
    let treatedUrls = {
        success: []
    };

    return cache.keys().then(requests => {
        let urls = requests.map(request => {
            return request.url;
        });

        // If the client asking for a specific URL for its existence
        // It returns true or false according to its result
        if (event.data.url) {
            return urls.filter(url => {
                return url.indexOf(event.data.url) > -1;
            }).length > 0;
        }
        return urls.sort();
    }).then(urls => {
        treatedUrls.success = urls;
        sendMessageToClient({
            event,
            message: treatedUrls
        });
    });
};

/**
 * From client side if an array sent as
 * Url List, it will get into this function call
 *
 * @param cache
 * @param event
 * @returns {Promise.<TResult>}
 */
let add = (cache, event) => {
    let addProcess = {
        success: [],
        existing: [],
        failed: []
    };

    // Wait till all cache.match promises finish
    return Promise.all(event.data.url.map(url => {
        return new Promise((resolve, reject) => {
            cache.match(url).then(response => {
                if (response && response.ok) {
                    addProcess.existing.push(response.url);
                }

                resolve({
                    url,
                    found: response ? true : false,
                    code: response ? response.status : null
                });
            }).catch(error => { reject(error); });
        })
    })).then(response => {
        // Wait till all fetch promises finish
        Promise.all(response.map(cacheData => {
            if (!response.code) {
                let url = cacheData.url;
                let request = new Request(url, {mode: 'no-cors'});

                return fetch(request);
            }
        })).then(fetchResult => {
            // Wait till all cache.put promises finish
            Promise.all(fetchResult.map(response => {
                let url = response.url;
                if (response.status !== 200) {
                    addProcess.failed.push(url);
                } else {
                    if (addProcess.existing.indexOf(url) === -1) {
                        addProcess.success.push(url);
                    }
                    return cache.put(url, response);
                }
            })).then(sendMessageToClient({
                event,
                message: addProcess
            }));
        });
    });
};

/**
 * Delete cached url(s) from CacheStorage
 *
 * @param cache {Object}
 * @param event
 * @returns {Promise.<TResult>}
 */
let deleteUrls = (cache, event) => {
    let deleteProcess = {
        success: [],
        failed: []
    };

    let urlList = event.data ? event.data.url : event;

    return Promise.all(urlList.map(url => {
        return new Promise((resolve, reject) => {
            cache.delete(url).then(success => {
                // If found in cache and removed
                if (success) {
                    deleteProcess.success.push(url);
                } else { // Not found in cache or any error happened
                    deleteProcess.failed.push(url);
                }

                resolve({
                    url,
                    deleted: success
                });
            }).catch(error => { reject(error); });
        })
    })).then(sendMessageToClient({
        event: event,
        message: deleteProcess
    }));
};

/**
 * Update already existing cache
 *
 * @param cache {Object}
 * @param event {Object}
 */
let update = (cache, event) => {
    let updateProcess = {
        success: [],
        failed: []
    };

    return Promise.all(event.data.url.map(url => {
        return new Promise((resolve, reject) => {
            caches.match(url).then(response => {
                resolve({
                    url,
                    found: response ? true : false,
                    code: response ? response.status : null
                })
            }).catch(error => { reject(error); });
        })
    })).then(responses => {
        Promise.all(responses.map(response => {
            let url = response.url;
            let request = new Request(url, {mode: 'no-cors'});
            return fetch(request);
        })).then(fetchResponses => {
            Promise.all(fetchResponses.map(response => {
                let url = response.url;
                if (response.status !== 200) {
                    updateProcess.failed.push(url);
                } else {
                    if (updateProcess.success.indexOf(url) === -1) {
                        updateProcess.success.push(url);
                    }
                    return cache.put(url, response);
                }
            })).then(sendMessageToClient({
                event: event,
                message: updateProcess
            }));
        });
    });
};

let clear = (cache) => {
    cache.keys().then(requests => {
        return requests.map(request => {
            return request.url;
        }).sort();
    }).then(urls => {
        deleteUrls(cache, urls);
    });
};

/**
 * Gets config from indexedDB
 *
 * @returns {Promise}
 */
let getConfig = () => {
    return new Promise((resolve, reject) => {
        let DBOpenRequest = indexedDB.open(DB_NAME);
        DBOpenRequest.onsuccess = () => {
            const database = DBOpenRequest.result;
            const objectStore = database.transaction(TRANSACTION_OBJECT, 'readonly').objectStore(TRANSACTION_OBJECT);
            const getConfig = objectStore.index('value');

            getConfig.openCursor().onsuccess = (event) => {
                resolve(event.target.result);
            };

            database.transaction.onerror = (error) => {
                reject(error);
            };
        };

        DBOpenRequest.onerror = (error) => {
            reject(error);
        };
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
                message: data.message || null
            });
        }
    });
};