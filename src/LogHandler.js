'use strict'
import {assert, isBoolean} from 'flexio-jshelpers'

class LogHandler {
  constructor() {
    /**
     *
     * @type {boolean}
     * @private
     */
    this._debug = false
  }

  /**
   *
   * @param {boolean} value
   */
  set debug(value) {
    assert(isBoolean(value),
      'hotballoon:LogHandler:construct: `_debug` argument assert be Boolean')
    this._debug = value
  }

  /**
   *
   * @param {...String} args
   */
  log(...args) {
    if (this._debug) {
      console.log(...args)
    }
  }
}

export {LogHandler}
