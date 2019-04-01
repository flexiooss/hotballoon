'use strict'
import {Dispatcher} from '../Dispatcher/Dispatcher'
import {MapExtended, MapOfInstance, Sequence, assert} from 'flexio-jshelpers'
import {ComponentContext} from '../Component/ComponentContext'
import {WithIDBase} from '../bases/WithIDBase'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_HOTBALLOON_APPLICATION} from '../HasTagClassNameInterface'

const _Dispatcher = Symbol('_Dispatcher')
const _ComponentContexts = Symbol('_ComponentContexts')
const _Services = Symbol('_Services')
const _SequenceId = Symbol('_SequenceId')

/**
 *
 * @class
 * @description HotBalloonApplication is the container for a loop hotballoon
 * @extends WithIDBase
 * @implements HasTagClassNameInterface
 */
export class HotBalloonApplication extends WithIDBase {
  /**
   * @constructor
   * @param {string} id
   * @param {Dispatcher} dispatcher
   */
  constructor(id, dispatcher) {
    super(id)

    assert(dispatcher instanceof Dispatcher,
      'hotballoon:HotBalloonApplication:constructor: `dispatcher` argument should be an instance of hotballoon/dispatcher'
    )

    const _componentContexts = new MapOfInstance(ComponentContext)
    const _services = new MapExtended()
    const _sequenceId = new Sequence('hb_')

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_HOTBALLOON_APPLICATION
    })

    Object.defineProperties(this, {
      [_Dispatcher]: {
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
      [_ComponentContexts]: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _componentContexts
        },
        set: (v) => {
          assert(false,
            'hotballoon:HotBalloonApplication:constructor:_ComponentContexts.set: `components` already set'
          )
        }
      },
      [_Services]: {
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
      [_SequenceId]: {
        configurable: false,
        enumerable: false,
        get: () => {
          return _sequenceId
        },
        set: (v) => {
          assert(false,
            'hotballoon:HotBalloonApplication:constructor:_sequenceId.set: `_sequenceId` already set'
          )
        }
      }
    })
  }

  /**
   * @returns {String} token :next sequence token
   */
  nextID() {
    return this[_SequenceId].nextID()
  }

  /**
   * @returns {Dispatcher}
   */
  dispatcher() {
    return this[_Dispatcher]
  }

  /**
   * @return {ComponentContext} componentContext
   */
  addComponentContext() {
    const componentContext = new ComponentContext(this)
    this[_ComponentContexts].add(componentContext.ID, componentContext)
    return componentContext
  }

  /**
   *
   * @param {String} componentID
   * @returns {boolean} removed ?
   */
  removeComponentContext(componentID) {
    if (this[_ComponentContexts].has(componentID)) {
      const removable = this.componentContext(componentID).willRemove()
      if (removable !== false) {
        this[_ComponentContexts].delete(componentID)
        return true
      }
      return false
    }
  }

  /**
   *
   * @param {String} componentID
   * @returns {ComponentContext}
   */
  componentContext(componentID) {
    return this[_ComponentContexts].get(componentID)
  }

  /**
   *
   * @param {String} serviceName
   * @param {service} service
   * @returns {service} service
   */
  addService(serviceName, service) {
    assert(!this[_Services].has(serviceName),
      'hotballoon:HotBalloonApplication:addService: `serviceName` : `%s` is already set',
      serviceName
    )
    return this[_Services].add(serviceName, service)
  }

  /**
   *
   * @param {String} serviceName
   */
  removeService(serviceName) {
    if (this[_Services].has(serviceName)) {
      let service = this.service(serviceName)
      if ('willRemove' in service) {
        service.willRemove()
      }
      this[_Services].delete(serviceName)
    }
  }

  /**
   *
   * @param {String} serviceName
   * @returns {service}
   */
  service(serviceName) {
    return this[_Services].get(serviceName)
  }
}
