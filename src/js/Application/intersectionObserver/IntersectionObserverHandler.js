import {isNull} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {UIDMini} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'
import {IntersectionObserverComponent} from './IntersectionObserverComponent'

/**
 * @type {?IntersectionObserverComponent}
 */
let observerHandler = null

/**
 * @param {function(function):number} requestIdleCallback
 * @param {function(number)} cancelIdleCallback
 * @return {IntersectionObserverComponent}
 */
const ensureObserverHandler = (requestIdleCallback, cancelIdleCallback) => {
  if (isNull(observerHandler)) {
    observerHandler = new IntersectionObserverComponent(requestIdleCallback, cancelIdleCallback)
  }
  return observerHandler
}

const removeObserverHandler = () => {
  if (!isNull(observerHandler)) {
    observerHandler.remove()
    observerHandler = null
  }
}

export class IntersectionObserverHandler {
  /**
   * @type {?IntersectionObserverComponent}
   */
  #observer = null
  /**
   * @type {?Window}
   */
  #window
  /**
   * @type {string}
   */
  #id = UIDMini()
  /**
   * @type {function(function):number}
   */
  #requestIdleCallback
  /**
   * @type {function(number)}
   */
  #cancelIdleCallback

  /**
   * @param {?Window} window
   */
  constructor(window) {
    this.#requestIdleCallback = function (clb) {
      return setTimeout(clb)
    }
    this.#cancelIdleCallback = function (id) {
      clearTimeout(id)
    }

    if (!isNull(window)) {
      this.#window = window
      if ('requestIdleCallback' in window && 'cancelIdleCallback' in window) {
        this.#requestIdleCallback = function (clb) {
          return window.requestIdleCallback(clb, {timeout: 1_500})
        }
        this.#cancelIdleCallback = function (id) {
          window.cancelIdleCallback(id)
        }
      }
    }
  }

  /**
   * @return {IntersectionObserverHandler}
   */
  #ensureObserver() {
    if (isNull(this.#observer) && !isNull(this.#window) && 'IntersectionObserver' in this.#window) {
      this.#observer = ensureObserverHandler(this.#requestIdleCallback, this.#cancelIdleCallback)
    }
    return this
  }

  /**
   * @param {HTMLElement} element
   * @param {IntersectionObserverComponent~genericCallback} clb
   * @return {IntersectionObserverHandler}
   */
  observe(element, clb) {
    this.#ensureObserver()
    if (!isNull(this.#observer)) {
      this.#observer.observe(this.#id, element, clb)
    } else {
      this.#requestIdleCallback.call(null, clb.bind(null, element, true))
    }
    return this
  }

  /**
   * @param {HTMLElement} element
   * @param {IntersectionObserverComponent~visibleOnceCallback} clb
   * @return {IntersectionObserverHandler}
   */
  observeOnce(element, clb) {
    this.#ensureObserver()
    if (!isNull(this.#observer)) {
      this.#observer.observeOnce(this.#id, element, clb)
    } else {
      this.#requestIdleCallback.call(null, clb.bind(null, element))
    }
    return this
  }

  /**
   * @param {HTMLElement} element
   * @return {IntersectionObserverHandler}
   */
  unObserve(element) {
    if (!isNull(this.#observer)) {
      this.#observer.unObserve(element)
    }
    return this
  }

  remove() {
    if (!isNull(this.#observer)) {
      this.#observer.clearGroup(this.#id)
    }
  }
}