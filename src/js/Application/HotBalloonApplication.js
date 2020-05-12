import {Dispatcher} from '../Dispatcher/Dispatcher'
import {assert, assertType, TypeCheck as PrimitiveTypeCheck, isNull} from '@flexio-oss/js-commons-bundle/assert'
import {Sequence} from '@flexio-oss/js-commons-bundle/js-helpers'
import {ComponentContextMap} from '../Component/ComponentContextMap'
import {ComponentContext} from '../Component/ComponentContext'
import {WithID} from '../abstract/WithID'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_HOTBALLOON_APPLICATION} from '../Types/HasTagClassNameInterface'
import {LoggerInterface} from '@flexio-oss/js-commons-bundle/js-logger'
import {TypeCheck} from '../Types/TypeCheck'
import {ViewRenderConfig} from './ViewRenderConfig'


const _Dispatcher = Symbol('_Dispatcher')
const _ComponentContexts = Symbol('_ComponentContexts')
const _Services = Symbol('_Services')
const _SequenceId = Symbol('_SequenceId')
const _Logger = Symbol('_Logger')
const _document = Symbol('_document')
const _viewRenderConfig = Symbol('_viewRenderConfig')

const applicationLogOptions = {
  color: 'magenta',
  titleSize: 2
}


/**
 * @extends WithID
 * @implements HasTagClassNameInterface
 */
export class HotBalloonApplication extends WithID {
  /**
   * @constructor
   * @param {string} id
   * @param {Dispatcher} dispatcher
   * @param {LoggerInterface} logger
   * @param {ViewRenderConfig} viewRenderConfig
   */
  constructor(id, dispatcher, logger,  viewRenderConfig) {
    super(id)

    assertType(dispatcher instanceof Dispatcher,
      '`dispatcher` should be  hotballoon/dispatcher'
    )
    assertType(logger instanceof LoggerInterface,
      '`logger` should be LoggerInterface'
    )
    assertType(viewRenderConfig instanceof ViewRenderConfig,
      '`viewRenderConfig` should be ViewRenderConfig'
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
        get: () => dispatcher,
        set: (v) => {
          assert(false,
            '`dispatcher` already set'
          )
        }
      },
      [_ComponentContexts]: {
        configurable: false,
        enumerable: false,
        get: () => _componentContexts
        ,
        set: (v) => {
          assert(false,
            '`_ComponentContexts` already set'
          )
        }
      },
      [_Services]: {
        configurable: false,
        enumerable: false,
        get: () => _services,
        set: (v) => {
          assert(false,
            '`services` already set'
          )
        }
      },
      [_SequenceId]: {
        configurable: false,
        enumerable: false,
        get: () => _sequenceId,
        set: (v) => {
          assert(false,
            '`_sequenceId` already set'
          )
        }
      },
      [_Logger]: {
        configurable: false,
        enumerable: false,
        get: () => logger,
        set: (v) => {
          assert(false,
            '`_Logger` already set'
          )
        }
      },
      [_viewRenderConfig]: {
        configurable: false,
        enumerable: false,
        get: () => viewRenderConfig,
        set: (v) => {
          assert(false,
            '`_viewRenderConfig` already set'
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
   * @param {String} componentID
   * @returns {ComponentContext}
   */
  componentContext(componentID) {
    return this[_ComponentContexts].get(componentID)
  }

  /**
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
   * @return {LoggerInterface}
   */
  logger() {
    return this[_Logger]
  }

  /**
   * @return {ViewRenderConfig}
   */
  viewRenderConfig(){
    return this[_viewRenderConfig]
  }
}
