import {assertType, isFunction, isObject} from '@flexio-oss/js-commons-bundle/assert'
import {deepFreezeSeal, mergeWithoutPrototype} from '@flexio-oss/js-commons-bundle/js-type-helpers'

export class EventListenerConfig {
  /**
   *
   * @param {String} event
   * @param {function(payload<Object>, type<string>)} callback
   * @param {?{capture: boolean, once: boolean, passive: boolean}} options
   * @throws AssertionError
   */
  constructor(event, callback, options = {}) {
    assertType(!!event,
      'EventListenerConfig:constructor: ̀`events` property assert be not empty'
    )
    assertType(isFunction(callback),
      'EventListenerConfig:constructor: ̀`callback` property assert be Callable'
    )
    assertType(isObject(options),
      'EventListenerConfig:constructor: ̀`options` property assert be an Object or null'
    )
    this.events = event
    this.callback = callback
    /**
     * @params {capture: boolean, once: boolean, passive: boolean}
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
   * @return {EventListenerConfig}
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
   * @return {EventListenerConfig}
   * @constructor
   * @readonly
   */
  static createWithOptions(event, callback, options) {
    return deepFreezeSeal(new this(event, callback, options))
  }

  /**
   * @param {EventListenerConfig} current
   * @param {EventListenerConfig} compare
   * @return {boolean}
   */
  static areLike(current, compare) {
    if (current == compare) {
      return true
    }
    return (current.callback.toString() === compare.callback.toString())
      && (current.events === compare.events)
      && (current.options.capture === compare.options.capture)
      && (current.options.once === compare.options.once)
      && (current.options.passive === compare.options.passive);

  }
}
