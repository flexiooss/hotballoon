import {TypeCheck} from '@flexio-oss/js-commons-bundle/assert'

export class ListenedStore {
  /**
   * @type  {OrderedEventHandler}
   */
  #eventHandler
  /**
   * @type {string}
   */
  #event
  /**
   * @type {string}
   */
  #token

  /**
   * @param {OrderedEventHandler} eventHandler
   * @param {string} event
   * @param {string} token
   */
  constructor(eventHandler, event, token) {
    this.#eventHandler = eventHandler
    this.#event = TypeCheck.assertIsString(event)
    this.#token = TypeCheck.assertIsString(token)
  }

  /**
   * @return {boolean}
   */
  disable() {
    return this.#eventHandler.disableEventListener(this.#event, this.#token)
  }

  /**
   * @return {boolean}
   */
  enable() {
    return this.#eventHandler.enableEventListener(this.#event, this.#token)
  }

  /**
   * @return {string}
   */
  token() {
    return this.#token
  }

  /**
   * @return {string}
   */
  event() {
    return this.#event
  }

  remove() {
    this.#eventHandler.removeEventListener(this.#event, this.#token)
  }
}
