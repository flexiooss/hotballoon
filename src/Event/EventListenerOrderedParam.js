import {deepFreezeSeal, isNumber, assert, EventListenerParam} from 'flexio-jshelpers'

/**
 * @extends {EventListenerParam}
 */
export class EventListenerOrderedParam extends EventListenerParam {
  /**
   *
   * @param {String} event
   * @param {function(payload<Object>, type<string>)} callback
   * @param {number} priority
   */
  constructor(event, callback, priority) {
    super(event, callback)
    assert(isNumber(priority),
      'hotballoon:EventListenerFactory:build: ̀`priority` property assert be a Number'
    )
    this.priority = priority
  }

  /**
   *
   * @param {String} event
   * @param {function(payload<Object>, type<string>)} callback
   * @param {number} priority
   * @return {EventListenerOrderedParam}
   * @constructor
   * @readonly
   */
  static create(event, callback, priority) {
    return deepFreezeSeal(new this(event, callback, priority))
  }
}
