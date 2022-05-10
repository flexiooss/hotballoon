import {isNull, TypeCheck} from "@flexio-oss/js-commons-bundle/assert";
import {getParentNode} from "@flexio-oss/js-commons-bundle/js-type-helpers";
import {UID} from "@flexio-oss/js-commons-bundle/js-helpers";

/**
 * @type {symbol}
 */
const __CustomEventHandler__ = Symbol('__CustomEventHandler__')
/**
 * @type {function}
 */
const pointerdownExe = function () {
  this._up = false
  this._clearHoldInterval()
  this._start = new Date()
  if (this._hold) {
    this._timerHold = setTimeout(
      () => {
        if (isNull(this._timerHold) || this._up || isNull(this._start)) return
        this._dispatchEvent(CustomEventHandler.HOLD)
        this._start = null
      },
      this._holdThreshold
    )
  }
}
/**
 * @type {function}
 */
const pointerupExe = function () {
  this._up = true
  /**
   * @type {Date}
   */
  const now = new Date()
  this._clearHoldInterval()

  if (this._doubleTap && ((now - this._end) < this._doubleThreshold)) {
    this._clearTapInterval()
    this._dispatchEvent(CustomEventHandler.DOUBLE_TAP)
  } else if (this._tap && !isNull(this._start) && isNull(this._timer)) {
    if (this._doubleTap) {
      this._timer = setTimeout(() => {
        this._dispatchEvent(CustomEventHandler.TAP)
        this._clearTapInterval()
      }, this._doubleThreshold)
    } else {
      this._dispatchEvent(CustomEventHandler.TAP)
    }

    this._end = now
  }
}

export class CustomEventHandler {
  static TAP = 'HB_TAP'
  static HOLD = 'HB_HOLD'
  static DOUBLE_TAP = 'HB_DOUBLE_TAP'
  /**
   * @type {string}
   * @private
   */
  _id = UID()
  /**
   * @type {HTMLElement}
   */
  _element
  /**
   * @type {boolean}
   */
  _up = false
  /**
   * @type {boolean}
   */
  _tap = false
  /**
   * @type {boolean}
   */
  _hold = false
  /**
   * @type {boolean}
   */
  _doubleTap = false
  /**
   * @type {number}
   */
  _holdThreshold = 800
  /**
   * @type {number}
   */
  _doubleThreshold = 300
  /**
   * @type {?Date}
   */
  _start = null
  /**
   * @type {?Date}
   */
  _end = null
  /**
   * @type {?number}
   */
  _timerHold = null
  /**
   * @type {?number}
   */
  _timer = null

  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    this._element = TypeCheck.assertIsNode(element);
    this._element[__CustomEventHandler__] = this
    this._element.addEventListener('pointerdown', this._pointerdown)
    this._element.addEventListener('pointerup', this._pointerup)
  }

  /**
   * @param {string} event
   * @return {boolean}
   */
  static isCustomEvent(event) {
    return [CustomEventHandler.TAP, CustomEventHandler.DOUBLE_TAP, CustomEventHandler.HOLD].includes(event)
  }

  /**
   * @param {HTMLElement} element
   * @return {boolean}
   */
  static hasHandler(element) {
    return element?.[__CustomEventHandler__] instanceof CustomEventHandler
  }

  /**
   * @param {HTMLElement} element
   * @return {?CustomEventHandler}
   */
  static getHandler(element) {
    return element?.[__CustomEventHandler__] ?? null
  }

  /**
   * @param {HTMLElement} element
   * @return {CustomEventHandler}
   */
  static ensureHandler(element) {
    if (!CustomEventHandler.hasHandler(element)) {
      new CustomEventHandler(element)
    }
    return element[__CustomEventHandler__]
  }

  /**
   * @param {HTMLElement}  element
   * @return {?CustomEventHandler}
   */
  static findParentHandler(element) {
    let handler = null
    if (CustomEventHandler.hasHandler(element)) {
      handler = CustomEventHandler.getHandler(element)
    } else {
      /**
       * @type {?HTMLElement}
       */
      const el = getParentNode(element, el => CustomEventHandler.hasHandler(el))
      if (!isNull(el)) {
        handler = CustomEventHandler.getHandler(el)
      }
    }
    return handler;
  }

  /**
   * @param {PointerEvent} event
   * @private
   */
  _pointerdown(event) {
    let handler = CustomEventHandler.findParentHandler(event.target);
    if (!isNull(handler)) {
      pointerdownExe.call(handler)
    }
  }

  /**
   * @param {PointerEvent} event
   * @private
   */
  _pointerup(event) {
    const handler = CustomEventHandler.findParentHandler(event.target)
    if (!isNull(handler)) {
      pointerupExe.call(handler)
    }
  }

  /**
   * @return {CustomEventHandler}
   * @private
   */
  _clearTapInterval() {
    clearInterval(this._timer)
    this._timer = null
    return this
  }

  /**
   * @return {CustomEventHandler}
   * @private
   */
  _clearHoldInterval() {
    clearInterval(this._timerHold)
    this._timerHold = null
    return this
  }

  /**
   * @return {CustomEventHandler}
   */
  hold() {
    this._hold = true
    return this
  }

  /**
   * @return {CustomEventHandler}
   */
  doubleTap() {
    this._doubleTap = true
    return this
  }

  /**
   * @return {CustomEventHandler}
   */
  tap() {
    this._tap = true
    return this
  }

  /**
   * @return {CustomEventHandler}
   */
  offHold() {
    this._hold = false
    return this
  }

  /**
   * @return {CustomEventHandler}
   */
  offDoubleTap() {
    this._doubleTap = false
    return this
  }

  /**
   * @return {CustomEventHandler}
   */
  offTap() {
    this._tap = false
    return this
  }

  /**
   * @param {string} event
   * @return {CustomEventHandler}
   */
  disable(event) {
    switch (event) {
      case CustomEventHandler.HOLD:
        this.offHold();
        break;
      case CustomEventHandler.DOUBLE_TAP:
        this.offDoubleTap();
        break;
      case CustomEventHandler.TAP:
        this.offTap();
        break;
    }
    return this
  }

  /**
   * @param {string} event
   * @return {CustomEventHandler}
   */
  enable(event) {
    switch (event) {
      case CustomEventHandler.HOLD:
        this.hold();
        break;
      case CustomEventHandler.DOUBLE_TAP:
        this.doubleTap();
        break;
      case CustomEventHandler.TAP:
        this.tap();
        break;
    }
    return this
  }

  /**
   * @param {string} event
   * @return {CustomEventHandler}
   */
  _dispatchEvent(event) {
    this._element.dispatchEvent(new Event(event))
    return this
  }

  /**
   * @return {HTMLElement}
   */
  element() {
    return this._element
  }

  /**
   * @return {boolean}
   */
  isEmpty() {
    return !(this._tap && this._doubleTap && this._hold)
  }

  remove() {
    this._element[__CustomEventHandler__] = null
    this._element.removeEventListener('pointerdown', this._pointerdown)
    this._element.removeEventListener('pointerup', this._pointerup)
  }
}