import {assertInstanceOf, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {listenedEventInterface} from "../Event/ListenedEvent.js";
import {OrderedEventHandler} from "../Event/OrderedEventHandler.js";
/**
 * @implements {ListenedEvent}
 */
export class ListenedStore extends listenedEventInterface(){
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
   super()
    this.#eventHandler = assertInstanceOf(eventHandler, OrderedEventHandler, 'OrderedEventHandler')
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
