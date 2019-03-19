import {EventListenerOrderedParam} from './EventListenerOrderedParam'
import {EventListenerBuilder} from 'flexio-jshelpers'

/**
 * @class
 * @extends {EventListenerBuilder}
 */
export class EventListenerOrderedBuilder extends EventListenerBuilder {
  /**
   *
   * @param {String} event
   */
  constructor(event = '') {
    super(event)
    /**
     *
     * @params {number}
     * @protected
     */
    this._priority = 100
  }

  /**
   *
   * @param priority
   * @return {EventListenerOrderedBuilder}
   */
  priority(priority) {
    this._priority = priority
    return this
  }

  /**
   *
   * @return {EventListenerOrderedParam}
   */
  build() {
    return EventListenerOrderedParam.create(this._event, this._callback, this._priority)
  }
}
