import {
  hasParentPrototypeName,
  assert
} from 'flexio-jshelpers'

export const ApplicationContextMixin = (Base) => class extends Base {
  ApplicationContextMixinInit(hotBallonApplication) {
    this._setAPP(hotBallonApplication)
  }
  _setAPP(hotBallonApplication) {
    assert(!this._APP,
      'hotballoon:ApplicationContextMixin:_setAPP APP already defined'
    )

    assert(hasParentPrototypeName(hotBallonApplication, 'HotBalloonApplication'),
      'hotballoon:ApplicationContextMixin:_setAPP require an argument instance of ̀ hotballoon/HotBalloonApplication`, `%s` given',
      typeof hotBallonApplication
    )

    this._APP = hotBallonApplication
  }
  APP() {
    return this._APP
  }
  Dispatcher() {
    return this.APP().Dispatcher()
  }
  Service(key) {
    return this.APP().Service(key)
  }
}
