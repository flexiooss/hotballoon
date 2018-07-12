'use strict'
import {assert, isBoolean} from 'flexio-jshelpers'

/**
 *
 * @class
 * @description Mixin - handle logs
 */
export const DebugableMixin = (Base) => class extends Base {
  /**
   * @description Mixin - init
   * @memberOf DebugableMixin
   * @instance
   */
  DebugableMixinInit() {
    var _debug = false

    /**
     * @property {boolean} _debug
     * @member
     */
    Object.defineProperty(this, '_debug', {
      enumerable: true,
      configurable: false,
      get: () => _debug,
      set: v => {
        assert(isBoolean(v),
          'hotballoon:DebugableMixinInit:DebugableMixinInit: `_debug` argument assert be Boolean')
        _debug = v
      }
    })
  }

  /**
   *
   * @param {...String} args
   * @private
   * @member
   */
  _log(...args) {
    if (this._debug) {
      console.log(...args)
    }
  }
}
