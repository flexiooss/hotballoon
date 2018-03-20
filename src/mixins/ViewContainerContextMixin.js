'use strict'
import {
  hasParentPrototypeName,
  assert
} from 'flexio-jshelpers'

/**
 * ViewContainerContextMixin
 * @class
 * @param {*} Base
 */
export const ViewContainerContextMixin = (Base) => class extends Base {
  ViewContainerContextMixinInit(viewContainer) {
    this._setViewContainer(viewContainer)
  }
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
  ViewContainer() {
    return this._viewContainer
  }
  Component() {
    return this.ViewContainer().Component()
  }
  Action(action) {
    return this.Component().Action(action)
  }
  Store(action) {
    return this.Component().Store(action)
  }
  APP() {
    return this.Component().APP()
  }
  Service(key) {
    return this.APP().Service(key)
  }
}
