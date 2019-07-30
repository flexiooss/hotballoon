import {assert} from '@flexio-oss/assert'

const _ID = Symbol('_ID')

export class WithID {
  /**
   *
   * @param {String} id
   */
  constructor(id) {
    assert(!!id,
      'hotballoon:WithID:constructor: `id` argument assert not be empty')
    Object.defineProperties(this, {
      [_ID]: {
        enumerable: true,
        configurable:
            false,
        writable:
            false,
        /**
           * @property {String}
           * @params {string}
           * @name  WithID#_ID
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
