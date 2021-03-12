import {Dispatcher} from '../Dispatcher/Dispatcher'
import {
  assertInstanceOf
} from '@flexio-oss/js-commons-bundle/assert'
import {Sequence} from '@flexio-oss/js-commons-bundle/js-helpers'
import {ComponentContextMap} from '../Component/ComponentContextMap'
import {ComponentContext} from '../Component/ComponentContext'
import {WithID} from '../abstract/WithID'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_HOTBALLOON_APPLICATION} from '../Types/HasTagClassNameInterface'
import {LoggerInterface} from '@flexio-oss/js-commons-bundle/js-logger'
import {ViewRenderConfig} from './ViewRenderConfig'
import {ComponentContextBuilder} from './ComponentContextBuilder'
import {ComponentsContextHandler} from '../Component/ComponentsContextHandler'

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
   * @type {ComponentsContextHandler}
   */
  #components
  /**
   * @type {Sequence}
   */
  #sequenceForId = new Sequence('hb_')
  /**
   * @type {Dispatcher}
   */
  #dispatcher
  /**
   * @type {LoggerInterface}
   */
  #logger
  /**
   * @type {ViewRenderConfig}
   */
  #viewRenderConfig

  /**
   * @constructor
   * @param {string} id
   * @param {Dispatcher} dispatcher
   * @param {LoggerInterface} logger
   * @param {ViewRenderConfig} viewRenderConfig
   * @param {ComponentsContextHandler} componentsContextHandler
   */
  constructor(id, dispatcher, logger, viewRenderConfig, componentsContextHandler) {
    super(id)

    this.#dispatcher = assertInstanceOf(dispatcher, Dispatcher, 'Dispatcher')
    this.#logger = assertInstanceOf(logger, LoggerInterface, 'LoggerInterface')
    this.#viewRenderConfig = assertInstanceOf(viewRenderConfig, ViewRenderConfig, 'ViewRenderConfig')
    this.#components = assertInstanceOf(componentsContextHandler, ComponentsContextHandler, 'ComponentsContextHandler')

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_HOTBALLOON_APPLICATION
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
    return this.#sequenceForId.nextID()
  }

  /**
   * @returns {Dispatcher}
   */
  dispatcher() {
    return this.#dispatcher
  }

  /**
   * @return {ComponentContext} componentContext
   */
  addComponentContext() {
    return this.#components.attach(new ComponentContextBuilder()
      .application(this)
      .build()
    )
  }

  /**
   * @return {ComponentsContextHandler}
   */
  components() {
    return this.#components
  }

  /**
   * @return {LoggerInterface}
   */
  logger() {
    return this.#logger
  }

  /**
   * @return {ViewRenderConfig}
   */
  viewRenderConfig() {
    return this.#viewRenderConfig
  }

  remove() {
    this.logger().log(
      this.logger().builder()
        .debug()
        .pushLog('HotballoonApplication:remove: ' + this.ID())
        .pushLog(this),
      applicationLogOptions
    )

    this.#components.remove()
  }
}
