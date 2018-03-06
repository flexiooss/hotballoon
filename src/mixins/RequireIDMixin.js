'use strict'
import {
  assert
} from 'flexio-jshelpers'

export const RequireIDMixin = (Base) => class extends Base {
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
