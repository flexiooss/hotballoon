export class ListenedAction {
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

  remove() {
    this.#dispatcher.removeActionListener(this.#actionID, this.#token)
  }
}
