import {
  assertInstanceOf, isNull
} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {Sequence} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'
import {WithID} from '../abstract/WithID.js'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_HOTBALLOON_APPLICATION} from '../Types/HasTagClassNameInterface.js'
import {ComponentContextBuilder} from './ComponentContextBuilder.js'
import {HotballoonApplicationConfig} from './HotballoonApplicationConfig.js'
import {Logger} from "@flexio-oss/js-commons-bundle/hot-log/index.js";
import {LongTaskChopper} from "./LongTaskChopper.js";

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
   * @type {LongTaskChopper}
   */
  #longTaskChopper

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
    this.#longTaskChopper = new LongTaskChopper(this.#config)
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
   * @return {LongTaskChopper}
   */
  longTaskChopper() {
    return this.#longTaskChopper
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
