# Cachier

<hr/>

> **Warning:** Cachier is currently in beta. Only usable in the browsers that has Service Worker and Cache Storage.


Cache your content on clients browser with Cachier! `Cachier`, uses `Cache Storage` for caching static pages & files. The `Service Worker` technology serves it over cache for your clients. It also allows clients view offline pages.

**Features**

- The caching process controlled by owner
- Lightning fast page load
- Offline page views
- Less network requests

## Table of Contents

* [Install](#install)
* [Cachier](#cachier)
  * [API](#api)
  * [Options](#options)
  * [Listeners](#listeners)
  * [Example](#example)
* [Contributing](#contributing)
* [Copyright](#copyright)

## Install

You can install the library via npm.

```
npm install browser-cachier --save
```

or via yarn:

```
yarn add browser-cachier
```

> **Warning:** You need to put [cachier-service-worker.js](https://github.com/tugayilik/cachier/blob/master/cachier-service-worker.js) to your sites `root directory`.

## Cachier

### API

**Warning:** add, remove, update and delete updates the current state of cachier. All events below are returning instance with a promise.

**`new Cachier(config: Object): Cachier`**  

Cachier instance takes one argument which is config. The accepted configs described below.

**`cachier.add(urls: Array, callback: Function~response): Cachier`**

Adds provided url list to cache storage. If the provided url is in the cache already, it doesn't add it again. The url list returned from callback.

**`cachier.get(urls: Array, callback: Function~response): Cachier`**

Get cache key from storage. If urls argument not sent by user, it gets all otherwise gets single one. As a result it returns true or false according to its existence

**`cachier.update(urls: Array, callback: Function~response): Cachier`**

Updates the cache content of provided files. The url list returned from callback.

**`cachier.delete(urls: Array, callback: Function~response): Cachier`**

Delete provided url list from cache storage. The url list returned from callback.

**`cachier.clear(callback: Function~response): Cachier`**

Empty all cache storage. The deleted item list returned from callback.

### Options

**`version {String|Number}`** 

Sets a version to cache storage. After caching process completed for the first time, it will stay till user clears the cache storage. To overcome this, you can upgrade the version to a greater value. It will clear out of date storages and will set a new one.

**`serviceWorkerPath {String}`**

Cachier is using [cachier-service-worker.js](https://github.com/tugayilik/cachier/blob/master/cachier-service-worker.js) to create a layer between network requests and cache. File should be placed on your root directory to observe all scope. This parameter is the location of service worker.

**`debug {Boolean}`**

If it is true, it gives information on the console about what is going on.

### Listeners

**`stateChange`**  

Everytime change happens on cache storage over API events, stateChange event triggers. It is bound to document. With a simple eventListener you can catch-up state changes. 

### Example

```js
import Cachier from 'browser-cachier';

let urlsToCache = ['/dummy/style.css', '/dummy/dummy.json'];
let cachier = new Cachier({ version: 1 });

cachier.add(urlsToCache, (response) => {
  console.log(response);
});

cachier.get(response => {
  console.log('Get: ', response);
});

cachier.get('/dummy/style.css', response => {
  console.log('Get: ', response);
});

// Remove specific cache items after 1500ms
setTimeout(() => {
  cachier.delete(urlsToCache, response => {
    console.log('Delete: ', response);
  });
}, 1500)

// Remove whole cache on page load
window.onload = function () {
  cachier.clear();
};

```

## Contributing

Do not hesitate to contribute! It is a new born baby and open to ideas.

For more information, please checkout the [contribution document](https://github.com/tugayilik/cachier/blob/master/CONTRIBUTION.md).

## Copyright

Copyright (c) 2017 tugayilik. See LICENSE.md for further details.
