export class State {
  constructor(storeId, data) {
    Object.defineProperties(this, {
      storeID: {
        configurable: false,
        writable: false,
        enumerable: true,
        value: storeId
      },
      data: {
        configurable: false,
        writable: false,
        enumerable: true,
        value: data
      }
    })
    Object.freeze(Object.seal(this))
  }

  static createEmpty() {
    return new State('', {})
  }
}
