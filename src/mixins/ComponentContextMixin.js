import {
  hasParentPrototypeName,
  assert
} from 'flexio-jshelpers'
export const ComponentContextMixin = (Base) => class extends Base {
  ComponentContextMixinInit(component) {
    this._setComponent(component)
  }
  _setComponent(component) {
    assert(!this._component,
      'hotballoon:ComponentContextMixin:_setComponent `_component` property already defined'
    )
    assert(hasParentPrototypeName(component, 'Component'),
      'hotballoon:ComponentContextMixin:_setComponent require an argument instance of ̀ hotballoon/Component`'
    )

    this._component = component
  }
  Component() {
    return this._component
  }
  APP() {
    return this.Component().APP()
  }
  Dispatcher() {
    return this.APP().Dispatcher()
  }
  Service(key) {
    return this.APP().Service(key)
  }
  Action(action) {
    return this.Component().Action(action)
  }
  Store(action) {
    return this.Component().Store(action)
  }
}
