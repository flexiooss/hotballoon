import {deepFreezeSeal} from 'flexio-jshelpers'

export class EventListenerParam {
  /**
   *
   * @param {String} event
   * @param {function(payload<Object>, type<string>)} callback
   * @param {Object | null} scope
   * @param {number} priority
   */
  constructor(event, callback, scope, priority) {
    this.event = event
    this.callback = callback
    this.scope = scope
    this.priority = priority
  }

  /**
   *
   * @param {String} event
   * @param {function(payload<Object>, type<string>)} callback
   * @param {Object | null} scope
   * @param {number} priority
   * @return {EventListenerParam}
   * @constructor
   * @readonly
   */
  static create(event, callback, scope, priority) {
    return deepFreezeSeal(new this(event, callback, scope, priority))
  }
}
