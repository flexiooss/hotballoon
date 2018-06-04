export class State {
  constructor(storeId, state) {
    Object.defineProperties(this, {
      storeID: {
        configurable: false,
        writable: false,
        enumerable: true,
        value: storeId
      },
      state: {
        configurable: false,
        writable: false,
        enumerable: true,
        value: state
      }
    })
    Object.freeze(Object.seal(this))
  }

  static createEmpty() {
    return new State('', {})
  }
}
