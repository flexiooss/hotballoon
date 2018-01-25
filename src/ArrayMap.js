class ArrayMap {
  constructor() {
    this._map = new Map()
  }
  _initItem(key) {
    this._map.set(key, [])
  }

  add(key, token) {
    if (!this._map.has(key)) {
      this._initItem(key)
    }
    this._map.set(key, this._map.get(key).push[token])
  }
  get(key) {
    return this._map.get(key)
  }
}
export {
  ArrayMap
}
