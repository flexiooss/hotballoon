import {ReconciliationAttributeHandler} from './ReconciliationAttributeHandler'
import {KEY_EVENT_WRAPPER} from './constantes'
import {getNextSequence} from './sequence'
import {CustomEventHandler} from "./CustomEventHandler";

/**
 * @extends ReconciliationAttributeHandler
 */
export class ListenerAttributeHandler extends ReconciliationAttributeHandler {
  /**
   * @static
   * @param {Node} element
   * @return {ListenerAttributeHandler}
   */
  static select(element) {
    return new ListenerAttributeHandler(element)
  }

  /**
   *
   * @return {Map<string, Map<string, EventListenerConfig>>}
   */
  eventListeners() {
    if (!(KEY_EVENT_WRAPPER in this.privateAttribute)) {
      this.privateAttribute[KEY_EVENT_WRAPPER] = this._initEventListener()
    }
    return this.privateAttribute[KEY_EVENT_WRAPPER]
  }

  /**
   *
   * @return {Map<string, Map<string, EventListenerConfig>>}
   * @private
   */
  _initEventListener() {
    return new Map()
  }

  /**
   *
   * @return {Map<string, EventListenerConfig>}
   * @private
   */
  _initEventListenerType() {
    return new Map()
  }

  /**
   * @param {EventListenerConfig} nodeEventListenerConfig
   * @return {string}
   */
  on(nodeEventListenerConfig) {
    this.element.addEventListener(
      nodeEventListenerConfig.events,
      nodeEventListenerConfig.callback,
      nodeEventListenerConfig.options
    )
    return this.#addEventListener(nodeEventListenerConfig)
  }


  /**
   * @param {EventListenerConfig} nodeEventListenerConfig
   * @return {string}
   * @private
   */
  #addEventListener(nodeEventListenerConfig) {
    this.#handleCustomEvent(nodeEventListenerConfig)
    if (!(this.eventListeners().has(nodeEventListenerConfig.events))) {
      this.eventListeners().set(nodeEventListenerConfig.events, this._initEventListenerType())
    }
    const token = getNextSequence()
    this.eventListeners().get(nodeEventListenerConfig.events).set(
      token,
      nodeEventListenerConfig
    )
    return token
  }

  /**
   * @param {EventListenerConfig} nodeEventListenerConfig
   * @return {ListenerAttributeHandler}
   */
  #handleCustomEvent(nodeEventListenerConfig) {
    if (CustomEventHandler.isCustomEvent(nodeEventListenerConfig.events)) {
      CustomEventHandler.ensureHandler(this.element).enable(nodeEventListenerConfig.events)
    }
    return this
  }

  /**
   * @function off
   * @description remove from shallow copy params listened
   * @param {String} event of events
   * @param {String} token of listener
   */

  off(event, token) {
    if (this._hasEventKey(event, token)) {
      const nodeEventListenerConfig = this.eventListeners().get(event).get(token)
      this.#elementRemoveListener(nodeEventListenerConfig)
      this._removeEventListenerByKey(event, token)
    }
  }

  /**
   *
   * @param {EventListenerConfig} nodeEventListenerConfig
   * @private
   */
  #elementRemoveListener(nodeEventListenerConfig) {
    if (CustomEventHandler.isCustomEvent(nodeEventListenerConfig.events) && CustomEventHandler.hasHandler(this.element)) {
      /**
       * @type {CustomEventHandler}
       */
      const handler = CustomEventHandler.getHandler(this.element).disable(nodeEventListenerConfig.events)
      if (handler.isEmpty()) {
        handler.remove()
      }
    }
    this.element.removeEventListener(nodeEventListenerConfig.events, nodeEventListenerConfig.callback, nodeEventListenerConfig.options)
  }

  /**
   * Remove all listeners
   */
  cleanListeners() {
    if (this.eventListeners().size) {
      this.eventListeners().forEach((value, key, map) => {
        value.forEach((v, k, m) => {
          this.#elementRemoveListener(v)
        })
      })
    }
  }

  /**
   *
   * @param {string} event
   * @param {string} token
   * @private
   */
  _removeEventListenerByKey(event, token) {
    if (this.eventListeners().has(event)) {
      this.eventListeners().get(event).delete(token)
    }
  }

  /**
   *
   * @param {string} event
   * @param {string} token
   * @return {boolean}
   * @private
   */
  _hasEventKey(event, token) {
    return this.eventListeners().has(event) && this.eventListeners().get(event).has(token)
  }
}

export const select = ListenerAttributeHandler.select
