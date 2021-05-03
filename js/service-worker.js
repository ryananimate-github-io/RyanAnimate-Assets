const params = {"sudioStaticResourceHost":"/code","workerStaticHost":"/static/workers"};

const studioStaticResourceRegex = new RegExp(`^${params.sudioStaticResourceHost}.*\\.(js|css)$`);
const workerStaticResourceRegex = new RegExp(`^${params.workerStaticHost}.*\\.(js)$`);

const studioStaticCacheId = 'vy-studio-static-cache';
const workerStaticCacheId = 'vy-worker-static-cache';

const maxItemsLookup = {
    [studioStaticCacheId]: 15,
    [workerStaticCacheId]: 6,
};

let cacheLookup = {};

async function getCacheObject(cacheId) {
    if (cacheLookup[cacheId]) {
        return cacheLookup[cacheId];
    }

    const cache = await caches.open(studioStaticCacheId);

    cacheLookup[cacheId] = cache;

    return cache;
}

async function cacheIfPossible(requestUrl, response) {
    try {
        if (studioStaticResourceRegex.test(requestUrl)) {
            await addToLRU(studioStaticCacheId, requestUrl, response);
        } else if (workerStaticResourceRegex.test(requestUrl)) {
            await addToLRU(workerStaticCacheId, requestUrl, response);
        }
    } catch (err) {
        console.error(err);
        console.error('Failed to cache: ', requestUrl);
    }
}

async function addToLRU(cacheId, requestUrl, response) {
    const cache = await getCacheObject(cacheId);
    const cachedKeys = await cache.keys();

    try {
        console.log('Adding to cache:', requestUrl);

        return await cache.put(requestUrl, response);
    } finally {
        if (cachedKeys.length >= maxItemsLookup[cacheId]) {
            for (let i = 0; i < cachedKeys.length - maxItemsLookup[cacheId]; i++) {
                await cache.delete(cachedKeys[i]);
            }
        }
    }
}

async function updateItemOrder(requestUrl, response) {
    try {
        if (studioStaticResourceRegex.test(requestUrl)) {
            await updateItemOrderInCache(studioStaticCacheId, requestUrl, response);
        } else if (workerStaticResourceRegex.test(requestUrl)) {
            await updateItemOrderInCache(workerStaticCacheId, requestUrl, response);
        }
    } catch (err) {
        console.error(err);
        console.error('Failed to update cache order: ', requestUrl);
    }
}

async function updateItemOrderInCache(cacheId, requestUrl, response) {
    const cache = await getCacheObject(cacheId);

    await cache.put(requestUrl, response);
}

async function handleFetchEvent(event) {
    const request = event.request;
    const requestUrl = request.url;

    let response = await caches.match(request);

    if (response) {
        console.log('Found ', requestUrl, ' in cache');
        updateItemOrder(requestUrl, response.clone());

        return response;
    }

    response = await fetch(request);

    await cacheIfPossible(requestUrl, response.clone());

    return response;
}

function shouldHandleFetchEvent(event) {
    const request = event.request;
    const requestUrl = request.url;

    return studioStaticResourceRegex.test(requestUrl) || workerStaticResourceRegex.test(requestUrl);
}

self.addEventListener('install', (event) => {
    console.log('Service worker installing...');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activating...');
});

self.addEventListener('fetch', (event) => {
    if (shouldHandleFetchEvent(event)) {
        event.respondWith(handleFetchEvent(event));
    }
});
