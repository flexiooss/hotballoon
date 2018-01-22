import {
  shouldIs
} from './shouldIs'
import {
  hasParentPrototypeName
} from './helpers'

class ApplicationContext {
  constructor(hotBallonApplication) {
    this._setAPP(hotBallonApplication)
  }
  _setAPP(hotBallonApplication) {
    shouldIs(!this._APP,
      'hotballoon:ViewContainer:_setAPP APP already defined'
    )
    shouldIs(hasParentPrototypeName(hotBallonApplication, 'HotBalloonApplication'),
      'hotballoon:ViewContainer:_setAPP require an argument instance of ̀ hotballoon/HotBalloonApplication`'
    )

    this._APP = hotBallonApplication
  }
  APP() {
    return this._APP
  }
}
export {
  ApplicationContext
}
