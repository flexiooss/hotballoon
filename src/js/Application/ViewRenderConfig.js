import {assertInstanceOf, assertType, TypeCheck} from '@flexio-oss/js-commons-bundle/assert'
import {DomAccessor} from '../View/DomAccessor'
import {IntersectionObserverHandler} from "./intersectionObserver/IntersectionObserverHandler";


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
   * @type {IntersectionObserverHandler}
   */
  #intersectionObserverHandler


  /**
   * @param {Document} document
   * @param {boolean} debug
   * @param {DomAccessor} domAccessor
   * @param {IntersectionObserverHandler} intersectionObserverHandler
   */
  constructor(document, debug, domAccessor, intersectionObserverHandler) {
    this.#document = document
    this.#debug = TypeCheck.assertIsBoolean(debug)
    assertInstanceOf(domAccessor, DomAccessor, 'DomAccessor')
    this.#domAccessor = domAccessor
    assertInstanceOf(intersectionObserverHandler, IntersectionObserverHandler, 'IntersectionObserverHandler')
    this.#intersectionObserverHandler = intersectionObserverHandler;
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

  /**
   * @return {IntersectionObserverHandler}
   */
  intersectionObserverHandler() {
    return this.#intersectionObserverHandler;
  }
}
