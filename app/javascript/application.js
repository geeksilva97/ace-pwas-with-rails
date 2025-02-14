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
    navigator.serviceWorker.register('/service-worker.js')
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  });
}

function askForUpgrade(sw) {
  const userChoice = confirm('A new version of this site is available. Load it?');
  if (userChoice) {
    console.log('gotta upgrade it!!')
    sw.postMessage({ type: 'SKIP_WAITING' });
  }

  return Boolean(userChoice);
}

if ('serviceWorker' in navigator) {
  registerServiceWorker();

  let promptShown = false;
  let userChoice = false;

  navigator.serviceWorker.getRegistration().then((registration) => {
    if (!registration) return;
    const sw = registration.waiting || registration.installing;
    if (sw && sw?.state !== 'redundant') {
      userChoice = askForUpgrade(sw);
      promptShown = true;
    }

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (promptShown) {
            if (userChoice) {
              console.log('user already decided to upgrade, no need to show the prompt')
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
            return;
          }

          askForUpgrade(newWorker);
        }
      });
    });

    // if (newSw && newSw?.state !== 'redundant') {
    //   newSw.postMessage('GOTTA SKIP this')
    //   console.log({ 
    //     ['newS.state']: newSw.state,
    //   })

    //   queue.unshift(newSw);
    //   // if (confirm('A new version of this site is available. Load it?')) {
    //   //   console.log('gotta upgrade it!!')
    //   // }
    // }
  });
}
