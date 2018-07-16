'use strict'
import {assert} from 'flexio-jshelpers'

class WithIDBase {
  constructor(id) {
    assert(!!id,
      'hotballoon:WithIDBase:constructor: `id` argument assert not be empty')
    /**
     * @property {String}
     * @name  WithIDBase#_ID
     * @protected
     */
    Object.defineProperty(this, '_ID', {
      enumerable: true,
      configurable: false,
      writable: false,
      value: id
    })
  }
}

export {WithIDBase}
