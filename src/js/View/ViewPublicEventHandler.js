import {assertType, isFunction, isString, isSymbol} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {OrderedEventListenerConfigBuilder} from '@flexio-oss/js-commons-bundle/event-handler/index.js'

export const VIEW_RENDER = 'VIEW_RENDER'
export const VIEW_RENDERED = 'VIEW_RENDERED'
export const VIEW_UPDATE = 'VIEW_UPDATE'
export const VIEW_UPDATED = 'VIEW_UPDATED'
export const VIEW_STORE_CHANGED = 'VIEW_STORE_CHANGED'
export const VIEW_MOUNT = 'VIEW_MOUNT'
export const VIEW_UNMOUNT = 'VIEW_UNMOUNT'
export const VIEW_MOUNTED = 'VIEW_MOUNTED'
export const VIEW_REMOVE = 'VIEW_REMOVE'

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
   * @param {function(payload: *, ...args:*)} clb
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
        .callback((payload) => {
          clb(payload, ...args)
        })
        .build()
    )
  }

  /**
   *
   * @param {ViewPublicEventHandler~update} clb
   * @return {String}
   */
  update(clb) {
    return this._subscribeTo(VIEW_UPDATE, clb)
  }

  /**
   * @callback ViewPublicEventHandler~update
   */

  /**
   *
   * @param {ViewPublicEventHandler~updated} clb
   * @return {String}
   */
  updated(clb) {
    return this._subscribeTo(VIEW_UPDATED, clb)
  }

  /**
   * @callback ViewPublicEventHandler~updated
   */

  /**
   *
   * @param {ViewPublicEventHandler~render} clb
   * @return {String}
   */
  render(clb) {
    return this._subscribeTo(VIEW_RENDER, clb)
  }

  /**
   * @callback ViewPublicEventHandler~render
   */

  /**
   *
   * @param {ViewPublicEventHandler~rendered} clb
   * @return {String}
   */
  rendered(clb) {
    return this._subscribeTo(VIEW_RENDERED, clb)
  }

  /**
   * @callback ViewPublicEventHandler~rendered
   */

  /**
   *
   * @param {ViewPublicEventHandler~mount} clb
   * @return {String}
   */
  mount(clb) {
    return this._subscribeTo(VIEW_MOUNT, clb)
  }

  /**
   * @callback ViewPublicEventHandler~mount
   */

  /**
   * @param {ViewPublicEventHandler~unMount} clb
   * @return {String}
   */
  unMount(clb) {
    return this._subscribeTo(VIEW_UNMOUNT, clb)
  }

  /**
   * @callback ViewPublicEventHandler~unMount
   */

  /**
   *
   * @param {ViewPublicEventHandler~mounted} clb
   * @return {String}
   */
  mounted(clb) {
    return this._subscribeTo(VIEW_MOUNTED, clb)
  }

  /**
   * @callback ViewPublicEventHandler~mounted
   */

  /**
   * @param {ViewPublicEventHandler~storeChanged} clb
   * @return {String}
   */
  storeChanged(clb) {
    return this._subscribeTo(VIEW_STORE_CHANGED, clb)
  }

  /**
   * @callback ViewPublicEventHandler~storeChanged
   */

  /**
   * @callback ViewPublicEventHandler~storeChanged
   * @param {StoreState} payload
   */

  /**
   *
   * @param {function()} clb
   * @return {String}
   */
  remove(clb) {
    return this._subscribeTo(VIEW_REMOVE, clb)
  }


}
