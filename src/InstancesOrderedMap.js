import {
  InstancesMap
} from './InstancesMap'
// import {
//   isObject
// } from './helpers'
// import {
//   shouldIs
// } from './shouldIs'
import {
  without
} from 'lodash'

class InstancesOrderedMap extends InstancesMap {
  constructor(classType) {
    super()
    this._order = []
  }
  _getOrderedCollection() {
    let ret = {}
    let countOfOrder = this._order.length
    for (let i = 0; i < countOfOrder; i++) {
      ret[this._order[i]] = this._collection[this._order[i]]
    }
    return ret
  }
  get(key) {
    return (key) ? this._collection[key] : this._getOrderedCollection()
  }
  set(collection) {
    this._collection = collection
    this._order = Object.keys(collection)
  }
  add(item, key) {
    super.add(item, key)
    this._order.push(key)
  }
  addBefore(item, key, keyBefore) {
    super.add(item, key)
    let i = this._order.indexOf(keyBefore)
    if (i !== -1) {
      this._order.splice(i - 1, 0, key)
    }
  }
  addAfter(item, key, keyAfter) {
    super.add(item, key)
    let i = this._order.indexOf(keyAfter)
    if (i !== -1) {
      this._order.splice(i + 1, 0, key)
    }
  }
  delete(key) {
    super.delete(key)
    this._order = without(this._order, key)
  }
}
export {
  InstancesOrderedMap
}
