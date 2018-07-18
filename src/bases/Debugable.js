import {LogHandler} from 'flexio-jshelpers'

/**
 * @class
 */
export class Debugable {
  constructor() {
    Object.defineProperties(this, {
      debug: {
        configurable: false,
        enumerable: false,
        /**
         * @type {LogHandler}
         * @property {LogHandler} debug
         * @name Debugable#debug
         */
        value: new LogHandler(this.constructor.name)
      }
    })
  }

  /**
   *
   * @param {boolean} [value = true]
   * @return {Debugable}
   */
  debugable(value = true) {
    this.debug.debugable(value)
    return this
  }
}
