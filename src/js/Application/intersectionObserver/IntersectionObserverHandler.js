import {isEmpty, isNull, TypeCheck} from "@flexio-oss/js-commons-bundle/assert";


class Handler {
  /**
   * @type {IntersectionObserver}
   */
  #observer
  /**
   * @type {Map<string, function(el:HTMLElement):void>}
   */
  callBacks = new Map()

  constructor() {
    this.#observer = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          let item = entry.target;
          item.dispatchEvent(new Event('__HB_VISIBLE__'))
          observer.unobserve(item);
        }
      });
    })
  }

  /**
   * @param {Event} event
   */
  execVisible(event) {
    let item = event.target
    let handler = getObserverHandler()
    if (handler.callBacks.has(item.id)) {
      setTimeout(() => {
        if (handler.callBacks.has(item.id)) {
          handler.callBacks.get(item.id).call(null, item)
        }
      })
    }
  }

  /**
   * @param {HTMLElement} element
   * @param {function(el:HTMLElement):void} clb
   * @return {Handler}
   */
  observe(element, clb) {
    TypeCheck.assertIsNode(element)
    this.#observer.observe(element)
    if (isEmpty(element.id)) {
      throw new Error('Handler:IntersectionObserver: element should have an id')
    }
    this.callBacks.set(element.id, (item) => {
      TypeCheck.assertIsFunction(clb).call(null, item)
      this.unObserve(item, true)
    })
    element.addEventListener('__HB_VISIBLE__', this.execVisible)
    return this
  }

  /**
   * @param {HTMLElement} element
   * @return {Handler}
   */
  unObserve(element, interne) {
    TypeCheck.assertIsNode(element)
    this.#observer.unobserve(element)
    this.callBacks.delete(element.id)
    element.removeEventListener('__HB_VISIBLE__', this.execVisible)
    return this
  }

  /**
   * @return {Handler}
   */
  remove() {
    if (!isNull(this.#observer)) {
      this.#observer.disconnect()
      this.#observer = null
      this.callBacks.clear()
      this.callBacks = null
    }
  }

}

/**
 * @type {?Handler}
 */
let observerHandler = null

/**
 * @return {Handler}
 */
const getObserverHandler = () => {
  if (isNull(observerHandler)) {
    observerHandler = new Handler()
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
   * @type {?Handler}
   */
  #observer = null
  /**
   * @type {?Window}
   */
  #window

  /**
   * @param {?Window} window
   */
  constructor(window) {
    if (!isNull(window)) {
      this.#window = window
      this.#ensureObserver()
    }
  }

  /**
   * @return {IntersectionObserverHandler}
   */
  #ensureObserver() {
    if (!isNull(this.#window) && 'IntersectionObserver' in this.#window) {
      this.#observer = getObserverHandler()
    }
    return this
  }

  /**
   * @param {HTMLElement} element
   * @param {function(el:HTMLElement):void} clb
   * @return {IntersectionObserverHandler}
   */
  observe(element, clb) {
    if (!isNull(this.#observer)) {
      this.#observer.observe(element, clb)
    } else {
      setTimeout(clb, 0)
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

  /**
   * @return {IntersectionObserverHandler}
   */
  clear() {
    if (!isNull(this.#observer)) {
      removeObserverHandler()
      this.#ensureObserver()
    }
    return this
  }

  remove() {
    if (!isNull(this.#observer)) {
      removeObserverHandler()
    }
  }

}