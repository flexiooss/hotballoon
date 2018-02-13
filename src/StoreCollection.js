import {
  cloneDeep,
  merge
} from 'lodash'
import {
  StoreStateCollection
} from './StoreStateCollection'
import {
  assert,
  filterObject,
  Sequence
} from 'flexio-jshelpers'
import {
  StoreBase
} from './bases/StoreBase'

class StoreCollection extends StoreBase {
  constructor(id) {
    super(id)

    this._keyId = '__ID__'
    this._addIdToItemCollection = false
    this._collectionLastID = new Sequence()

    var storeStateCollection = StoreStateCollection.create()
    Object.defineProperty(this, '_state', {
      enumerable: false,
      configurable: false,
      get: () => storeStateCollection,
      set: (newStoreStateCollection) => {
        assert(newStoreStateCollection instanceof StoreStateCollection,
          'hotballoon:Store:update: _state property assert be an instance of hotballoon/StoreStateCollection ')
        storeStateCollection = newStoreStateCollection
        this._updated()
      }
    })
    this._dispatch('INIT')
  }

  _getNewId() {
    let id = this._collectionLastID.getNewId()
    if (id in this.state().collection) {
      return this._getNewId()
    }
    return id
  }

  /**
     *
     * @param {array} items array of items to add to StoreCollection
     */
  add(items) {
    assert(
      Array.isArray(items),
      'hotballoon:StoreCollection:add: `items` argument assert be an instance of Array'
    )
    let currentState = cloneDeep(this.state())
    let collection = currentState.collection
    let length = currentState.length
    let added = []
    let countOfItems = items.length
    for (let i = 0; i < countOfItems; i++) {
      var id
      if (!(this._keyId in items[i])) {
        id = this._getNewId()
        if (this._assertAddIdToItemCollection()) {
          items[i][this._keyId] = id
        }
      } else {
        id = items[i][this._keyId]
      }
      let item = this._inModel(items[i])

      collection[id] = item
      added.push(id)
      length++
    }
    this._state = this._state.update(collection, length, added, [])
    // this._dispatch('ITEM_ADDED', this.state())
  }

  /**
     *Delete items from collection by item id
     * @param {array} items array of items to remove to StoreCollection
     */
  delete(items) {
    assert(
      Array.isArray(items),
      'hotballoon:StoreCollection:delete: `items` argument assert be an instance of Array'
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
    // this._dispatch('ITEM_REMOVED', this.state())
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

  _assertAddIdToItemCollection() {
    return !!this._addIdToItemCollection
  }
  _inModel(object) {
    if (this.hasModel) {
      filterObject(object, (value, key, scope) => {
        return (key === this._keyId) || this._model.get().has(key)
      })
    }
    return object
  }
}

export {
  StoreCollection
}
