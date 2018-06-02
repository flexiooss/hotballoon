export class State {
  constructor(storeId, state) {
    Object.defineProperties(this, {
      _storeID: {
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
  }

  static createEmpty() {
    return new State('', {})
  }
}
