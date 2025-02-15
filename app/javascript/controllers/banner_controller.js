import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['offline', 'upgrade'];

  connect() {
    this.updateStatus();

    navigator.serviceWorker.getRegistration().then(this.handleUpgrade.bind(this));

    window.addEventListener('online', this.updateStatus.bind(this))
    window.addEventListener('offline', this.updateStatus.bind(this))
    navigator.serviceWorker.addEventListener('controllerchange', this.onControllerChange.bind(this));
  }

  disconnect() {
    window.removeEventListener('online', this.updateStatus.bind(this))
    window.removeEventListener('offline', this.updateStatus.bind(this))
    navigator.serviceWorker.removeEventListener('controllerchange', this.onControllerChange.bind(this));
  }

  serviceWorkerUpgrade() {
    navigator.serviceWorker.getRegistration().then(registration => {
      const newWorker = registration.installing || registration.waiting;
      newWorker?.postMessage({ type: 'SKIP_WAITING' });
    });
  }

  updateStatus() {
    this.offlineTarget.classList.toggle('hidden', navigator.onLine)
  }

  onControllerChange() {
    this.upgradeTarget.classList.add('hidden');
  }

  handleUpgrade(registration) {
    if (!registration) return;
    let promptShown = false;
    let shouldSkipWaiting = false;
    const sw = registration.waiting;

    if (sw && sw?.state !== 'redundant') {
      this.upgradeTarget.classList.remove('hidden');
      promptShown = true;
    }

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      if (!promptShown) {
        this.upgradeTarget.classList.remove('hidden');
      }

      if (shouldSkipWaiting) {
        newWorker.postMessage({ type: 'SKIP_WAITING' });
      }
    });
  }
}
