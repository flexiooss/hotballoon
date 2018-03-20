'use strict'
import {
  hasParentPrototypeName,
  assert
} from 'flexio-jshelpers'

/**
 *
 * @class
 * @description Mixin - add handler for hotballon context dependency
 */
export const ApplicationContextMixin = (Base) => class extends Base {
  /**
     * @description Mixin - init
     * @param {HotBalloonApplication} component
     * @memberOf ApplicationContextMixin
     * @instance
     */
  ApplicationContextMixinInit(hotBallonApplication) {
    this._setAPP(hotBallonApplication)
  }

  /**
     * @private
     * @param {HotBalloonApplication} hotBallonApplication
     * @memberOf ApplicationContextMixin
     * @instance
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
     * @memberOf ApplicationContextMixin
     * @instance
     */
  APP() {
    return this._APP
  }

  /**
     * @return {Dispatcher}
     * @memberOf ApplicationContextMixin
     * @instance
     */
  Dispatcher() {
    return this.APP().Dispatcher()
  }

  /**
     * @return {Service}
     * @memberOf ApplicationContextMixin
     * @instance
     */
  Service(key) {
    return this.APP().Service(key)
  }
}
