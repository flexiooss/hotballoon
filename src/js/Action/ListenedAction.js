import {listenedEventInterface} from "../Event/ListenedEvent.js";

/**
 * @implements {ListenedEvent}
 */
export class ListenedAction  extends listenedEventInterface(){
  /**
   * @type {Dispatcher}
   */
  #dispatcher
  /**
   * @type {string}
   */
  #actionID
  /**
   * @type {string}
   */
  #token

  /**
   * @param {Dispatcher} dispatcher
   * @param {string} actionID
   * @param {string} token
   */
  constructor(dispatcher, actionID, token) {
    super()
    this.#dispatcher = dispatcher
    this.#actionID = actionID
    this.#token = token
  }

  /**
   * @return {string}
   */
  token() {
    return this.#token
  }

  /**
   * @return {boolean}
   */
  disable() {
    return this.#dispatcher.disableEventListener(this.#actionID, this.#token)
  }

  /**
   * @return {boolean}
   */
  enable() {
    return this.#dispatcher.enableEventListener(this.#actionID, this.#token)
  }

  remove() {
    this.#dispatcher.removeActionListener(this.#actionID, this.#token)
  }
}
