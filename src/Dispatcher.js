'use strict'
import {
  EventHandlerBase
} from './EventHandlerBase'

class Dispatcher extends EventHandlerBase {
  waitFor(type, ids) {
    let countOfIds = ids.length
    for (let i = 0; i < countOfIds; i++) {
      let id = ids[i]
      if (!this._isPending.has(id)) {
        this._invokeCallback(type, id)
      }
    }
  }
}

export {
  Dispatcher
}
