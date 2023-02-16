import {ApplicationBuilder as ApplicationBuilderBase , SyncDomAccessor} from './index.js'
import {UID} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'
import {BasicSchedulerHandler} from "./src/js/Scheduler/BasicSchedulerHandler.js";


export class ApplicationBuilder {
  /**
   * @type {?string}
   */
  #id = UID()
  /**
   * @type {?Dispatcher}
   */
  #dispatcher = null
  /**
   * @type {Document}
   */
  #document = null
  /**
   * @type {boolean}
   */
  #viewDebug = false

  /**
   * @param {string} value
   * @return {BrowserApplicationBuilder}
   */
  id(value) {
    this.#id = value
    return this
  }

  /**
   * @param {Dispatcher} value
   * @return {BrowserApplicationBuilder}
   */
  dispatcher(value) {
    this.#dispatcher = value
    return this
  }

  /**
   * @param {Document} value
   * @return {BrowserApplicationBuilder}
   */
  document(value) {
    this.#document = value
    return this
  }

  /**
   * @param {boolean} value
   * @return {BrowserApplicationBuilder}
   */
  viewDebug(value) {
    this.#viewDebug = value
    return this
  }

  /**
   * @return {HotBalloonApplication}
   */
  build() {
    return new ApplicationBuilderBase()
      .document(this.#document)
      .navigator(this.#document?.defaultView?.navigator ?? null)
      .id(this.#id)
      .scheduler(new BasicSchedulerHandler())
      .dispatcher(this.#dispatcher)
      .domAccessor( new SyncDomAccessor())
      .build()
  }
}
