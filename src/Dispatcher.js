'use strict'
import {
  EventHandlerBase
} from './EventHandlerBase'

class Dispatcher extends EventHandlerBase {
  waitFor(type, ids) {
    var countOfIds = ids.length
    for (let i = 0; i < countOfIds; i++) {
      var id = ids[i]
      if (this._isPending[id]) {
        continue
      }
      this._invokeCallback(type, id)
    }
  }
}

export {
  Dispatcher
}
