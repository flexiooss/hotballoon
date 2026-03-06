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

  /**
   * @return {IntersectionObservable~eventCallback}
   */
  callback() {
    return this.#callback
  }
}
