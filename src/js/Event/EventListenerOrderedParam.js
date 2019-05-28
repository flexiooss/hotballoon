import {isNumber, assertType} from '@flexio-oss/assert'
import {deepFreezeSeal} from '@flexio-oss/js-type-helpers'
import {EventListenerParam} from '@flexio-oss/event-handler'

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
