'use strict'
import {
  EventHandlerBase
} from './bases/EventHandlerBase'
import {
  assert
} from 'flexio-jshelpers'

class Dispatcher extends EventHandlerBase {
  /**
     *
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
}

export {
  Dispatcher
}
