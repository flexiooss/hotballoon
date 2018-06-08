'use strict'
import {
  hasParentPrototypeName,
  assert
} from 'flexio-jshelpers'

/**
 *
 * @class
 * @description Mixin - handle the ViewContainer dependancy
 */
export const ViewContainerContextMixin = (Base) => class extends Base {
  /**
     * @description Mixin - init
     * @param {ViewContainer} viewContainer
     * @memberOf ViewContainerContextMixin
     * @instance
     */
  ViewContainerContextMixinInit(viewContainer) {
    this._setViewContainer(viewContainer)
  }
  /**
     * @private
     * @param {ViewContainer} viewContainer
     * @memberOf ViewContainerContextMixin
     * @instance
     */
  _setViewContainer(viewContainer) {
    assert(hasParentPrototypeName(viewContainer, 'ViewContainer'),
      'hotballoon:ViewContainerContextMixin:_setViewContainer require an argument instance of ̀ hotballoon/ViewContainer`'
    )

    Object.defineProperty(this, '_viewContainer', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: viewContainer
    })
  }

  /**
     * @returns {ViewContainer}
     * @memberOf ViewContainerContextMixin
     * @instance
     */
  ViewContainer() {
    return this._viewContainer
  }

  /**
     * @returns {Component}
     * @memberOf ViewContainerContextMixin
     * @instance
     */
  Component() {
    return this.ViewContainer().Component()
  }

  /**
     * @param {String} key : token
     * @returns {Action}
     * @memberOf ViewContainerContextMixin
     * @instance
     */
  Action(key) {
    return this.Component().Action(key)
  }

  /**
     * @param {String} key : token
     * @returns {Store}
     * @memberOf ViewContainerContextMixin
     * @instance
     */
  Store(key) {
    return this.Component().Store(key)
  }

  /**
  *
  * @param {string} key token registered into storeKeysRegister
  * @returns {hotballoon/Store} Store
  */
  StoreByRegister(key) {
    return this.Component().StoreByRegister(key)
  }

  /**
     * @returns {HotBalloonApplication}
     * @memberOf ViewContainerContextMixin
     * @instance
     */
  APP() {
    return this.Component().APP()
  }

  /**
     * @returns {Service}
     * @memberOf ViewContainerContextMixin
     * @instance
     */
  Service(key) {
    return this.APP().Service(key)
  }
}
