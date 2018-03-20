'use strict'
import {
  hasParentPrototypeName,
  assert
} from 'flexio-jshelpers'

/**
 *
 * @class
 * @description Mixin - handle a Component dependancy
 */
export const ComponentContextMixin = (Base) => class extends Base {
  /**
     * @description Mixin - init
     * @param {Component} component
     * @memberOf ComponentContextMixin
     * @instance
     */
  ComponentContextMixinInit(component) {
    this._setComponent(component)
  }

  /**
     * @private
     * @param {Component} component
     * @memberOf ComponentContextMixin
     * @instance
     */
  _setComponent(component) {
    assert(!this._component,
      'hotballoon:ComponentContextMixin:_setComponent `_component` property already defined'
    )
    assert(hasParentPrototypeName(component, 'Component'),
      'hotballoon:ComponentContextMixin:_setComponent require an argument instance of ̀ hotballoon/Component`'
    )

    this._component = component
  }

  /**
     * @return {Component} component
     * @memberOf ComponentContextMixin
     * @instance
     */
  Component() {
    return this._component
  }

  /**
     * @return {HotBalloonApplication} hotBallonApplication
     * @memberOf ComponentContextMixin
     * @instance
     */
  APP() {
    return this.Component().APP()
  }

  /**
     * @return {Dispatcher} dispatcher
     * @memberOf ComponentContextMixin
     * @instance
     */
  Dispatcher() {
    return this.APP().Dispatcher()
  }

  /**
     * @param {String} key
     * @return {Service} service
     * @memberOf ComponentContextMixin
     * @instance
     */
  Service(key) {
    return this.APP().Service(key)
  }

  /**
     * @param {String} key
     * @return {Action} action
     * @memberOf ComponentContextMixin
     * @instance
     */
  Action(key) {
    return this.Component().Action(key)
  }

  /**
     * @param {String} key
     * @return {Store} store
     * @memberOf ComponentContextMixin
     * @instance
     */
  Store(key) {
    return this.Component().Store(key)
  }
}
