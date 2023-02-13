import {HotBalloonApplication} from './HotBalloonApplication.js'
import {ViewRenderConfig} from './ViewRenderConfig.js'
import {SyncDomAccessor} from '../View/DomAccessor.js'
import {ComponentsContextHandler} from '../Component/ComponentsContextHandler.js'
import {Dispatcher} from '../Dispatcher/Dispatcher.js'
import {isNull} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {UID} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'
import {HotballoonApplicationConfig} from './HotballoonApplicationConfig.js'
import {ExecutionConfig} from './ExecutionConfig.js'


export class ApplicationBuilder {
  /**
   * @type {DomAccessor}
   */
  #domAccessor = new SyncDomAccessor()
  /**
   * @type {?string}
   */
  #id = UID()
  /**
   * @type {?Dispatcher}
   */
  #dispatcher = null
  /**
   * @type {?Document}
   */
  #document = null
  /**
   * @type {?Navigator}
   */
  #navigator = null
  /**
   * @type {boolean}
   */
  #viewDebug = false
  /**
   * @type {SchedulerHandler}
   */
  #scheduler

  /**
   * @param {string} value
   * @return {ApplicationBuilder}
   */
  id(value) {
    this.#id = value
    return this
  }

  /**
   * @param {Dispatcher} value
   * @return {ApplicationBuilder}
   */
  dispatcher(value) {
    this.#dispatcher = value
    return this
  }

  /**
   * @param {Document} value
   * @return {ApplicationBuilder}
   */
  document(value) {
    this.#document = value
    return this
  }

  /**
   * @param {Navigator} value
   * @return {ApplicationBuilder}
   */
  navigator(value) {
    this.#navigator = value
    return this
  }

  /**
   * @param {boolean} value
   * @return {ApplicationBuilder}
   */
  viewDebug(value) {
    this.#viewDebug = value
    return this
  }

  /**
   * @param {DomAccessor} value
   * @return {ApplicationBuilder}
   */
  domAccessor(value) {
    this.#domAccessor = value
    return this
  }

  /**
   * @param {SchedulerHandler} value
   * @return {ApplicationBuilder}
   */
  scheduler(value){
    this.#scheduler = value
    return this
  }

  /**
   * @return {HotBalloonApplication}
   */
  build() {
    return new HotBalloonApplication(
      new HotballoonApplicationConfig(
        this.#id,
        isNull(this.#dispatcher) ? new Dispatcher() : this.#dispatcher,
        new ViewRenderConfig(this.#document, this.#viewDebug, this.#domAccessor),
        new ComponentsContextHandler(),
        new ExecutionConfig(this.#navigator),
        this.#scheduler
      )
    )
  }
}
