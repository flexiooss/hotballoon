import {ApplicationBuilder, AsyncDomAccessor} from './index'
import { TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {UID} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'
import {BrowserSchedulerHandler} from "./src/js/Scheduler/BrowserSchedulerHandler.js";


export class BrowserApplicationBuilder {
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
    TypeCheck.assertIsObject(this.#document)
    return new ApplicationBuilder()
      .document(this.#document)
      .navigator(this.#document.defaultView.navigator)
      .id(this.#id)
      .scheduler(new BrowserSchedulerHandler(this.#document.defaultView))
      .dispatcher(this.#dispatcher)
      .domAccessor( new AsyncDomAccessor(this.#document.defaultView))
      .build()
  }
}
