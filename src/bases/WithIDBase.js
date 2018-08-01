'use strict'
import {assert} from 'flexio-jshelpers'
import {Debugable} from './Debugable'

const _ID = Symbol('_ID')

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
    Object.defineProperties(this, {
      [_ID]: {
        enumerable: true,
        configurable:
            false,
        writable:
            false,
        /**
           * @property {String}
           * @type {string}
           * @name  WithIDBase#_ID
           * @protected
           */
        value: id
      }
    }
    )
  }

  /**
   *
   * @return {string}
   */
  get ID() {
    return this[_ID]
  }
}

export {WithIDBase}
