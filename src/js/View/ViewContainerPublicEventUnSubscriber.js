import {assertType, isFunction, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {OrderedEventListenerConfigBuilder} from '@flexio-oss/js-commons-bundle/event-handler/index.js'
import {ViewContainerPublicEventHandler} from "./ViewContainerPublicEventHandler.js";


export class ViewContainerPublicEventUnSubscriber {
  /**
   * @type {ViewContainerPublicEventUnSubscriber~unSubscriber}
   */
  #unSubscriber

  /***
   * @param {ViewPublicEventHandler~subscriberClb} unSubscriber
   */
  constructor(unSubscriber) {
    this.#unSubscriber = TypeCheck.assertIsFunction(unSubscriber)
  }

  /**
   * @callback ViewContainerPublicEventUnSubscriber~unSubscriber
   * @param {string|Symbol} eventName
   * @param {string} token
   * @return {boolean}
   */

  /**
   *
   * @param {string} token
   * @return {boolean}
   */
  beforeRemove(token) {
    return this.#unSubscriber.call(null, ViewContainerPublicEventHandler.WILL_REMOVE, token)
  }

}
