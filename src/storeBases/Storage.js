'use strict'
import {
  deepFreezeSeal,
  cloneWithJsonMethod
} from 'flexio-jshelpers'

const DEFAULT_STORE = {}

export class Storage {
  constructor(state = DEFAULT_STORE) {
    Object.defineProperty(this, '_state', {
      enumerable: false,
      configurable: false,
      get: () => {
        return cloneWithJsonMethod(state)
      },
      set: (v) => false
    })
    deepFreezeSeal(this)
  }

  static create(state) {
    return new Storage(state)
  }

  set(state) {
    return this.constructor.create(state)
  }

  get() {
    return this._state
  }
}
