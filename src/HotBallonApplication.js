import {
  shouldIs
} from './shouldIs'
import {
  InstancesMap
} from './InstancesMap'
import {
  ObjectMap
} from './ObjectMap'
import {
  Dispatcher
} from './Dispatcher'
import {
  Action
} from './Action'
import {
  Component
} from './Component'

import {
  Store
} from './Store'
class HotBallonApplication {
  constructor() {
    this._dispatchers = new InstancesMap(Dispatcher)
    this._actions = new InstancesMap(Action)
    this._components = new InstancesMap(Component)
    this._stores = new InstancesMap(Store)
    this._viewContainers = new ObjectMap()
    this._appViewContainer = null
  }

  setDispatchers(dispatchers) {
    this._dispatchers.set(dispatchers)
  }
  addDispatcher(dispatcher) {
    this._dispatchers.add(dispatcher)
  }
  getDispatchers() {
    return this._dispatchers.get()
  }
  getDispatcher(dispatcherName) {
    return this._dispatchers.get(dispatcherName)
  }
  setActions(actions) {
    this._actions.set(actions)
  }
  addAction(action) {
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
  addViewContainer(viewContainer) {
    this._viewContainers.add(viewContainer)
  }
  getViewContainers() {
    return this._viewContainers.get()
  }
  getViewContainer(viewContainerName) {
    return this._viewContainers.get(viewContainerName)
  }

  /**
     *
     * @param {string} viewContainerName
     * @returns {void}
     */
  initContainer(viewContainerName) {
    shouldIs(
      viewContainerName in this.getViewContainers(),
      'hotballoon:HotBallonApplication:initContainer `%s` is not registered in property viewContainers : array <ViewContainer>',
      viewContainerName
    )
    let ViewContainerClass = this.getViewContainer(viewContainerName)
    this._appViewContainer = new ViewContainerClass()
    this._appViewContainer.init(this.getStores())
  }

  render(parentNode) {
    let t = this._appViewContainer.render(parentNode)
    console.log('t : ' + t)
    return t
  }
}

// const APP = new HotBallonApplication()
// // Object.freeze(APP)
// Object.seal(APP)

export {
  HotBallonApplication
}
