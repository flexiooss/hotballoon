import {
  HotBalloonApplication
} from './HotBalloonApplication'
import {
  shouldIs
} from './shouldIs'

class HotBalloonApplicationContext {
  constructor(hotBallonApplication) {
    this._setAPP(hotBallonApplication)
  }
  _setAPP(hotBallonApplication) {
    shouldIs(!this._APP,
      'hotballoon:ViewContainer:_setAPP APP already defined'
    )
    shouldIs(hotBallonApplication instanceof HotBalloonApplication,
      'hotballoon:ViewContainer:_setAPP require an argument instance of ̀ %s`',
      HotBalloonApplication.constructor.name
    )
    this._APP = hotBallonApplication
  }
  APP() {
    return this._APP
  }
}
export {
  HotBalloonApplicationContext
}
