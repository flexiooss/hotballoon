import {
  HotBalloonApplicationContext
} from './HotBalloonApplicationContext'

class Component extends HotBalloonApplicationContext {
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
