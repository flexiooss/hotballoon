import {EventListenerOrderedParam} from './EventListenerOrderedParam'
import {EventListenerFactory} from './EventListenerFactory'

/**
 * @class
 * @extends EventListenerFactory
 */
export class EventListenerOrderedFactory extends EventListenerFactory {
  /**
   *
   * @param {String} event
   */
  constructor(event = '') {
    super(event)
    /**
     *
     * @type {number}
     * @protected
     */
    this._priority = 100
  }

  /**
   *
   * @param priority
   * @return {EventListenerOrderedFactory}
   */
  priority(priority) {
    this._priority = priority
    return this
  }

  /**
   *
   * @param scope
   * @return {EventListenerOrderedFactory}
   */
  build(scope) {
    this._scope = scope
    return EventListenerOrderedParam.create(this._event, this._callback, this._scope, this._priority)
  }
}
