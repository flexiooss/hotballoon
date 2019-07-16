import {Dispatcher} from '../Dispatcher/Dispatcher'
import {assert, assertType} from '@flexio-oss/assert'
import {Sequence} from '@flexio-oss/js-helpers'
import {ComponentContextMap} from '../Component/ComponentContextMap'
import {ComponentContext} from '../Component/ComponentContext'
import {WithIDBase} from '../bases/WithIDBase'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_HOTBALLOON_APPLICATION} from '../HasTagClassNameInterface'
import {LoggerInterface} from '@flexio-oss/js-logger'

const _Dispatcher = Symbol('_Dispatcher')
const _ComponentContexts = Symbol('_ComponentContexts')
const _Services = Symbol('_Services')
const _SequenceId = Symbol('_SequenceId')
const _Logger = Symbol('_Logger')

const applicationLogOptions = {
  color: 'magenta',
  titleSize: 2
}

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
   * @param {LoggerInterface} logger
   */
  constructor(id, dispatcher, logger) {
    super(id)

    assertType(dispatcher instanceof Dispatcher,
      'hotballoon:HotBalloonApplication:constructor: `dispatcher` argument should be an instance of hotballoon/dispatcher'
    )
    assertType(logger instanceof LoggerInterface,
      'hotballoon:HotBalloonApplication:constructor: `logger` argument should be an instance of LoggerInterface'
    )

    dispatcher.setLogger(logger)

    const _componentContexts = new ComponentContextMap()
    const _services = new Map()
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
      },
      [_Logger]: {
        configurable: false,
        enumerable: false,
        get: () => {
          return logger
        },
        set: (v) => {
          assert(false,
            'hotballoon:HotBalloonApplication:constructor:_Logger.set: `_sequenceId` already set'
          )
        }
      }
    })

    this.logger().log(
      this.logger().builder()
        .debug()
        .pushLog('HotballoonApplication:init: ' + id)
        .pushLog(this),
      applicationLogOptions
    )
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
    this[_ComponentContexts].set(componentContext.ID, componentContext)
    return componentContext
  }

  /**
   *
   * @param {String} componentID
   * @returns {boolean} removed ?
   */
  removeComponentContext(componentID) {
    if (this[_ComponentContexts].has(componentID)) {
      this[_ComponentContexts].delete(componentID)
      return true
    }
    return false
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
    return this[_Services].set(serviceName, service)
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

  /**
   *
   * @return {LoggerInterface}
   */
  logger() {
    return this[_Logger]
  }
}
