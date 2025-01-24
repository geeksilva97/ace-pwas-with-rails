// get version from environment somehow
const VERSION = `${Date.now()}`; // Version will be the key
// Cache first strategy
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

self.addEventListener('activate', function(event) {
  console.log('service worker is being activated...', { event });

  self.postMessage('Hello from service worker');
});

self.addEventListener('install', function(event) {
  // quando esse evento é chamado, o service worker está instalado, podemis fazer skipWaiting
  console.log('service worker is being installed...', { event, blah: event.srcElement.registration });
})

self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);

  if (url.protocol === 'chrome-extension:') {
    return;
  }

  event.respondWith(cacheFirst(event.request))
});

self.addEventListener('activate', function(event) {
  console.log('Activating service worker...')

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
});

self.addEventListener('message', function(event) {
  console.log('service worker received a message', { event });
  if (event.data === 'SKIP_WAITING') {
    console.log({ self })
    self.skipWaiting();
  }
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
