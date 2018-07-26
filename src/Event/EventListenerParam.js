import {assert, deepFreezeSeal, isFunction, isObject} from 'flexio-jshelpers'

export class EventListenerParam {
  /**
   *
   * @param {String} event
   * @param {function(payload<Object>, type<string>)} callback
   * @param {Object | null} scope
   */
  constructor(event, callback, scope) {
    assert(!!event,
      'hotballoon:EventListenerParam:constructor: ̀`event` property assert be not empty'
    )
    assert(isFunction(callback),
      'hotballoon:EventListenerParam:constructor: ̀`callback` property assert be Callable'
    )
    assert(isObject(scope) || scope === null,
      'hotballoon:EventListenerParam:constructor: ̀`scope` property assert be a scope'
    )
    this.event = event
    this.callback = callback
    this.scope = scope
  }

  /**
   *
   * @param {String} event
   * @param {function(payload<Object>, type<string>)} callback
   * @param {Object | null} scope
   * @return {EventListenerParam}
   * @constructor
   * @readonly
   */
  static create(event, callback, scope) {
    return deepFreezeSeal(new this(event, callback, scope))
  }
}
