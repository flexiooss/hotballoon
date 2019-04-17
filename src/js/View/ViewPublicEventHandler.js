import {assertType, isFunction} from 'flexio-jshelpers'
import {EventListenerOrderedBuilder} from '../Event/EventListenerOrderedBuilder'
import {
  VIEW_RENDER,
  VIEW_RENDERED,
  VIEW_UPDATE,
  VIEW_UPDATED,
  VIEW_STORE_CHANGED,
  VIEW_MOUNT,
  VIEW_MOUNTED
} from './View'

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
     * @protected
     */
    this._subscriber = subscriber
  }

  /**
   * @callback ViewPublicEventHandler~subscriberClb
   * @param {EventListenerOrderedParam} eventListenerOrderedParam
   * @return {String} token
   */

  /**
   *
   * @param {ViewCounterEvent~update} clb
   * @return {String}
   */
  update(clb) {
    assertType(
      isFunction(clb),
      'ViewContainerPublicEventHandler:update: `clb` should be a function'
    )
    return this._subscriber(
      EventListenerOrderedBuilder
        .listen(VIEW_UPDATE)
        .callback(() => {
          clb()
        })
        .build()
    )
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
    assertType(
      isFunction(clb),
      'ViewContainerPublicEventHandler:updated: `clb` should be a function'
    )
    return this._subscriber(
      EventListenerOrderedBuilder
        .listen(VIEW_UPDATED)
        .callback(() => {
          clb()
        })
        .build()
    )
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
    assertType(
      isFunction(clb),
      'ViewContainerPublicEventHandler:render: `clb` should be a function'
    )
    return this._subscriber(
      EventListenerOrderedBuilder
        .listen(VIEW_RENDER)
        .callback(() => {
          clb()
        })
        .build()
    )
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
    assertType(
      isFunction(clb),
      'ViewContainerPublicEventHandler:rendered: `clb` should be a function'
    )
    return this._subscriber(
      EventListenerOrderedBuilder
        .listen(VIEW_RENDERED)
        .callback(() => {
          clb()
        })
        .build()
    )
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
    assertType(
      isFunction(clb),
      'ViewContainerPublicEventHandler:mount: `clb` should be a function'
    )
    return this._subscriber(
      EventListenerOrderedBuilder
        .listen(VIEW_MOUNT)
        .callback(() => {
          clb()
        })
        .build()
    )
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
    assertType(
      isFunction(clb),
      'ViewContainerPublicEventHandler:mounted: `clb` should be a function'
    )
    return this._subscriber(
      EventListenerOrderedBuilder
        .listen(VIEW_MOUNTED)
        .callback(() => {
          clb()
        })
        .build()
    )
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
    assertType(
      isFunction(clb),
      'ViewContainerPublicEventHandler:storeChanged: `clb` should be a function'
    )
    return this._subscriber(
      EventListenerOrderedBuilder
        .listen(VIEW_STORE_CHANGED)
        .callback(() => {
          clb()
        })
        .build()
    )
  }

  /**
   * @callback ViewCounterEvent~storeChanged
   * @param {StoreState} payload
   */
}
