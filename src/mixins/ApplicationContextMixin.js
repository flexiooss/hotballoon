import {
  hasParentPrototypeName,
  should
} from '../helpers'

export const ApplicationContextMixin = (Base) => class extends Base {
  ApplicationContextMixinInit(hotBallonApplication) {
    this._setAPP(hotBallonApplication)
  }
  _setAPP(hotBallonApplication) {
    should(!this._APP,
      'hotballoon:ApplicationContextMixin:_setAPP APP already defined'
    )
    should(hasParentPrototypeName(hotBallonApplication, 'HotBalloonApplication'),
      'hotballoon:ApplicationContextMixin:_setAPP require an argument instance of ̀ hotballoon/HotBalloonApplication`'
    )

    this._APP = hotBallonApplication
  }
  APP() {
    return this._APP
  }
  Dispatcher() {
    return this.APP().Dispatcher()
  }
}
