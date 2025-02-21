const VERSION = Date.now();

async function cacheFirst(request) {
  const cache = await caches.open(VERSION);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const responseFromNetwork = await fetch(request.clone());

    cache.put(request, responseFromNetwork.clone());

    return responseFromNetwork;
  } catch (error) {
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);

  if (url.protocol === 'chrome-extension:') {
    return;
  }

  return fetch(event.request);
  // event.respondWith(cacheFirst(event.request))
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    console.log('I received a SKIP_WAITING message', { myCurrentState: self.serviceWorker.state })
    self.skipWaiting();
  }
});

self.addEventListener('install', function(event) {
  console.log('Service worker install event', { state: event.currentTarget.serviceWorker.state })

  // simulate a long install so you can see the flow on DevTools
  // event.waitUntil(new Promise((resolve, reject) => setTimeout(() => reject('just simulating an error'), 6000)));
  event.waitUntil(new Promise((resolve, reject) => setTimeout(resolve, 6000)));
});

self.addEventListener('activate', function(event) {
  console.log('Service worker activate event', { state: event.currentTarget.serviceWorker.state })

  self.clients.claim(); // take control of all pages under this service worker's scope

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  event.waitUntil(new Promise((resolve) => setTimeout(resolve, 3000)));
});

// Add a service worker for processing Web Push notifications:
//
// self.addEventListener("push", async (event) => {
//   const { title, options } = await event.data.json()
//   event.waitUntil(self.registration.showNotification(title, options))
// })
//
// self.addEventListener("notificationclick", function(event) {
//   event.notification.close()
//   event.waitUntil(
//     clients.matchAll({ type: "window" }).then((clientList) => {
//       for (let i = 0; i < clientList.length; i++) {
//         let client = clientList[i]
//         let clientPath = (new URL(client.url)).pathname
//
//         if (clientPath == event.notification.data.path && "focus" in client) {
//           return client.focus()
//         }
//       }
//
//       if (clients.openWindow) {
//         return clients.openWindow(event.notification.data.path)
//       }
//     })
//   )
// })
