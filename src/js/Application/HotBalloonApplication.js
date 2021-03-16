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
import {HotballoonApplicationConfig} from './HotballoonApplicationConfig'

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
   * @type {HotballoonApplicationConfig}
   */
  #config
  /**
   * @type {Sequence}
   */
  #sequenceForId = new Sequence('hb_')

  /**
   * @param {HotballoonApplicationConfig} config
   */
  constructor(config) {
    super(config.id())
    this.#config = assertInstanceOf(config, HotballoonApplicationConfig, 'HotballoonApplicationConfig')

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_HOTBALLOON_APPLICATION
    })

    this.logger().log(
      this.logger().builder().debug()
        .pushLog('HotballoonApplication:init: ' + config.id())
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
    return this.#config.dispatcher()
  }

  /**
   * @return {ComponentContext} componentContext
   */
  addComponentContext() {
    return this.#config.components().attach(new ComponentContextBuilder()
      .application(this)
      .build()
    )
  }

  /**
   * @return {ComponentsContextHandler}
   */
  components() {
    return this.#config.components()
  }

  /**
   * @return {LoggerInterface}
   */
  logger() {
    return this.#config.logger()
  }

  /**
   * @return {ViewRenderConfig}
   */
  viewRenderConfig() {
    return this.#config.viewRenderConfig()
  }

  /**
   * @return {ExecutionConfig}
   */
  executionConfig() {
    return this.#config.executionConfig()
  }

  remove() {
    this.logger().log(
      this.logger().builder()
        .debug()
        .pushLog('HotballoonApplication:remove: ' + this.ID())
        .pushLog(this),
      applicationLogOptions
    )

    this.#config.components().remove()
  }
}
