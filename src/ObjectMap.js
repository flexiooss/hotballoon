class ObjectMap {
  constructor() {
    this._collection = {}
  }
  add(key, item) {
    this._collection[key] = item
  }
  get(key) {
    return (key) ? this._collection[key] : this._collection
  }
  set(collection) {
    this._collection = collection
  }
  delete(key) {
    try {
      delete this._collection[key]
    } catch (error) {
      console.log(error)
    }
  }
  foreach(func) {
    for (let k in this._collection) {
      func(k, this._collection[k])
    }
  }
}
export {
  ObjectMap
}
