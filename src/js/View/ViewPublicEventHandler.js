import {assertType, isFunction} from 'flexio-jshelpers'
import {EventListenerOrderedBuilder} from '../Event/EventListenerOrderedBuilder'
import {WILL_REMOVE} from './ViewContainer'

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
}
