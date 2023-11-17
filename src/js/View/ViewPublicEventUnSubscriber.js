import {assertType, isFunction, isString, isSymbol, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {OrderedEventListenerConfigBuilder} from '@flexio-oss/js-commons-bundle/event-handler/index.js'
import {
  VIEW_MOUNT, VIEW_MOUNTED, VIEW_REMOVE,
  VIEW_RENDER,
  VIEW_RENDERED, VIEW_STORE_CHANGED,
  VIEW_UNMOUNT,
  VIEW_UPDATE,
  VIEW_UPDATED
} from "./ViewPublicEventHandler.js";



export class ViewPublicEventUnSubscriber {
  /**
   * @type {ViewPublicEventUnSubscriber~unSubscriber}
   */
  #unSubscriber

  /***
   * @param {ViewPublicEventUnSubscriber~unSubscriber} unSubscriber
   */
  constructor(unSubscriber) {
    /**
     * @type {ViewPublicEventUnSubscriber~unSubscriber}
     * @private
     */
    this.#unSubscriber = TypeCheck.assertIsFunction(unSubscriber)
  }

  /**
   * @callback ViewPublicEventUnSubscriber~unSubscriber
   * @param {string|Symbol} eventName
   * @param {string} token
   * @return {boolean}
   */


  /**
   * @param {string} token
   * @return {boolean}
   */
  update(token) {
    return this.#unSubscriber.call(null, VIEW_UPDATE, token)
  }

  /**
   * @param {string} token
   * @return {boolean}
   */
  updated(token) {
    return this.#unSubscriber.call(null, VIEW_UPDATED, token)
  }

  /**
   * @param {string} token
   * @return {boolean}
   */
  render(token) {
    return this.#unSubscriber.call(null, VIEW_RENDER, token)
  }
  /**
   * @param {string} token
   * @return {boolean}
   */
  rendered(token) {
    return this.#unSubscriber.call(null, VIEW_RENDERED, token)
  }
  /**
   * @param {string} token
   * @return {boolean}
   */
  mount(token) {
    return this.#unSubscriber.call(null, VIEW_MOUNT, token)
  }
  /**
   * @param {string} token
   * @return {boolean}
   */
  unMount(token) {
    return this.#unSubscriber.call(null, VIEW_UNMOUNT, token)
  }
  /**
   * @param {string} token
   * @return {boolean}
   */
  mounted(token) {
    return this.#unSubscriber.call(null, VIEW_MOUNTED, token)
  }
  /**
   * @param {string} token
   * @return {boolean}
   */
  storeChanged(token) {
    return this.#unSubscriber.call(null, VIEW_STORE_CHANGED, token)
  }
  /**
   * @param {string} token
   * @return {boolean}
   */
  remove(token) {
    return this.#unSubscriber.call(null, VIEW_REMOVE, token)
  }


}
