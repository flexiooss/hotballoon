class Component {
  constructor(dispatcher) {
    this._dispatcher = dispatcher
    this._dispatchToken = dispatcher.register((payload) => {
      this._invokeOnDispatch(payload)
    })
  }

  _invokeOnDispatch(payload) {
    console.log(payload)
  }
}
export { Component }
