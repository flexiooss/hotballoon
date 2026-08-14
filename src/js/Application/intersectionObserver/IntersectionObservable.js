import {isNull, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'

/**
 * @callback IntersectionObservable~eventCallback
 * @param {HTMLElement} element
 * @param {boolean} documentVisibilityState
 */

/**
 * @class
 */
export class IntersectionObservable {
  /**
   * @type {string}
   */
  #group
  /**
   * @type {HTMLElement}
   */
  #element
  /**
   * @type {function(el:HTMLElement, visibility: boolean):void}
   */
  #callback
  /**
   * @type {function(Function):number}
   */
  #requestIdleCallback
  /**
   * @type {function(number)}
   */
  #cancelIdleCallback

  /**
   * @type {boolean}
   */
  #isRemoving = false
  /**
   * @type {?boolean}
   */
  #lastCall = null
  /**
   * @type {?number}
   */
  #callbackId = null

  /**
   * @param {string} group
   * @param {HTMLElement} element
   * @param {IntersectionObservable~eventCallback} callback
   * @param {function(Function):number} requestIdleCallback
   * @param {function(number)} cancelIdleCallback
   */
  constructor(group, element, callback, requestIdleCallback, cancelIdleCallback) {
    this.#group = group
    this.#element = element
    this.#callback = callback
    this.#requestIdleCallback = requestIdleCallback
    this.#cancelIdleCallback = cancelIdleCallback
  }

  /**
   * @return {string}
   */
  group() {
    return this.#group
  }

  /**
   * @return {HTMLElement}
   */
  element() {
    return this.#element
  }

  callWithVisibility(visibility) {
    TypeCheck.assertIsBoolean(visibility)
    if (this.#isRemoving) return

    if (!isNull(this.#callbackId)) {
      this.#cancelIdleCallback(this.#callbackId)
      this.#callbackId = null
    }
    if (this.#lastCall !== visibility) {
      this.#callbackId = this.#requestIdleCallback(() => {
        if (this.#isRemoving) return
        this.#lastCall = visibility
        this.#callbackId = null
        this.#callback.call(null, this.#element, visibility)
      })
    }
  }

  remove() {
    this.#isRemoving = true
  }
}
