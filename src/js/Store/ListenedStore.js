import {TypeCheck} from '@flexio-oss/js-commons-bundle/assert'

export class ListenedStore {
  /**
   * @type  {function()}
   */
  #stopListenClb
  /**
   * @type {string}
   */
  #token

  /**
   * @param {function()} stopListenChangedClb
   * @param {string} token
   */
  constructor(stopListenChangedClb, token) {
    this.#stopListenClb = TypeCheck.assertIsFunction(stopListenChangedClb)
    this.#token = TypeCheck.assertIsString(token)
  }

  /**
   * @return {string}
   */
  token() {
    return this.#token
  }

  remove() {
    this.#stopListenClb.call(null)
  }
}
