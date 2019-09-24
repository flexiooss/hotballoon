import {assertType, isFunction, isSymbol, isString} from '@flexio-oss/assert'
import {OrderedEventListenerConfigBuilder} from '@flexio-oss/event-handler'

export const VIEW_RENDER = 'VIEW_RENDER'
export const VIEW_RENDERED = 'VIEW_RENDERED'
export const VIEW_UPDATE = 'VIEW_UPDATE'
export const VIEW_UPDATED = 'VIEW_UPDATED'
export const VIEW_STORE_CHANGED = 'VIEW_STORE_CHANGED'
export const VIEW_MOUNT = 'VIEW_MOUNT'
export const VIEW_MOUNTED = 'VIEW_MOUNTED'

export class ViewPublicEventHandler {
  /***
   *
   * @param {ViewPublicEventHandler~subscriberClb} subscriber
   */
  constructor(subscriber) {
    assertType(isFunction(subscriber), 'PublicEventHandler: `subscriber` should be a function')
    /**
     *
     * @type {ViewPublicEventHandler~subscriberClb}
     * @private
     */
    this.__subscriber = subscriber
  }

  /**
   * @callback ViewPublicEventHandler~subscriberClb
   * @param {OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {String} token
   */

  /**
   *
   * @param {(string|Symbol)}event
   * @param {Function} clb
   * @param {...*} args
   * @return {String}
   * @protected
   */
  _subscribeTo(event, clb, ...args) {
    assertType(
      isSymbol(event) || isString(event),
      'ViewPublicEventHandler:_subscribe: `event` should be a string or symbol'
    )
    assertType(
      isFunction(clb),
      'ViewPublicEventHandler:_subscribe: `clb` should be a function'
    )
    return this.__subscriber(
      OrderedEventListenerConfigBuilder
        .listen(event)
        .callback(() => {
          clb(...args)
        })
        .build()
    )
  }

  /**
   *
   * @param {ViewCounterEvent~update} clb
   * @return {String}
   */
  update(clb) {
    return this._subscribeTo(VIEW_UPDATE, clb)
  }

  /**
   * @callback ViewCounterEvent~update
   */

  /**
   *
   * @param {ViewCounterEvent~updated} clb
   * @return {String}
   */
  updated(clb) {
    return this._subscribeTo(VIEW_UPDATED, clb)
  }

  /**
   * @callback ViewCounterEvent~updated
   */

  /**
   *
   * @param {ViewCounterEvent~render} clb
   * @return {String}
   */
  render(clb) {
    return this._subscribeTo(VIEW_RENDER, clb)
  }

  /**
   * @callback ViewCounterEvent~render
   */

  /**
   *
   * @param {ViewCounterEvent~rendered} clb
   * @return {String}
   */
  rendered(clb) {
    return this._subscribeTo(VIEW_RENDERED, clb)
  }

  /**
   * @callback ViewCounterEvent~rendered
   */

  /**
   *
   * @param {ViewCounterEvent~mount} clb
   * @return {String}
   */
  mount(clb) {
    return this._subscribeTo(VIEW_MOUNT, clb)
  }

  /**
   * @callback ViewCounterEvent~mount
   */

  /**
   *
   * @param {ViewCounterEvent~mounted} clb
   * @return {String}
   */
  mounted(clb) {
    return this._subscribeTo(VIEW_MOUNTED, clb)
  }

  /**
   * @callback ViewCounterEvent~mounted
   */

  /**
   *
   * @param {ViewCounterEvent~storeChanged} clb
   * @return {String}
   */
  storeChanged(clb) {
    return this._subscribeTo(VIEW_STORE_CHANGED, clb)
  }

  /**
   * @callback ViewCounterEvent~storeChanged
   * @param {StoreState} payload
   */
}
