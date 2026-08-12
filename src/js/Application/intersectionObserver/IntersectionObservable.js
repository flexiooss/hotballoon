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
   * @type {?boolean}
   */
  #lastCall = null

  /**
   * @param {string} group
   * @param {HTMLElement} element
   * @param {IntersectionObservable~eventCallback} callback
   */
  constructor(group, element, callback) {
    this.#group = group
    this.#element = element
    this.#callback = callback
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
    if (this.#lastCall === visibility) return
    this.#lastCall = visibility
    this.#callback.call(null, this.#element, visibility)
  }

  /**
   * @return {IntersectionObservable~eventCallback}
   */
  callback() {
    return this.#callback
  }
}
