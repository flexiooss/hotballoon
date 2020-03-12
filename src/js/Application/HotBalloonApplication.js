import {Dispatcher} from '../Dispatcher/Dispatcher'
import {assert, assertType, TypeCheck as PrimitiveTypeCheck, isNull} from '@flexio-oss/assert'
import {Sequence} from '@flexio-oss/js-helpers'
import {ComponentContextMap} from '../Component/ComponentContextMap'
import {ComponentContext} from '../Component/ComponentContext'
import {WithID} from '../abstract/WithID'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_HOTBALLOON_APPLICATION} from '../Types/HasTagClassNameInterface'
import {LoggerInterface} from '@flexio-oss/js-logger'
import {TypeCheck} from '../Types/TypeCheck'


const _Dispatcher = Symbol('_Dispatcher')
const _ComponentContexts = Symbol('_ComponentContexts')
const _Services = Symbol('_Services')
const _SequenceId = Symbol('_SequenceId')
const _Logger = Symbol('_Logger')
const _document = Symbol('_document')

const applicationLogOptions = {
  color: 'magenta',
  titleSize: 2
}


/**
 *
 * @class
 * @description HotBalloonApplication is the container for a loop hotballoon
 * @extends WithID
 * @implements HasTagClassNameInterface
 */
export class HotBalloonApplication extends WithID {
  /**
   * @constructor
   * @param {string} id
   * @param {Dispatcher} dispatcher
   * @param {LoggerInterface} logger
   * @param {Document} document
   */
  constructor(id, dispatcher, logger, document) {
    super(id)

    assertType(dispatcher instanceof Dispatcher,
      'hotballoon:HotBalloonApplication:constructor: `dispatcher` argument should be an instance of hotballoon/dispatcher'
    )
    assertType(logger instanceof LoggerInterface,
      'hotballoon:HotBalloonApplication:constructor: `logger` argument should be an instance of LoggerInterface'
    )

    const _componentContexts = new ComponentContextMap()
    /**
     *
     * @type {Map<string, HotballoonService>}
     * @private
     */
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
      },
      [_document]: {
        configurable: false,
        enumerable: false,
        get: () => {
          return document
        },
        set: (v) => {
          assert(false,
            'hotballoon:HotBalloonApplication:constructor:_document.set: `_document` already set'
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
    this[_ComponentContexts].set(componentContext.ID(), componentContext)
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
   * @param {HotballoonService} service
   * @returns {HotballoonService} service
   */
  addService(service) {
    assertType(
      TypeCheck.isService(service),
      '`service` should be a Service'
    )
    assert(!this[_Services].has(service.name()),
      'hotballoon:HotBalloonApplication:addService: `serviceName` : `%s` is already set',
      service.name()
    )
    PrimitiveTypeCheck.assertIsString(service.name())

    this[_Services].set(service.name(), service)
    return service
  }

  /**
   *
   * @param {String} serviceName
   * @return {HotBalloonApplication}
   */
  removeService(serviceName) {
    let service = this.service(serviceName)
    if (!isNull(service)) {
      service.remove()
      this[_Services].delete(serviceName)
    }
    return this
  }

  /**
   *
   * @param {String} serviceName
   * @return {?HotballoonService}
   */
  service(serviceName) {
    if (this[_Services].has(serviceName)) {
      return this[_Services].get(serviceName)
    }
    return null
  }

  /**
   *
   * @return {LoggerInterface}
   */
  logger() {
    return this[_Logger]
  }

  /**
   *
   * @return {Document}
   */
  document() {
    return this[_document]
  }
}
