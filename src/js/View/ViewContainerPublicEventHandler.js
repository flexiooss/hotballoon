import {assertType, isFunction} from 'flexio-jshelpers'
import {EventListenerOrderedBuilder} from '../Event/EventListenerOrderedBuilder'
export const WILL_REMOVE = 'WILL_REMOVE'

export class ViewContainerPublicEventHandler {
  /***
   *
   * @param {ViewPublicEventHandler~subscriberClb} subscriber
   */
  constructor(subscriber) {
    assertType(isFunction(subscriber), 'ViewContainerPublicEventHandler: `subscriber` should be a function')
    /**
     *
     * @type {ViewPublicEventHandler~subscriberClb}
     * @protected
     */
    this._subscriber = subscriber
  }

  /**
   * @callback ViewContainerPublicEventHandler~subscriberClb
   * @param {EventListenerOrderedParam} eventListenerOrderedParam
   * @return {String} token
   */

  /**
   *
   * @param {ViewContainerPublicEventHandler~removeClb} clb
   * @return {String}
   */
  beforeRemove(clb) {
    assertType(
      isFunction(clb),
      'ViewContainerPublicEventHandler:beforeRemove: `clb` should be a function'
    )
    return this._subscriber(
      EventListenerOrderedBuilder
        .listen(WILL_REMOVE)
        .callback(() => {
          clb()
        })
        .build()
    )
  }

  /**
   * @callback ViewContainerPublicEventHandler~removeClb
   */
}
