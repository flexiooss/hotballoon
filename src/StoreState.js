class StoreState {
  static create(state) {
    const storeState = new StoreState()
    Object.defineProperty(storeState, '_state', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: state
    })
    return Object.freeze(storeState)
  }
  update(state) {
    return StoreState.create(state)
  }
  get(key) {
    return (key && (key in this._state)) ? this._state[key] : this._state
  }
}
export {
  StoreState
}
