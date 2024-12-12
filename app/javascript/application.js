// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

// navigator.setAppBadge(12).then(() => {
//   console.log('Badge set!');
// }).catch((error) => {
//   console.error(error);
// });

function registerServiceWorker() {
  console.log('Registering service worker...');

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('Service worker registered:', registration);
    }).catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  });
}

if ('serviceWorker' in navigator) {
  registerServiceWorker();
}
