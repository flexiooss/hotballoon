import {
  hasParentPrototypeName,
  should
} from '../helpers'
export const ViewContainerContextMixin = (Base) => class extends Base {
  ViewContainerContextMixinInit(viewContainer) {
    this._setViewContainer(viewContainer)
  }
  _setViewContainer(viewContainer) {
    should(hasParentPrototypeName(viewContainer, 'ViewContainer'),
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
    return this.ViewContainer().Component().Action(action)
  }
  Store(action) {
    return this.ViewContainer().Component().Store(action)
  }
  APP() {
    return this.ViewContainer().Component().APP()
  }
}
