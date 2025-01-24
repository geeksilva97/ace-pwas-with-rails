// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

function registerServiceWorker() {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('Service worker registered:', registration);

      // TODO: enviar somente se o state for installed
      if (registration.waiting?.state === 'installed') {
        if (confirm('New version available. Want to upgrage?')) {
          // registration.waiting.postMessage('SKIP_WAITING');
          return;
        }
      }
      console.log('just checking', {
        waiting: registration.waiting,
        installing: registration.installing,
      });

      registration.addEventListener('updatefound', () => {
        console.log('updatefound - some service worker is being installed', {
          waiting: registration.waiting,
          installing: registration.installing,
        });

        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          console.log({ state: newWorker.state })
          if (newWorker.state !== 'installed') return;
          if (confirm('[statechanged] New version available. Want to upgrage?')) {
            // registration.waiting.postMessage('SKIP_WAITING');
          }
        });
      });
    }).catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  });
}

if ('serviceWorker' in navigator) {
  registerServiceWorker();

  // window.addEventListener('message', (event) => {
  //   console.log({ event })
  // })
}
