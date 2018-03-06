'use strict'
import {
  Dispatcher
} from './Dispatcher'
import {
  MapExtended,
  MapOfInstance,
  Sequence,
  assert
}
  from 'flexio-jshelpers'

import {
  Component
} from './Component'

class HotBalloonApplication {
  constructor(dispatcher) {
    assert(dispatcher instanceof Dispatcher,
      'hotballoon:HotBalloonApplication:constructor: `dispatcher` argument should be an instance of hotballoon/Dispatcher'
    )

    const _dispatcher = dispatcher
    Object.defineProperty(this, '_dispatcher', {
      configurable: false,
      enumerable: false,
      get: () => {
        return _dispatcher
      },
      set: (v) => {
        assert(false,
          'hotballoon:HotBalloonApplication:constructor:_dispatcher.set: `dispatcher` already set'
        )
      }

    })

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

  /**
     * @returns {Dispatcher}
     */
  Dispatcher() {
    return this._dispatcher
  }

  /**
     *
     * --------------------------------------------------------------
     * Component
     * --------------------------------------------------------------
     */

  /**
     *@param {Component}
     * @returns {String} token : componentID
     */
  addComponent(Component, ...args) {
    const componentId = this._sequenceComponentId.getNewId()
    this._components.add(componentId, new Component(this, componentId, ...args))
    return componentId
  }

  /**
     *
     * @param {String} componentID
     * @returns {boolean} removed ?
     */
  removeComponent(componentID) {
    if (this._components.has(componentID)) {
      const removable = this.Component(componentID).willRemove()
      if (removable !== false) {
        this._components.delete(componentID)
        return true
      }
      return false
    }
  }

  /**
     *
     * @param {String} componentID
     * @returns {Component}
     */
  Component(componentID) {
    return this._components.get(componentID)
  }

  /**
     *
     * --------------------------------------------------------------
     * Services
     * --------------------------------------------------------------
     */

  /**
     *
     * @param {String} serviceName
     * @param {Service} service
     * @returns {Service} service
     */
  addService(serviceName, service) {
    assert(!this._services.has(serviceName),
      'hotballoon:HotBalloonApplication:addService: `serviceName` : `%s` is already set',
      serviceName
    )
    return this._services.add(serviceName, service)
  }

  /**
     *
     * @param {String} serviceName
     */
  removeService(serviceName) {
    if (this._services.has(serviceName)) {
      let service = this.Service(serviceName)
      if ('willRemove' in service) {
        service.willRemove()
      }
      this._services.delete(serviceName)
    }
  }

  /**
     *
     * @param {String} serviceName
     * @returns {Service}
     */
  Service(serviceName) {
    return this._services.get(serviceName)
  }
}

export {
  HotBalloonApplication
}
