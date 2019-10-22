import {HotBalloonApplication} from './HotBalloonApplication'

export class ApplicationBuilder {
  
  constructor() {
    /**
     *
     * @type {?string}
     * @private
     */
    this.__id = null
    /**
     *
     * @type {?Dispatcher}
     * @private
     */
    this.__dispatcher = null
    /**
     *
     * @type {?LoggerInterface}
     * @private
     */
    this.__logger = null
    /**
     *
     * @type {?Document}
     * @private
     */
    this.__document = null
  }

  /**
   *
   * @param {string} value
   * @return {ApplicationBuilder}
   */
  id(value) {
    this.__id = value
    return this
  }

  /**
   *
   * @param {Dispatcher} value
   * @return {ApplicationBuilder}
   */
  dispatcher(value) {
    this.__dispatcher = value
    return this
  }

  /**
   *
   * @param {LoggerInterface} value
   * @return {ApplicationBuilder}
   */
  logger(value) {
    this.__logger = value
    return this
  }

  /**
   *
   * @param {Document} value
   * @return {ApplicationBuilder}
   */
  document(value) {
    this.__document = value
    return this
  }

  /**
   *
   * @return {HotBalloonApplication}
   */
  build() {
    return new HotBalloonApplication(this.__id, this.__dispatcher, this.__logger, this.__document)
  }
}
