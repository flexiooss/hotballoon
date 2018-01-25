import {
  isObject,
  staticClassName
} from './helpers'
import {
  cloneDeep,
  merge
} from 'lodash'
import {
  StoreStateCollection
} from './StoreStateCollection'
import {
  shouldIs
} from './shouldIs'
import {
  StoreBase
} from './StoreBase'

class StoreCollection extends StoreBase {
  constructor() {
    super()

    this._keyId = 'id'
    this._addIdToItemCollection = false

    var storeStateCollection = StoreStateCollection.create()
    Object.defineProperty(this, '_state', {
      enumerable: false,
      configurable: false,
      get: () => storeStateCollection,
      set: (newStoreStateCollection) => {
        shouldIs(newStoreStateCollection instanceof StoreStateCollection,
          'hotballoon:Store:update: _state property should be an instance of hotballoon/StoreStateCollection ')
        storeStateCollection = newStoreStateCollection
        this._updated()
      }
    })
    this._dispatch('INIT')
  }

  static eventTypes() {
    const name = staticClassName(this).toUpperCase()
    return {
      INIT: name + '_INIT',
      CHANGED: name + '_CHANGED',
      ITEM_ADDED: name + '_ITEM_ADDED',
      ITEM_REMOVED: name + '_ITEM_REMOVED'
    }
  }

  _getNewId() {
    this._lastID = ('_lastID' in this) ? this._lastID + 1 : 0
    return this._lastID
  }

  /**
     *
     * @param {array} items array of items to add to StoreCollection
     */
  add(items) {
    shouldIs(
      Array.isArray(items),
      'hotballoon:StoreCollection:add: `items` argument should be an instance of Array'
    )
    let currentState = cloneDeep(this.state())
    let collection = currentState.collection
    let length = currentState.length
    let added = []
    let countOfItems = items.length
    for (let i = 0; i < countOfItems; i++) {
      let id = this._getNewId()
      if (this._shouldAddIdToItemCollection()) {
        items[i][this._keyId] = id
      }
      let item = this._inModel(items[i])

      collection[id] = item
      added.push(id)
      length++
    }
    this._state = this._state.update(collection, length, added, [])
    this._dispatch('ITEM_ADDED', this.state())
  }

  /**
     *Delete items from collection by item id
     * @param {array} items array of items to remove to StoreCollection
     */
  delete(items) {
    shouldIs(
      Array.isArray(items),
      'hotballoon:StoreCollection:delete: `items` argument should be an instance of Array'
    )
    let currentState = cloneDeep(this.state())
    let removed = []
    let countOfItems = items.length
    for (let i = 0; i < countOfItems; i++) {
      delete currentState.collection[items[i]]
      removed.push(items[i])
      currentState.length--
    }
    this._state = this._state.update(currentState.collection, currentState.length, [], removed)
    this._dispatch('ITEM_REMOVED', this.state())
  }

  update(state) {
    console.log('update')
    this._state = this._state.update(merge(this._state.get(), this._fillState(state)))
  }

  save(state) {
    this._state = this._state.update(this._fillState(state))
  }

  _updated() {
    this._dispatch('CHANGED', this.state())
  }

  _fillState(state) {
    for (let item in state) {
      this._inModel(state[item])
    }
    return state
  }

  _shouldAddIdToItemCollection() {
    return !!this._addIdToItemCollection
  }
}

export {
  StoreCollection
}
