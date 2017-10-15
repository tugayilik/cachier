(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    SERVICE_WORKER_PATH: '/cachier-service-worker.js',
    DEBUG: true,
    // --- IndexedDB Settings
    DB_NAME: 'cachier',
    TABLE_NAME: 'config',
    TRANSACTION: null,
    DATABASE: null
    // ---
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cachier = undefined;

var _cachier = __webpack_require__(2);

var _cachier2 = _interopRequireDefault(_cachier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Cachier = _cachier2.default;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(3);

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cashier = function () {
    function Cashier() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Cashier);

        var defaults = {
            version: 2
        };

        this.config = Object.assign({}, defaults, config);
        this.events = new _events2.default();
        this.initializeServiceWorker();
    }

    _createClass(Cashier, [{
        key: 'add',
        value: function add(urls) {
            this.events.add(urls);
        }
    }, {
        key: 'get',
        value: function get(url) {
            this.events.get(url);
        }
    }, {
        key: 'delete',
        value: function _delete(url) {
            this.events.delete(url);
        }
    }, {
        key: 'update',
        value: function update(url) {
            this.events.update(url);
        }
    }, {
        key: 'initializeServiceWorker',
        value: function initializeServiceWorker() {
            this.events.initializeServiceWorker(this.config);
        }
    }]);

    return Cashier;
}();

exports.default = Cashier;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(4);

var _utils2 = _interopRequireDefault(_utils);

var _state = __webpack_require__(5);

var _state2 = _interopRequireDefault(_state);

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Core events are defined here
 */
var Events = function () {
    function Events() {
        _classCallCheck(this, Events);
    }

    _createClass(Events, [{
        key: 'initializeServiceWorker',
        value: function initializeServiceWorker(config) {
            if ('serviceWorker' in window.navigator) {
                this.initializeIndexedDB(config, function () {
                    Events.storeDataInIndexedDB(_config2.default.TABLE_NAME, {
                        id: 1,
                        name: 'version',
                        value: _utils2.default.adjustIndexedDbVersion(config.version)
                    });
                }).then(this.registerServiceWorker());
            } else {
                return _utils2.default.exceptionHandler('Browser doesn\'t support serviceWorker.');
            }
        }

        /**
         * Registers service worker if its available
         * Triggers ready after registration
         */

    }, {
        key: 'registerServiceWorker',
        value: function registerServiceWorker() {
            navigator.serviceWorker.register(_config2.default.SERVICE_WORKER_PATH, {
                scope: '/'
            }).then(function () {
                return navigator.serviceWorker.ready;
            }).catch(function (error) {
                _utils2.default.exceptionHandler('Service Worker Registration error:' + error);
            });
        }

        /**
         * Creates new indexedDB with default config | <version>
         *
         * @param config <Object>
         * @param callback <Function>
         * @returns {Promise}
         */

    }, {
        key: 'initializeIndexedDB',
        value: function initializeIndexedDB() {
            var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};


            return new Promise(function (resolve, reject) {
                var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
                var DBOpenRequest = indexedDB.open(_config2.default.DB_NAME, _utils2.default.adjustIndexedDbVersion(config.version));

                DBOpenRequest.onupgradeneeded = function (event) {
                    _config2.default.DATABASE = event.target.result;
                    _config2.default.TRANSACTION = event.target.transaction;

                    // Remove previous object store for upgrading version
                    Events.clearOutOfDateObjectStore(event);

                    var store = _config2.default.DATABASE.createObjectStore(_config2.default.TABLE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });

                    store.createIndex('name', 'name', { unique: true });
                    store.createIndex('value', 'value', { unique: true });
                    callback();
                    resolve();
                };

                DBOpenRequest.onerror = function (error) {
                    reject(error);
                };
            });
        }

        /**
         * Store default config in indexedDB
         * For accessing it over serviceWorker
         *
         * @param table
         * @param data
         */

    }, {
        key: 'dialogWithServiceWorker',


        /**
         * Allows communicate with ServiceWorker
         * It does both job, send message and receives it
         * Triggering the client message event happens on ServiceWorker <service-worker.js>
         *
         * @param message <Object>
         * @returns {Promise}
         */
        value: function dialogWithServiceWorker(message) {
            var serviceWorker = navigator.serviceWorker;
            return new Promise(function (resolve, reject) {
                var messageChannel = new MessageChannel();

                // Start listening messages received over ServiceWorker
                serviceWorker.addEventListener('message', function (event) {
                    if (event.data.error) {
                        Events.listenServiceWorkerMessages(event);
                        reject(event.data.error);
                    } else {
                        Events.listenServiceWorkerMessages(event);
                        resolve(event.data);
                    }
                });

                // Send incoming message to ServiceWorker
                serviceWorker.ready.then(function () {
                    // When promise resolved for the first time, controller is not active yet
                    if (serviceWorker.controller) {
                        serviceWorker.controller.postMessage(message, [messageChannel.port2]);
                    } else {
                        serviceWorker.addEventListener('controllerchange', function () {
                            serviceWorker.controller.postMessage(message, [messageChannel.port2]);
                        });
                    }
                });
            });
        }

        /**
         * Adds the given file urls to CacheStorage
         * @param urls <Array|String>
         */

    }, {
        key: 'add',
        value: function add(urls) {
            if (!(urls instanceof Array)) {
                _utils2.default.exceptionHandler('Argument type ' + (typeof urls === 'undefined' ? 'undefined' : _typeof(urls)) + ' is not supported for add. It accepts array.');
            }

            this.dialogWithServiceWorker({
                command: 'add',
                url: urls
            }).then(function (event) {
                _state2.default.set('add', event);
            });
        }

        /**
         * Gets all cache keys from CacheStorage as array
         * If the url is provided, it gets single key and returns
         * true or false in url property of state
         *
         * @param urls <String>
         */

    }, {
        key: 'get',
        value: function get(urls) {
            this.dialogWithServiceWorker({
                command: 'keys',
                urls: urls
            }).then(function (event) {
                _state2.default.set('keys', event);
            });
        }

        /**
         * Delete e specific key from storage
         * @param urls
         */

    }, {
        key: 'delete',
        value: function _delete(urls) {
            if (!(urls instanceof Array)) {
                return _utils2.default.exceptionHandler('Argument type ' + (typeof urls === 'undefined' ? 'undefined' : _typeof(urls)) + ' is not supported for delete. It accepts array.');
            }

            this.dialogWithServiceWorker({
                command: 'delete',
                url: urls
            }).then(function (event) {
                _state2.default.set('delete', event);
            });
        }

        /**
         * Update cache urls
         *
         * @param urls
         * @returns {*}
         */

    }, {
        key: 'update',
        value: function update(urls) {
            if (!(urls instanceof Array)) {
                return _utils2.default.exceptionHandler('Argument type ' + (typeof urls === 'undefined' ? 'undefined' : _typeof(urls)) + ' is not supported for update. It accepts array.');
            }

            this.dialogWithServiceWorker({
                command: 'update',
                url: urls
            }).then(function (event) {
                _state2.default.set('update', event);
            });
        }
    }], [{
        key: 'storeDataInIndexedDB',
        value: function storeDataInIndexedDB(table, data) {
            var objectStore = _config2.default.TRANSACTION.objectStore(table);
            objectStore.add(data);
        }

        /**
         * When there is version upgrade
         * Removes previous indexedBStore
         *
         * @returns {Promise}
         */

    }, {
        key: 'clearOutOfDateObjectStore',
        value: function clearOutOfDateObjectStore(event) {
            if (event.oldVersion > 0 && event.oldVersion !== event.newVersion) {
                _config2.default.DATABASE.deleteObjectStore(_config2.default.TABLE_NAME);
            }
        }

        /**
         * If debug is true in config.js
         * This will start logging on console
         *
         * @param event
         */

    }, {
        key: 'listenServiceWorkerMessages',
        value: function listenServiceWorkerMessages(event) {
            _utils2.default.statusHandler('ServiceWorker message received: ' + JSON.stringify(event));
        }
    }]);

    return Events;
}();

exports.default = Events;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'exceptionHandler',
        value: function exceptionHandler(error) {
            if (_config2.default.DEBUG) {
                throw new Error('Error Occured: ' + error);
            }
        }
    }, {
        key: 'statusHandler',
        value: function statusHandler(status) {
            if (_config2.default.DEBUG) {
                console.info(status);
            }
        }

        // If indexedDB version set as 0 or lower it throws exception
        // For this case, it must be 1 minimum

    }, {
        key: 'adjustIndexedDbVersion',
        value: function adjustIndexedDbVersion(version) {
            if (Math.floor(version) <= 0) {
                version = 1;
            }

            return version;
        }
    }]);

    return Utils;
}();

exports.default = Utils;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stateHolder = new WeakMap();

var StateManager = function () {
    function StateManager() {
        _classCallCheck(this, StateManager);
    }

    _createClass(StateManager, null, [{
        key: 'set',
        value: function set(action, event) {
            stateHolder.set(this, {
                action: action,
                state: {
                    error: event.error,
                    message: event.message
                }
            });

            // Prevent causing error on legacy browsers
            if (typeof document.dispatchEvent === 'function') {
                document.dispatchEvent(new CustomEvent('stateChange', { 'detail': this.get() }));
            }
        }
    }, {
        key: 'get',
        value: function get() {
            return stateHolder.get(this);
        }
    }]);

    return StateManager;
}();

exports.default = StateManager;

/***/ })
/******/ ]);
});