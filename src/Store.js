import {
  EventEmitter
} from './EventEmitter'

class Store {
  constructor() {
    this._eventEmitter = new EventEmitter()
  }

  subscribe(event, callback) {
    this._eventEmitter.subscribe(event, callback)
  }
}

export {
  Store
}
