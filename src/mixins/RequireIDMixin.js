'use strict'
import {
  assert
} from 'flexio-jshelpers'

/**
 *
 * @class
 * @description Mixin - handle a required ID
 */
export const RequireIDMixin = (Base) => class extends Base {
  /**
     * @description Mixin - init
     * @memberOf RequireIDMixin
     * @instance
     */
  RequireIDMixinInit(id) {
    assert(!!id,
      'hotballoon:RequireIDMixin:RequireIDMixinInit: `id` argument assert not be empty')
    Object.defineProperty(this, '_ID', {
      enumerable: true,
      configurable: false,
      writable: false,
      value: id
    })
  }
}
