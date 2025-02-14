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
  let shouldSendMessage = false;
  const sw = registration.waiting;

  if (sw && sw?.state !== 'redundant') {
    shouldSendMessage = showConfirmationPrompt(sw);
    promptShown = true;
  }

  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;

    if (promptShown && shouldSendMessage) {
      console.log('user already decided to upgrade, no need to show the prompt')
      newWorker.postMessage({ type: 'SKIP_WAITING' });
      return;
    }

    showConfirmationPrompt(newWorker);

    // Actually there is not need to wait for the new worker to be installed
    // even if the installation is not finished, the new worker will be activated

    // newWorker.addEventListener('statechange', () => {
    //   if (newWorker.state === 'installed') {
    //     if (promptShown && shouldSendMessage) {
    //       console.log('user already decided to upgrade, no need to show the prompt')
    //       newWorker.postMessage({ type: 'SKIP_WAITING' });
    //       return;
    //     }

    //     showConfirmationPrompt(newWorker);
    //   }
    // });
  });
}

function registerServiceWorker() {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(handleUpgrade)
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  });
}

if ('serviceWorker' in navigator) {
  registerServiceWorker();

  // let promptShown = false;
  // let userChoice = false;

  // navigator.serviceWorker.getRegistration().then((registration) => {
  //   if (!registration) return;
  //   const sw = registration.waiting || registration.installing;
  //   if (sw && sw?.state !== 'redundant') {
  //     userChoice = askForUpgrade(sw);
  //     promptShown = true;
  //   }

  //   registration.addEventListener('updatefound', () => {
  //     const newWorker = registration.installing;

  //     newWorker.addEventListener('statechange', () => {
  //       if (newWorker.state === 'installed') {
  //         if (promptShown) {
  //           if (userChoice) {
  //             console.log('user already decided to upgrade, no need to show the prompt')
  //             newWorker.postMessage({ type: 'SKIP_WAITING' });
  //           }
  //           return;
  //         }

  //         askForUpgrade(newWorker);
  //       }
  //     });
  //   });

  //   // if (newSw && newSw?.state !== 'redundant') {
  //   //   newSw.postMessage('GOTTA SKIP this')
  //   //   console.log({ 
  //   //     ['newS.state']: newSw.state,
  //   //   })

  //   //   queue.unshift(newSw);
  //   //   // if (confirm('A new version of this site is available. Load it?')) {
  //   //   //   console.log('gotta upgrade it!!')
  //   //   // }
  //   // }
  // });
}
