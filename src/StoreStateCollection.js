import {
  StoreState
} from './StoreState'
import {
  deepFreeze,
  deepFreezeSeal,
  deepKeyResolver
} from 'flexio-jshelpers'

class StoreStateCollection extends StoreState {
  static create(collection, length, added, removed) {
    // console.log('storeStateCollection:create')

    const storeStateCollection = new StoreStateCollection()
    Object.defineProperty(storeStateCollection, 'collection', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: collection || {}
    })
    Object.defineProperty(storeStateCollection, 'length', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: length || 0
    })
    Object.defineProperty(storeStateCollection, 'added', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: added || []
    })
    Object.defineProperty(storeStateCollection, 'removed', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: removed || []
    })
    // console.log(storeStateCollection)
    return deepFreeze(storeStateCollection)
  }

  update(collection, length, added, removed) {
    return StoreStateCollection.create(collection, length, added, removed)
  }
  get(key) {
    return (key) ? deepKeyResolver(this._getState(), key) : this._getState()
  }

  _getState() {
    return deepFreezeSeal({
      collection: this.collection || {},
      length: this.length || 0,
      added: this.added || [],
      removed: this.removed || []
    })
  }
}
export {
  StoreStateCollection
}
