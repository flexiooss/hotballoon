import {isEmpty, isNull, TypeCheck} from '@flexio-oss/js-commons-bundle/assert'
import {IntersectionObservable} from './IntersectionObservable'

/**
 * @callback IntersectionObserverComponent~genericCallback
 * @param {HTMLElement} element
 * @param {boolean} documentVisibilityState
 */

/**
 * @callback IntersectionObserverComponent~visibleOnceCallback
 * @param {HTMLElement} element
 */

/**
 * @class
 */
export class IntersectionObserverComponent {
  /**
   * @type {IntersectionObserver}
   */
  #observer
  /**
   * @type {Map<string, IntersectionObservable>}
   */
  #callBacks = new Map()
  /**
   * @type {(callback: function) => number}
   */
  #requestIdleCallback
  /**
   * @type {function(number)}
   */
  #cancelIdleCallback

  /**
   * @param {function} requestIdleCallback
   * @param {function(number)} cancelIdleCallback
   */
  constructor(requestIdleCallback, cancelIdleCallback) {
    this.#observer = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        let item = entry.target
        if (entry.isIntersecting) {
          item.dispatchEvent(new Event('__HB_VISIBLE__'))
        } else {
          item.dispatchEvent(new Event('__HB_HIDDEN__'))
        }
      })
    }, {
      rootMargin: '100px 0px 100px 0px',
      threshold: 0,
    })

    this.#requestIdleCallback = requestIdleCallback
    this.#cancelIdleCallback = cancelIdleCallback
  }

  /**
   * @param {Event} event
   */
  execVisible(event) {
    let targetId = event.target.id
    if (this.#callBacks.has(targetId)) {
      this.#callBacks.get(targetId).callWithVisibility(true)
    }
  }

  /**
   * @param {Event} event
   */
  execHidden(event) {
    let targetId = event.target.id
    if (this.#callBacks.has(targetId)) {
      this.#callBacks.get(targetId).callWithVisibility(false)
    }
  }


  /**
   * @param {string} group
   * @param {HTMLElement} element
   * @param {IntersectionObserverComponent~genericCallback} clb
   * @return {IntersectionObserverComponent}
   */
  observe(group, element, clb) {
    TypeCheck.assertIsNode(element)
    this.#observer.observe(element)
    if (isEmpty(element.id)) {
      throw new Error('Handler:IntersectionObserver: element should have an id')
    }
    if (this.#callBacks.has(element.id)) {
      throw new Error('Handler:IntersectionObserver: element already observed id:' + element.id)
    }
    const observable = new IntersectionObservable(
      group,
      element,
      (item, visibility) => {
        TypeCheck.assertIsFunction(clb).call(null, item, visibility)
      },
      this.#requestIdleCallback,
      this.#cancelIdleCallback,
    )
    this.#callBacks.set(element.id, observable)
    element.addEventListener('__HB_VISIBLE__', this.execVisible.bind(this))
    element.addEventListener('__HB_HIDDEN__', this.execHidden.bind(this))
    observable.callWithVisibility(this.#isVisible(element))
    this.#observer.observe(element)
    return this
  }

  /**
   * @param {string} group
   * @param {HTMLElement} element
   * @param {IntersectionObserverComponent~visibleOnceCallback} clb
   * @return {IntersectionObserverComponent}
   */
  observeOnce(group, element, clb) {
    TypeCheck.assertIsNode(element)

    if (isEmpty(element.id)) {
      throw new Error('Handler:IntersectionObserver: element should have an id')
    }
    if (this.#callBacks.has(element.id)) {
      throw new Error('Handler:IntersectionObserver: element already observed id:' + element.id)
    }
    let observable = new IntersectionObservable(
      group,
      element,
      (item) => {
        this.unObserve(item)
        TypeCheck.assertIsFunction(clb).call(null, item)
      },
      this.#requestIdleCallback,
      this.#cancelIdleCallback,
    )
    if (this.#isVisible(element)) {
      observable.callWithVisibility(true)
    } else {
      this.#callBacks.set(element.id, observable)
      element.addEventListener('__HB_VISIBLE__', this.execVisible.bind(this))
      this.#observer.observe(element)
    }
    return this
  }

  /**
   * @param {HTMLElement} element
   * @return {IntersectionObserverComponent}
   */
  unObserve(element) {
    TypeCheck.assertIsNode(element)
    if (this.#callBacks.has(element.id)) {
      const observable = this.#callBacks.get(element.id)
      observable.remove()
      this.#callBacks.delete(element.id)
    }
    this.#observer.unobserve(element)
    element.removeEventListener('__HB_VISIBLE__', this.execVisible.bind(this))
    element.removeEventListener('__HB_HIDDEN__', this.execHidden.bind(this))
    return this
  }

  /**
   * @param {HTMLElement} element
   * @return {boolean}
   */
  #isVisible(element) {
    if ('function' === typeof element.checkVisibility) {
      if (!element.checkVisibility()) return false
    }
    const rect = element.getBoundingClientRect()
    return (
      rect.top <= (element.ownerDocument.defaultView.innerHeight || element.ownerDocument.documentElement.clientHeight) &&
      rect.left <= (element.ownerDocument.defaultView.innerWidth || element.ownerDocument.documentElement.clientWidth) &&
      rect.bottom >= 0 &&
      rect.right >= 0
    )
  }

  /**
   * @param {string} group
   * @return {IntersectionObserverComponent}
   */
  clearGroup(group) {
    this.#callBacks.forEach((v, k) => {
      if (v.group() === group) {
        this.unObserve(v.element())
      }
    })
    return this
  }

  /**
   * @return {IntersectionObserverComponent}
   */
  remove() {
    if (!isNull(this.#observer)) {
      this.#observer.disconnect()
      this.#observer = null
      this.#callBacks.clear()
      this.#callBacks = null
    }
  }
}
