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
  /**
   * @type {(callback: function) => number}
   */
  requestIdleCallback

  /**
   * @param {function} requestIdleCallback
   * */
  constructor(requestIdleCallback) {

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
    }, {
      rootMargin: '100px 0px 100px 0px',
      threshold: 0
    })

    this.requestIdleCallback = requestIdleCallback
  }

  /**
   * @param {Event} event
   */
  execVisible(event) {
    let item = event.target
    let handler = getObserverHandler()
    if (handler && handler.callBacks.has(item.id)) {
      handler.requestIdleCallback.call(handler, () => {
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
    if (handler && handler.callBacks.has(item.id)) {
      handler.requestIdleCallback.call(handler, () => {
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
    if (this.#isVisible(element)) {
      this.requestIdleCallback.call(null,
        () => {
          element.dispatchEvent(new Event('__HB_VISIBLE__'))
        }
      )
    } else {
      this.requestIdleCallback.call(null,
        () => {
          element.dispatchEvent(new Event('__HB_HIDDEN__'))
        }
      )
    }
    this.#observer.observe(element)
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
    if (this.#isVisible(element)) {
      this.requestIdleCallback.call(null,
        () => {
          element.dispatchEvent(new Event('__HB_VISIBLE__'))
        }
      )
    } else {
      this.#observer.observe(element)
    }
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
   * @param {HTMLElement} element
   * @return {boolean}
   */
  #isVisible(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (element.ownerDocument.defaultView.innerHeight || element.ownerDocument.documentElement.clientHeight) &&
      rect.left <= (element.ownerDocument.defaultView.innerWidth || element.ownerDocument.documentElement.clientWidth) &&
      rect.bottom >= 0 &&
      rect.right >= 0
    );

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
 * @return {?Handler}
 */
const getObserverHandler = () => {
  // if (isNull(observerHandler)) {
  //   observerHandler = new Handler()
  // }
  return observerHandler
}
/**
 * @param {function} requestIdleCallback
 * @return {Handler}
 */
const ensureObserverHandler = (requestIdleCallback) => {
  if (isNull(observerHandler)) {
    observerHandler = new Handler(requestIdleCallback)
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
    this.__requestIdleCallback = (clb) => setTimeout(clb)
    if (!isNull(window)) {
      this.#window = window
      if ('requestIdleCallback' in window) {
        this.__requestIdleCallback = (clb) => window.requestIdleCallback(clb)
      }
    }
  }

  /**
   * @return {IntersectionObserverHandler}
   */
  #ensureObserver() {
    if (isNull(this.#observer) && !isNull(this.#window) && 'IntersectionObserver' in this.#window) {
      this.#observer = ensureObserverHandler(this.__requestIdleCallback)
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
      this.__requestIdleCallback.call(null, clb)
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
      this.__requestIdleCallback.call(null, clb)
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