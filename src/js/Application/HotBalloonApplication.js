import {Dispatcher} from '../Dispatcher/Dispatcher'
import {
  assertInstanceOf, isNull
} from '@flexio-oss/js-commons-bundle/assert'
import {Sequence} from '@flexio-oss/js-commons-bundle/js-helpers'
import {ComponentContext} from '../Component/ComponentContext'
import {WithID} from '../abstract/WithID'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_HOTBALLOON_APPLICATION} from '../Types/HasTagClassNameInterface'
import {ViewRenderConfig} from './ViewRenderConfig'
import {ComponentContextBuilder} from './ComponentContextBuilder'
import {ComponentsContextHandler} from '../Component/ComponentsContextHandler'
import {HotballoonApplicationConfig} from './HotballoonApplicationConfig'
import {Logger} from "@flexio-oss/js-commons-bundle/hot-log";

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
   * @type {Logger}
   */
  #logger = Logger.getLogger(this.constructor.name, 'HotBalloon.HotBalloonApplication')

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
    this.#logger.info('HotBalloonApplication:init: ' + config.id(), this)
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
   * @return {SchedulerHandler}
   */
  scheduler() {
    return this.#config.schedulerHandler()
  }

  /**
   * @return {ComponentContext} componentContext
   * @param {?string} [name=null]
   */
  addComponentContext(name = null) {
    return this.#config.components().attach(
      new ComponentContextBuilder()
        .application(this)
        .name(name)
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
    this.#logger.info('HotballoonApplication:remove: ' + this.ID())
    this.#config.components().remove()
  }
}
