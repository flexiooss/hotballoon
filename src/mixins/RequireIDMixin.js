import {
  should
} from 'flexio-jshelpers'

export const RequireIDMixin = (Base) => class extends Base {
  RequireIDMixinInit(id) {
    should(!!id,
      'hotballoon:RequireIDMixin:RequireIDMixinInit: `id` argument should not be empty')
    Object.defineProperty(this, '_ID', {
      enumerable: true,
      configurable: false,
      writable: false,
      value: id
    })
  }
}
