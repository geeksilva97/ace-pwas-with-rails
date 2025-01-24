import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { version: String }

  connect() {
    this.element.textContent = "This is home controller"
    console.log('Home controller connect', { version: this.versionValue })
  }

  initialize() {
    console.log('Home controller initialized', { version: this.versionValue })

    // Envia a mensagem para
    // registration.active?.postMessage('SET_VERSION');
  }
}
