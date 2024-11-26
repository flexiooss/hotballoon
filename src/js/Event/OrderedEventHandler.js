import {OrderedEventHandler as OrderedEventHandlerBase} from '@flexio-oss/js-commons-bundle/event-handler/index.js'
import {isNull, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js';

export class OrderedEventHandler extends OrderedEventHandlerBase {
  /**
   * @type {?function():boolean}
   */
  #callbackGuard = null

  /**
   * @param {Number} [maxExecution=100]
   * @param {?function():boolean} callbackGuard
   */
  constructor(maxExecution = 100, callbackGuard = null) {
    super(maxExecution)
    this.#callbackGuard = TypeCheck.assertIsFunctionOrNull(callbackGuard)
  }

  /**
   * @param {OrderedEventListenerConfig|function(OrderedEventListenerConfigBuilder):OrderedEventListenerConfig} orderedEventListenerConfig   * @return {(String|StringArray)} token
   * @throws AssertionError
   */
  on(orderedEventListenerConfig) {
    return this.addEventListener(orderedEventListenerConfig)
  }

  /**
   * @protected
   * @param {DispatchExecution} dispatchExecution
   * @param {String} listenerToken
   * @param {EventHandlerBase~eventClb} clb
   * @param {boolean} removeListenerBeforeCallabck
   */
  _invokeCallback(dispatchExecution, listenerToken, clb, removeListenerBeforeCallabck) {
    if (isNull(this.#callbackGuard) || this.#callbackGuard.call(null)) {
      super._invokeCallback(dispatchExecution, listenerToken, clb, removeListenerBeforeCallabck)
    }
  }
}
