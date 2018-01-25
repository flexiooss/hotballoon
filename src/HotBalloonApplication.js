import {
  InstancesMap
} from './InstancesMap'
import {
  ObjectMap
} from './ObjectMap'
import {
  Action
} from './Action'
import {
  Component
} from './Component'
import {
  StoreBase
} from './StoreBase'

class HotBalloonApplication {
  constructor() {
    this._dispatcher = null
    this._actions = new InstancesMap(Action)
    this._components = new InstancesMap(Component)
    this._stores = new InstancesMap(StoreBase)
    this._viewContainers = new ObjectMap()
    this._appViewContainer = null
  }

  setDispatcher(dispatcher) {
    this._dispatcher = dispatcher
  }
  getDispatcher() {
    return this._dispatcher
  }
  setActions(actions) {
    this._actions.set(actions)
  }
  addAction(action, key) {
    this._actions.add(action)
  }
  getActions() {
    return this._actions.get()
  }
  getAction(action) {
    return this._actions.get(action)
  }
  setComponents(components) {
    this._components.set(components)
  }
  addComponent(component) {
    this._components.add(component)
  }
  getComponents() {
    return this._components.get()
  }
  getComponent(component) {
    return this._components.get(component)
  }
  setStores(stores) {
    this._stores.set(stores)
  }
  addStore(store) {
    this._stores.add(store)
  }
  getStores() {
    return this._stores.get()
  }
  getStore(store) {
    return this._stores.get(store)
  }
  setViewContainers(viewContainers) {
    this._viewContainers.set(viewContainers)
  }
  addViewContainer(viewContainer, key) {
    this._viewContainers.add(viewContainer, key)
  }
  getViewContainers() {
    return this._viewContainers.get()
  }
  getViewContainer(viewContainerName) {
    return this._viewContainers.get(viewContainerName)
  }

  setAppViewContainer(viewContainerName) {
    this._appViewContainer = viewContainerName
  }

  render(parentNode) {
    let t = this._appViewContainer.render(parentNode)
    return t
  }
}

export {
  HotBalloonApplication
}
