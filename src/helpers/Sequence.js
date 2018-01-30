class Sequence {
  constructor(prefix) {
    this._prefix = prefix || ''
    this._lastID = 0
  }
  getNewId() {
    return this._prefix + this._lastID++
  }
}
export {
  Sequence
}
