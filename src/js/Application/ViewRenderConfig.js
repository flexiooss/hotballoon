import {assertInstanceOf,  TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {DomAccessor} from '../View/DomAccessor.js'


export class ViewRenderConfig {

  /**
   * @type {DomAccessor}
   */
  #domAccessor
  /**
   * @type {Document}
   */
  #document
  /**
   * @type {boolean}
   */
  #debug

  /**
   * @param {Document} document
   * @param {boolean} debug
   * @param {DomAccessor} domAccessor
   */
  constructor(document, debug, domAccessor) {
    this.#document = document
    this.#debug = TypeCheck.assertIsBoolean(debug)
    assertInstanceOf(domAccessor, DomAccessor, 'DomAccessor')
    this.#domAccessor = domAccessor
  }

  /**
   * @return {Document}
   */
  document() {
    return this.#document
  }

  /**
   * @return {boolean}
   */
  debug() {
    return this.#debug
  }

  /**
   * @return {DomAccessor}
   */
  domAccessor() {
    return this.#domAccessor
  }
}
