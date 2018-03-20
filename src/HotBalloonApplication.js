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

/**
 *
 * @class
 * @description HotBalloonApplication is the container for a loop hotballoon
 */
class HotBalloonApplication {
  /**
     * @constructor
     * @param {Dispatcher} dispatcher
     */
  constructor(dispatcher) {
    assert(dispatcher instanceof Dispatcher,
      'hotballoon:HotBalloonApplication:constructor: `dispatcher` argument should be an instance of hotballoon/Dispatcher'
    )

    const _components = new MapOfInstance(Component)
    const _services = new MapExtended()
    const _sequenceComponentId = new Sequence('component_')

    Object.defineProperties(this, {
      '_dispatcher': {
        configurable: false,
        enumerable: false,
        get: () => {
          return dispatcher
        },
        set: (v) => {
          assert(false,
            'hotballoon:HotBalloonApplication:constructor:_dispatcher.set: `dispatcher` already set'
          )
        }
      },
      '_components': {
        configurable: false,
        enumerable: false,
        get: () => {
          return _components
        },
        set: (v) => {
          assert(false,
            'hotballoon:HotBalloonApplication:constructor:_components.set: `components` already set'
          )
        }
      },
      '_services': {
        configurable: false,
        enumerable: false,
        get: () => {
          return _services
        },
        set: (v) => {
          assert(false,
            'hotballoon:HotBalloonApplication:constructor:_services.set: `services` already set'
          )
        }
      },
      '_sequenceComponentId': {
        configurable: false,
        enumerable: false,
        get: () => {
          return _sequenceComponentId
        },
        set: (v) => {
          assert(false,
            'hotballoon:HotBalloonApplication:constructor:_sequenceComponentId.set: `_sequenceComponentId` already set'
          )
        }
      }
    })
  }

  /**
     * @returns {Dispatcher}
     */
  Dispatcher() {
    return this._dispatcher
  }

  /**
     * @description register a Component into this Application
     * @param {Component}
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
