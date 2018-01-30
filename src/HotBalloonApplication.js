import {
  MapOfInstance
} from './mapExtended/MapOfInstance'
import {
  Sequence
} from './helpers/Sequence'

import {
  Component
} from './Component'

class HotBalloonApplication {
  constructor() {
    this._dispatcher = null
    this._components = new MapOfInstance(Component)
    this._sequenceComponentId = new Sequence('component_')
  }

  setDispatcher(dispatcher) {
    this._dispatcher = dispatcher
  }
  Dispatcher() {
    return this._dispatcher
  }
  addComponent(Component, ...args) {
    let componentId = this._sequenceComponentId.getNewId()
    console.log(componentId)

    return this._components.add(componentId, new Component(this, componentId, ...args))
  }
  getComponents() {
    return this._components.get()
  }
  getComponent(component) {
    return this._components.get(component)
  }

  // render(parentNode) {
  //   let t = this._appViewContainer.render(parentNode)
  //   return t
  // }
}

export {
  HotBalloonApplication
}
