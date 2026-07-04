const CACHE_NAME = "northbound-v20260704";
const ASSETS = [
  "./",
  "index.html",
  "style.css",
  "nav.js",
  "sw.js",
  "chapter-01.html",
  "chapter-02.html",
  "chapter-03.html",
  "chapter-04.html",
  "chapter-05.html",
  "chapter-06.html",
  "chapter-07.html",
  "chapter-08.html",
  "chapter-09.html",
  "chapter-10.html",
  "chapter-11.html",
  "chapter-12.html",
  "chapter-13.html",
  "chapter-14.html",
  "chapter-15.html",
  "chapter-16.html",
  "chapter-17.html",
  "chapter-18.html",
  "chapter-19.html",
  "chapter-20.html",
  "chapter-21.html",
  "chapter-22.html",
  "chapter-23.html",
  "chapter-24.html",
  "chapter-25.html"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") {
    return;
  }

  var requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then(function (response) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, copy);
        });
        return response;
      }).catch(function () {
        if (event.request.mode === "navigate") {
          return caches.match("index.html");
        }
      });
    })
  );
});
