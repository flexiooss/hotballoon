import {isEmpty, isNull, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js';
import {UIDMini} from '@flexio-oss/js-commons-bundle/js-helpers/index.js';

class Handler {
  /**
   * @type {IntersectionObserver}
   */
  #observer
  /**
   * @type {Map<string, Observable>}
   */
  callBacks = new Map()

  constructor() {
    this.#observer = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        let item = entry.target;
        if (entry.isIntersecting) {
          item.dispatchEvent(new Event('__HB_VISIBLE__'))
          // observer.unobserve(item);
        } else {
          item.dispatchEvent(new Event('__HB_HIDDEN__'))
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
          handler.callBacks.get(item.id).callback().call(null, item, true)
        }
      })
    }
  }

  /**
   * @param {Event} event
   */
  execHidden(event) {
    let item = event.target
    let handler = getObserverHandler()
    if (handler.callBacks.has(item.id)) {
      setTimeout(() => {
        if (handler.callBacks.has(item.id)) {
          handler.callBacks.get(item.id).callback().call(null, item, false)
        }
      })
    }
  }


  /**
   * @param {string} group
   * @param {HTMLElement} element
   * @param {function(el:HTMLElement, DocumentVisibilityState:boolean):void} clb
   * @return {Handler}
   */
  observe(group, element, clb) {
    TypeCheck.assertIsNode(element)
    this.#observer.observe(element)
    if (isEmpty(element.id)) {
      throw new Error('Handler:IntersectionObserver: element should have an id')
    }
    if (this.callBacks.has(element.id)) {
      throw new Error('Handler:IntersectionObserver: element already observed id:' + element.id)
    }
    this.callBacks.set(element.id, new Observable(
      group,
      element,
      (item, visibility) => {
        TypeCheck.assertIsFunction(clb).call(null, item, visibility)
      })
    )
    element.addEventListener('__HB_VISIBLE__', this.execVisible)
    element.addEventListener('__HB_HIDDEN__', this.execHidden)
    return this
  }

  /**
   * @param {string} group
   * @param {HTMLElement} element
   * @param {function(el:HTMLElement):void} clb
   * @return {Handler}
   */
  observeOnce(group, element, clb) {
    TypeCheck.assertIsNode(element)
    this.#observer.observe(element)
    if (isEmpty(element.id)) {
      throw new Error('Handler:IntersectionObserver: element should have an id')
    }
    if (this.callBacks.has(element.id)) {
      throw new Error('Handler:IntersectionObserver: element already observed id:' + element.id)
    }
    this.callBacks.set(element.id, new Observable(
      group,
      element,
      (item) => {
        this.unObserve(item, true)
        TypeCheck.assertIsFunction(clb).call(null, item)
      })
    )
    element.addEventListener('__HB_VISIBLE__', this.execVisible)
    return this
  }

  /**
   * @param {HTMLElement} element
   * @return {Handler}
   */
  unObserve(element) {
    TypeCheck.assertIsNode(element)
    this.callBacks.delete(element.id)
    this.#observer.unobserve(element)
    element.removeEventListener('__HB_VISIBLE__', this.execVisible)
    element.removeEventListener('__HB_HIDDEN__', this.execHidden)
    return this
  }

  /**
   * @param {string} group
   * @return {Handler}
   */
  clearGroup(group) {
    this.callBacks.forEach((v, k) => {
      if (v.group() === group) {
        this.unObserve(v.element())
      }
    })
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

class Observable {
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
   * @param { function(el:HTMLElement, visibility: boolean):void} callback
   */
  constructor(group, element, callback) {
    this.#group = group;
    this.#element = element;
    this.#callback = callback;
  }

  /**
   * @return {string}
   */
  group() {
    return this.#group;
  }

  /**
   * @return {HTMLElement}
   */
  element() {
    return this.#element;
  }

  /**
   * @return {function(HTMLElement, visibility: boolean): void}
   */
  callback() {
    return this.#callback;
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
   * @type {string}
   */
  #id = UIDMini()


  /**
   * @param {?Window} window
   */
  constructor(window) {
    if (!isNull(window)) {
      this.#window = window
    }
  }

  /**
   * @return {IntersectionObserverHandler}
   */
  #ensureObserver() {
    if (isNull(this.#observer) && !isNull(this.#window) && 'IntersectionObserver' in this.#window) {
      this.#observer = getObserverHandler()
    }
    return this
  }

  /**
   * @param {HTMLElement} element
   * @param {function(el:HTMLElement, visibility:boolean):void} clb
   * @return {IntersectionObserverHandler}
   */
  observe(element, clb) {
    this.#ensureObserver()
    if (!isNull(this.#observer)) {
      this.#observer.observe(this.#id, element, clb)
    } else {
      setTimeout(clb, 100)
    }
    return this
  }

  /**
   * @param {HTMLElement} element
   * @param {function(el:HTMLElement):void} clb
   * @return {IntersectionObserverHandler}
   */
  observeOnce(element, clb) {
    this.#ensureObserver()
    if (!isNull(this.#observer)) {
      this.#observer.observeOnce(this.#id, element, clb)
    } else {
      setTimeout(clb, 100)
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