import {
  MapExtended,
  MapOfInstance,
  Sequence,
  assert
} from 'flexio-jshelpers'

import {
  Component
} from './Component'

class HotBalloonApplication {
  constructor() {
    this._dispatcher = null
    this._components = new MapOfInstance(Component)
    this._services = new MapExtended()
    this._sequenceComponentId = new Sequence('component_')
  }

  /**
     *
     * --------------------------------------------------------------
     * Dispatcher
     * --------------------------------------------------------------
     */

  setDispatcher(dispatcher) {
    this._dispatcher = dispatcher
  }
  Dispatcher() {
    return this._dispatcher
  }

  /**
     *
     * --------------------------------------------------------------
     * Component
     * --------------------------------------------------------------
     */

  addComponent(Component, ...args) {
    let componentId = this._sequenceComponentId.getNewId()

    return this._components.add(componentId, new Component(this, componentId, ...args))
  }
  removeComponent(componentID) {
    if (this._components.has(componentID)) {
      this.Component(componentID).willRemove()
      this._components.delete(componentID)
    }
  }
  Component(key) {
    return this._components.get(key)
  }

  /**
     *
     * --------------------------------------------------------------
     * Services
     * --------------------------------------------------------------
     */
  addService(serviceName, service) {
    assert(!this._services.has(serviceName),
      'hotballoon:HotBalloonApplication:addService: `serviceName` : `%s` is already set',
      serviceName
    )
    return this._services.add(serviceName, service)
  }
  removeService(serviceName) {
    if (this._services.has(serviceName)) {
      let service = this.Service(serviceName)
      if ('willRemove' in service) {
        service.willRemove()
      }
      this._services.delete(serviceName)
    }
  }
  Service(key) {
    return this._services.get(key)
  }
  // render(parentNode) {
  //   let t = this._appViewContainer.render(parentNode)
  //   return t
  // }
}

export {
  HotBalloonApplication
}
