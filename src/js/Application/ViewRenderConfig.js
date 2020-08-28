import {TypeCheck} from '@flexio-oss/js-commons-bundle/assert'


export class ViewRenderConfig {

  /**
   * @param {Document} document
   * @param {boolean} debug
   */
  constructor(document, debug) {

    /**
     * @type {Document}
     * @private
     */
    this.__document = document
    /**
     * @type {boolean}
     * @private
     */
    this.__debug = TypeCheck.assertIsBoolean(debug)
  }

  /**
   * @return {Document}
   */
  document() {
    return this.__document
  }

  /**
   * @return {boolean}
   */
  debug() {
    return this.__debug
  }
}
