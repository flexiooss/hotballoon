import {
  should
} from '../helpers'
class MapExtended {
  constructor() {
    this._collection = new Map()
  }
  setCollection(collection) {
    should(collection instanceof Map,
      'hotballoon:ExtendMap:set: `collection` argument should be an instance of Map')
    this._collection = collection
  }
  set(key, value) {
    should(key !== undefined,
      'hotballoon:ObjectMap:add: `key` argument should not be undefined')
    this._collection.set(key, this._constraint(value))
  }
  add(key, value, keyValue) {
    should(key !== undefined,
      'hotballoon:ObjectMap:add: `key` argument should not be undefined')
    if (!this._collection.has(key)) {
      this._initValue(key)
    }
    let ret = this._constraint(this._addValue(key, value, keyValue))
    this._collection.set(key, ret)
    return ret
  }
  has(key) {
    return this._collection.has(key)
  }
  keys() {
    return this._collection.keys()
  }
  values() {
    return this._collection.values()
  }
  get(key) {
    return (key) ? this._collection.get(key) : this._collection
  }
  delete(key) {
    this._collection.delete(key)
  }
  forEach(callback) {
    this._collection.forEach(callback)
  }
  _constraint(value) {
    return value
  }
  _initValue(key) {
    this._map.set(key, null)
  }
  _addValue(key, value, keyValue) {
    return value
  }
}
export {
  MapExtended
}
