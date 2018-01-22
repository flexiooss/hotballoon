import {
  ApplicationContext
} from './ApplicationContext'

class Component extends ApplicationContext {
  constructor(hotBallonApplication) {
    super(hotBallonApplication)
    this._dispatchToken = this.APP().getDispatcher().register((payload) => {
      this._invokeOnDispatch(payload)
    })
  }

  _invokeOnDispatch(payload) {
    console.log('_invokeOnDispatch')
    console.log(payload)
  }
}
export {
  Component
}
