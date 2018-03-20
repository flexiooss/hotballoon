'use strict'
import {
  hasParentPrototypeName,
  assert
} from 'flexio-jshelpers'

/**
 * @description Mixin - add handler for hotballon context dependency
 */
export const ApplicationContextMixin = (Base) => class extends Base {
  /**
     * @description init of mixin
     * @param {HotBalloonApplication} hotBallonApplication
     */
  ApplicationContextMixinInit(hotBallonApplication) {
    this._setAPP(hotBallonApplication)
  }

  /**
     * @private
     * @param {HotBalloonApplication} hotBallonApplication
     */
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

  /**
     * @return {HotBalloonApplication}
     */
  APP() {
    return this._APP
  }

  /**
     * @return {hotballoon/Dispatcher}
     */
  Dispatcher() {
    return this.APP().Dispatcher()
  }

  /**
     * @return {Service}
     */
  Service(key) {
    return this.APP().Service(key)
  }
}
