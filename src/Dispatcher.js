'use strict'
import {EventHandlerBase} from './bases/EventHandlerBase'
import {assert} from 'flexio-jshelpers'
import {CLASS_TAG_NAME} from './CLASS_TAG_NAME'

export const CLASS_TAG_NAME_DISPATCHER = Symbol('__HB__DISPATCHER__')

/**
 * @class
 * @description Dispatcher is the event handler between Actions and Component
 * @extends EventHandlerBase
 */
class Dispatcher extends EventHandlerBase {
  constructor() {
    super()
    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_DISPATCHER
    })
  }

  /**
   * @description Ensure that a Listener already called
   * @param {String} type of Listener
   * @param {Array<String>} ids
   */
  waitFor(type, ids) {
    assert(!!this.isDispatching(),
      'hotballoon:Dispatcher:waitFor: Must be invoked while dispatching.'
    )
    assert(!!Array.isArray(ids),
      'hotballoon:Dispatcher:waitFor: `ids` argument should be Array type')
    let countOfIds = ids.length
    for (let i = 0; i < countOfIds; i++) {
      let id = ids[i]
      if (!this._isPending.has(id)) {
        assert(!this._isHandled.has(id),
          'hotballoon:Dispatcher:waitFor: `id` : `%s` already handled',
          id)
        assert((id in this._listeners.get(type)),
          'hotballoon:Dispatcher:waitFor: `id` : `%s` not defined',
          id)
        this._invokeCallback(type, id)
      }
    }
  }

  /**
   *
   * @param {String} type
   * @param {Function} callback
   * @returns {String} token
   */
  addActionListener(type, callback) {
    return this.addEventListener(type, callback)
  }

  /**
   *
   * @param {String} type
   * @param {String} id
   * @returns void
   */
  removeActionListener(type, id) {
    this.removeEventListener(type, id)
  }
}

export {
  Dispatcher
}
