// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

function showConfirmationPrompt(sw) {
  const userChoice = Boolean(confirm('A new version of this site is available. Load it?'));

  if (userChoice && sw) {
    sw.postMessage({ type: 'SKIP_WAITING' });
  }

  return userChoice;
}

function handleUpgrade(registration) {
  if (!registration) return;
  let promptShown = false;
  let shouldSkipWaiting = false;
  const sw = registration.waiting;

  if (sw && sw?.state !== 'redundant') {
    shouldSkipWaiting = showConfirmationPrompt(sw);
    promptShown = true;
  }

  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;

    if (!promptShown) {
      return showConfirmationPrompt(newWorker);
    }

    if (shouldSkipWaiting) {
      newWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  });
}

function registerServiceWorker() {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      // .then(handleUpgrade)
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  });
}

if ('serviceWorker' in navigator) {
  registerServiceWorker();
}
