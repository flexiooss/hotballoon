import {isNull, TypeCheck} from "@flexio-oss/js-commons-bundle/assert";
import {getParentNode} from "@flexio-oss/js-commons-bundle/js-type-helpers";
import {UID} from "@flexio-oss/js-commons-bundle/js-helpers";

/**
 * @type {symbol}
 */
const __CustomEventHandler__ = Symbol('__CustomEventHandler__')


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
   * @private
   */
  _element
  /**
   * @type {boolean}
   * @private
   */
  _up = false
  /**
   * @type {boolean}
   * @private
   */
  _moving = false
  /**
   * @type {boolean}
   * @private
   */
  _tap = false
  /**
   * @type {boolean}
   * @private
   */
  _hold = false
  /**
   * @type {boolean}
   * @private
   */
  _doubleTap = false
  /**
   * @type {number}
   * @private
   */
  _holdThreshold = 800
  /**
   * @type {number}
   * @private
   */
  _moveThreshold = 5
  /**
   * @type {number}
   * @private
   */
  _doubleThreshold = 300
  /**
   * @type {?Date}
   * @private
   */
  _start = null
  /**
   * @type {?Date}
   * @private
   */
  _end = null
  /**
   * @type {?number}
   * @private
   */
  _timerHold = null
  /**
   * @type {?number}
   * @private
   */
  _timer = null
  /**
   * @type {?number}
   * @private
   */
  _capturedPointerId = null
  /**
   * @type {?{x:number, y:number}}
   * @private
   */
  _startCoords = null

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
    /**
     * @type {?CustomEventHandler}
     */
    const handler = CustomEventHandler.findParentHandler(event.target);
    if (!isNull(handler)) {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      event.stopPropagation()
      handler.pointerdownExe(event)
    }
  }

  /**
   * @param {PointerEvent} event
   * @private
   */
  _pointerup(event) {
    /**
     * @type {?CustomEventHandler}
     */
    const handler = CustomEventHandler.findParentHandler(event.target)
    if (!isNull(handler)) {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      event.stopPropagation()
      handler.pointerupExe(event)
    }
  }

  /**
   * @param {PointerEvent} event
   * @private
   */
  _pointermove(event) {
    /**
     * @type {?CustomEventHandler}
     */
    const handler = CustomEventHandler.findParentHandler(event.target)
    if (!isNull(handler)) {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      event.stopPropagation()
      handler.pointermoveExe(event)
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
   * @type {function}
   * @param {PointerEvent} event
   */
  pointermoveExe(event) {
        this._captureEvent(event.pointerId);
    this._element.ownerDocument.defaultView.requestAnimationFrame(() => {
    //   try {
    //     this._captureEvent(event.pointerId);
    //   } catch (e) {
    //     if (!e instanceof DOMException) {
    //       throw e
    //     }
    //   }
      if (!this._moving) {
        if (!isNull(this._startCoords)) {
          if (Math.abs(this._startCoords.x - event.x) > this._moveThreshold) {
            this._moving = true
          }
          if (Math.abs(this._startCoords.y - event.y) > this._moveThreshold) {
            this._moving = true
          }
        }
      }
    })
  }

  /**
   * @type {function}
   * @param {PointerEvent} event
   */
  pointerdownExe(event) {
    this._up = false
    this
      ._resetMoving()
      ._clearHoldInterval()
    this._startCoords = {
      x: event.x,
      y: event.y
    }
    this._start = new Date()
    if (this._hold) {

      this._element.addEventListener('pointermove', this._pointermove)
      this._timerHold = setTimeout(
        () => {
          this._element.removeEventListener('pointermove', this._pointermove)
          if (isNull(this._timerHold) || this._up || this._moving || isNull(this._start)) return
          this._dispatchEvent(CustomEventHandler.HOLD, event)
          this._start = null
        },
        this._holdThreshold
      )
    }
  }

  /**
   * @return {CustomEventHandler}
   * @private
   */
  _resetMoving() {
    this._moving = false
    this._startCoords = null
    return this
  }

  /**
   * @param {?number} eventPointerId
   * @private
   */
  _captureEvent(eventPointerId) {
    if (isNull(this._capturedPointerId)) {
      this._capturedPointerId = eventPointerId
      this._element.setPointerCapture(eventPointerId)
    }
  }

  /**
   * @type {function}
   * @param {PointerEvent} event
   */
  pointerupExe(event) {
    this._up = true
    /**
     * @type {Date}
     */
    const now = new Date()
    if (this._hold) {
      this._element.removeEventListener('pointermove', this._pointermove)
      this
        ._clearHoldInterval()
        ._resetMoving()
    }

    if (this._doubleTap && ((now - this._end) < this._doubleThreshold)) {
      this._clearTapInterval()
      this._dispatchEvent(CustomEventHandler.DOUBLE_TAP, event)
    } else if (this._tap && !isNull(this._start) && isNull(this._timer)) {
      if (this._doubleTap) {
        this._timer = setTimeout(() => {
          this._dispatchEvent(CustomEventHandler.TAP, event)
          this._clearTapInterval()
        }, this._doubleThreshold)
      } else {
        this._dispatchEvent(CustomEventHandler.TAP, event)
      }

      this._end = now
    }
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
   * @param {PointerEvent} event
   * @return {CustomEventHandler}
   */
  _dispatchEvent(eventName, event) {
    this._element.dispatchEvent(new CustomEvent(eventName, {detail: {source: event.target}}))
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