import { Controller } from "@hotwired/stimulus"

function isPWAInstalled() {
  // Check if running in standalone mode
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
}

export default class extends Controller {
  static values = { version: String }
  static targets = ['installButton']

  connect() {
    console.log('Home controller connect', { version: this.versionValue })
  }

  initialize() {
    console.log('Home controller initialized', { version: this.versionValue })
    console.log(this.installButtonTarget)

    window.addEventListener("beforeinstallprompt", (event) => {
      console.log('this executes if this app is eligible for installing')
      event.preventDefault();
      this.installPrompt = event;
      this.installButtonTarget.classList.remove('hidden');
    });

    window.addEventListener('appinstalled', () => {
      console.log('The PWA has been installed.');
    });

    // Envia a mensagem para
    // registration.active?.postMessage('SET_VERSION');
  }

  installApp() {
    console.log('gotta install this app', {
      installPrompt: this.installPrompt,
      registration: navigator.serviceWorker?.ready,
    });

    if (isPWAInstalled()) {
      alert('PWA is already installed');
      return;
    }

    if (this.installPrompt) {
      this.installPrompt.prompt();
      this.installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
          this.installButtonTarget.classList.add('hidden');
        }
        console.log({ choiceResult });
      });
    }
  }
}
