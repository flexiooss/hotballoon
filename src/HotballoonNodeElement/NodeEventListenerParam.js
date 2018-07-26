import {assert, deepFreezeSeal, isFunction, isObject, mergeWithoutPrototype} from 'flexio-jshelpers'

export class NodeEventListenerParam {
  /**
   *
   * @param {String} event
   * @param {function(payload<Object>, type<string>)} callback
   * @param {{capture: boolean, once: boolean, passive: boolean} | null} options
   * @throws AssertionError
   */
  constructor(event, callback, options = {}) {
    assert(!!event,
      'hotballoon:EventListenerParam:constructor: ̀`event` property assert be not empty'
    )
    assert(isFunction(callback),
      'hotballoon:EventListenerParam:constructor: ̀`callback` property assert be Callable'
    )
    assert(isObject(options),
      'hotballoon:EventListenerParam:constructor: ̀`options` property assert be an Object or null'
    )
    this.event = event
    this.callback = callback
    /**
     * @type {capture: boolean, once: boolean, passive: boolean}
     */
    this.options = mergeWithoutPrototype({
      capture: false,
      once: false,
      passive: false
    }, options)
  }

  /**
   *
   * @param {String} event
   * @param {function(payload<Object>, type<string>)} callback
   * @return {NodeEventListenerParam}
   * @constructor
   * @readonly
   */
  static create(event, callback) {
    return deepFreezeSeal(new this(event, callback))
  }

  /**
   *
   * @param {String} event
   * @param {function(payload<Object>, type<string>)} callback
   * @param {{capture: boolean, once: boolean, passive: boolean}} options
   * @return {NodeEventListenerParam}
   * @constructor
   * @readonly
   */
  static createWithOptions(event, callback, options) {
    return deepFreezeSeal(new this(event, callback, options))
  }
}
