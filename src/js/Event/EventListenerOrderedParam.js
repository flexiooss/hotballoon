import {deepFreezeSeal, isNumber, assertType, EventListenerParam} from 'flexio-jshelpers'

/**
 * @extends {EventListenerParam}
 */
export class EventListenerOrderedParam extends EventListenerParam {
  /**
   *
   * @param {SymbolStringArray} events
   * @param {EventHandlerBase~eventClb} callback
   * @param {number} priority
   */
  constructor(events, callback, priority) {
    super(events, callback)
    assertType(isNumber(priority),
      'hotballoon:EventListenerOrderedParam: ̀`priority` property assert be a Number'
    )
    this.priority = priority
  }

  /**
   *
   * @param {SymbolStringArray} events
   * @param {EventHandlerBase~eventClb} callback
   * @param {number} priority
   * @return {EventListenerOrderedParam}
   * @constructor
   * @readonly
   */
  static create(events, callback, priority) {
    return deepFreezeSeal(new this(events, callback, priority))
  }
}
