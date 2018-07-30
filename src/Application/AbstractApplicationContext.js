'use strict'
import {hasParentPrototypeName, assert} from 'flexio-jshelpers'
import {WithIDBase} from '../bases/WithIDBase'
import {CLASS_TAG_NAME_HOTBALLOON_APPLICATION} from './HotBalloonApplication'
/**
 *
 * @class
 * @abstract
 */
export class AbstractApplicationContext extends WithIDBase {
  constructor(hotBalloonApplication, id) {
    super(id)
    this.__setAPP(hotBalloonApplication)
  }

  /**
   * @private
   * @param {HotBalloonApplication} hotBallonApplication
   */
  __setAPP(hotBallonApplication) {
    assert(!this._APP,
      'hotballoon:ApplicationContextMixin:__setAPP APP already defined'
    )

    assert(hotBallonApplication.testTagClassName(CLASS_TAG_NAME_HOTBALLOON_APPLICATION),
      'hotballoon:ApplicationContextMixin:__setAPP require an argument instance of ̀ hotballoon/HotBalloonApplication`, `%s` given',
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
   * @return {Dispatcher}
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
