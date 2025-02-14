import { Controller } from "@hotwired/stimulus"

// TODO: turn this into banner_controller.js
export default class extends Controller {
  connect() {
    this.updateStatus()

    window.addEventListener('online', this.updateStatus.bind(this))
    window.addEventListener('offline', this.updateStatus.bind(this))
  }

  disconnect() {
    window.removeEventListener('online', this.updateStatus.bind(this))
    window.removeEventListener('offline', this.updateStatus.bind(this))
  }

  updateStatus() {
    this.element.classList.toggle('hidden', navigator.onLine)
  }
}
