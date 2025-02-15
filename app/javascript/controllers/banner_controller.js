import { Controller } from "@hotwired/stimulus"

// TODO: turn this into banner_controller.js
export default class extends Controller {
  static targets = ['offline', 'upgrade'];

  connect() {
    console.log(this.offlineTarget, this.upgradeTarget)
    this.updateStatus()

    window.addEventListener('online', this.updateStatus.bind(this))
    window.addEventListener('offline', this.updateStatus.bind(this))
  }

  disconnect() {
    window.removeEventListener('online', this.updateStatus.bind(this))
    window.removeEventListener('offline', this.updateStatus.bind(this))
  }

  serviceWorkerUpgrade() {
    alert('gotta upgrade this thing');
  }

  updateStatus() {
    this.offlineTarget.classList.toggle('hidden', navigator.onLine)
  }
}
