import {deepFreezeSeal, isNumber, assert} from 'flexio-jshelpers'
import {EventListenerParam} from './EventListenerParam'

/**
 * @extends EventListenerParam
 */
export class EventListenerOrderedParam extends EventListenerParam {
  /**
   *
   * @param {String} event
   * @param {function(payload<Object>, type<string>)} callback
   * @param {Object | null} scope
   * @param {number} priority
   */
  constructor(event, callback, scope, priority) {
    super(event, callback, scope)
    assert(isNumber(priority),
      'hotballoon:EventListenerFactory:build: ̀`priority` property assert be a Number'
    )
    this.priority = priority
  }

  /**
   *
   * @param {String} event
   * @param {function(payload<Object>, type<string>)} callback
   * @param {Object | null} scope
   * @param {number} priority
   * @return {EventListenerOrderedParam}
   * @constructor
   * @readonly
   */
  static create(event, callback, scope, priority) {
    return deepFreezeSeal(new this(event, callback, scope, priority))
  }
}
