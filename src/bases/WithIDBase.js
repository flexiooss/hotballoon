'use strict'
import {assert} from 'flexio-jshelpers'
import {Debugable} from './Debugable'

/**
 * @extends Debugable
 */
class WithIDBase extends Debugable {
  /**
   *
   * @param {String} id
   */
  constructor(id) {
    super()
    assert(!!id,
      'hotballoon:WithIDBase:constructor: `id` argument assert not be empty')
    Object.defineProperty(this, '_ID', {
      enumerable: true,
      configurable: false,
      writable: false,
      /**
       * @property {String}
       * @type {string}
       * @name  WithIDBase#_ID
       * @protected
       */
      value: id
    })
  }
}

export {WithIDBase}
