import {assert, isFunction, isNull, isNumber, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {getParentNode} from '@flexio-oss/js-commons-bundle/js-type-helpers/index.js';
import {UID} from '@flexio-oss/js-commons-bundle/js-helpers/index.js';
import {globalFlexioImport} from '@flexio-oss/js-commons-bundle/global-import-registry'

/**
 * @type {symbol}
 */
const __CustomEventHandler__ = Symbol('__CustomEventHandler__')

/**
 * @typedef {Object} TimerHandle
 * @property {number} value
 */

export class CustomEventHandler {
  /**
   * @type {?function(callback: FrameRequestCallback):number}
   */
  static requestAnimationFrame = null
  /**
   * @type {?function(handle: number):void}
   */
  static cancelAnimationFrame = null
  static TAP = 'HB_TAP'
  static HOLD = 'HB_HOLD'
  static HOLD_OR_RIGHT = 'HOLD_OR_RIGHT'
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
  _hold_or_right = false
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
  static _moveThreshold = 3
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
   * @type {TimerHandle|null}
   * @private
   */
  _timerHold = null
  /**
   * @type {TimerHandle|null}
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
    this._element.addEventListener('pointerdown', this._pointerdown, true)
    this._element.addEventListener('pointerup', this._pointerup, true)
    this.#ensureAnimation();
  }

  /**
   * @return {CustomEventHandler}
   */
  #ensureAnimation() {
    if (isNull(CustomEventHandler.requestAnimationFrame)) {
      CustomEventHandler.requestAnimationFrame = (fn) => this._element.ownerDocument.defaultView.requestAnimationFrame.call(this._element.ownerDocument.defaultView, fn)
    }
    if (isNull(CustomEventHandler.cancelAnimationFrame)) {
      CustomEventHandler.cancelAnimationFrame = (handle) => this._element.ownerDocument.defaultView.cancelAnimationFrame.call(this._element.ownerDocument.defaultView, handle)
    }
    return this
  }

  /**
   * @param {string} event
   * @return {boolean}
   */
  static isCustomEvent(event) {
    return [CustomEventHandler.TAP, CustomEventHandler.DOUBLE_TAP, CustomEventHandler.HOLD, CustomEventHandler.HOLD_OR_RIGHT].includes(event)
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
   * @return {boolean}
   * @private
   */
  static isRightClick(event) {
    return event.pointerType === 'mouse' && event.button === 2
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
      if (this._hold_or_right) {
        if (event.pointerType === 'mouse' && event.button !== 0 && !CustomEventHandler.isRightClick(event)) return
      } else {
        if (event.pointerType === 'mouse' && event.button !== 0) return
      }
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
      if (!this._hold_or_right) {
        if (event.pointerType === 'mouse' && event.button !== 0 && !CustomEventHandler.isRightClick(event)) return
      } else {
        if (event.pointerType === 'mouse' && event.button !== 0) return
      }

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
      if (event.pointerType === 'mouse' && !(event.button === 0 || event.button === -1)) return

      handler.pointermoveExe(event)
    }
  }

  /**
   * @return {CustomEventHandler}
   * @private
   */
  _clearTap() {
    if (!isNull(this._timer)) {
      CustomEventHandler.clearRequestTimeout(this._timer)
      this._timer = null
    }
    return this
  }

  /**
   * @return {CustomEventHandler}
   * @private
   */
  _clearHold() {
    if (!isNull(this._timerHold)) {
      CustomEventHandler.clearRequestTimeout(this._timerHold)
      this._timerHold = null
    }
    return this
  }

  /**
   * @param {function} fn
   * @param {number} delay
   * @return {TimerHandle}
   */
  static requestTimeout(fn, delay) {

    const start = new Date().getTime();
    let handle = {};

    const loop = function () {
      let current = new Date().getTime();
      let delta = current - start;
      if (delta >= delay) {
        fn.call(null);
      } else {
        handle.value = CustomEventHandler.requestAnimationFrame(loop);
      }
    };
    handle.value = CustomEventHandler.requestAnimationFrame(loop);

    return handle;
  }

  /**
   * @param {TimerHandle} handle
   * @returns {void}
   */
  static clearRequestTimeout(handle) {
    if (handle) {
      CustomEventHandler.cancelAnimationFrame(handle.value)
    }
  }

  /**
   * @type {function}
   * @param {PointerEvent} event
   */
  pointermoveExe(event) {
    this._captureEvent(event.pointerId);
    CustomEventHandler.requestAnimationFrame(() => {
      // try {
      //   this._captureEvent(event.pointerId);
      // } catch (e) {
      //   if (!e instanceof DOMException) {
      //     throw e
      //   }
      // }
      if (!this._moving) {
        this._moving = this.constructor.moved(this._startCoords, event);
      }
    })
  }

  /**
   * @param {?{x:number, y:number}} startCoords
   * @param {PointerEvent} event
   * @return {boolean}
   */
  static moved(startCoords, event) {
    if (!isNull(startCoords)) {
      if (event.movementX >= this._moveThreshold || Math.abs(startCoords.x - event.x) >= this._moveThreshold) {
        return true;
      }
      if (event.movementY >= this._moveThreshold || Math.abs(startCoords.y - event.y) >= this._moveThreshold) {
        return true;
      }
    }
    return false;
  }

  trigUp() {
    /**
     * @type {DOMRect}
     */
    const RECT = this._element.getBoundingClientRect();

    this.pointerupExe(new PointerEvent("pointerup", {
      pointerType: 'mouse',
      clientX: RECT.x,
      clientY: RECT.y
    }))
  }

  /**
   * @type {function}
   * @param {PointerEvent} event
   */
  pointerdownExe(event) {
    this._up = false
    this
      ._resetMoving()
      ._clearHold()
    this._startCoords = {
      x: event.x,
      y: event.y
    }
    this._start = new Date()

    if (this._hold || (this._hold_or_right && !CustomEventHandler.isRightClick(event))) {

      this._element.addEventListener('pointermove', this._pointermove)
      this._timerHold = CustomEventHandler.requestTimeout(
        () => {
          this._element.removeEventListener('pointermove', this._pointermove)
          if (isNull(this._timerHold) || this._up || this._moving || isNull(this._start)) return
          if (this._hold_or_right) {
            this._dispatchEvent(CustomEventHandler.HOLD_OR_RIGHT, event)
          }
          if (this._hold) {
            this._dispatchEvent(CustomEventHandler.HOLD, event)
          }
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
      * @type {boolean}
     */
    const moved = this.constructor.moved(this._startCoords, event);

    /**
     * @type {Date}
     */
    const now = new Date()
    if (this._hold || (this._hold_or_right && !CustomEventHandler.isRightClick(event))) {
      this._element.removeEventListener('pointermove', this._pointermove)
      this
        ._clearHold()
        ._resetMoving()
    }
    if (CustomEventHandler.isRightClick(event)) {
      if (this._hold_or_right && !moved) {
        this._dispatchEvent(CustomEventHandler.HOLD_OR_RIGHT, event)
      }
    } else if (this._doubleTap && ((now - this._end) < this._doubleThreshold)) {
      this._clearTap()
      if (!moved) {
        this._dispatchEvent(CustomEventHandler.DOUBLE_TAP, event);
      }
    } else if ((this._tap || this._doubleTap) && !isNull(this._start) && isNull(this._timer)) {
      if (this._doubleTap) {
        this._timer = CustomEventHandler.requestTimeout(() => {
          if (event.pointerType !== 'mouse') {
            event.target?.focus()
          }
          if (!moved) {
            this._dispatchEvent(CustomEventHandler.TAP, event)
          }
          this._clearTap()
        }, this._doubleThreshold)
      } else {
        if ((now - this._start) > this._doubleThreshold) return;
        if (event.pointerType !== 'mouse') {
          event.target?.focus()
        }
        if (!moved) {
          this._dispatchEvent(CustomEventHandler.TAP, event)
        }
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
  holdOrRight() {
    this._hold_or_right = true
    this._disableContextualMenu()
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
  offHoldOrRight() {
    this._hold_or_right = false
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
      case CustomEventHandler.HOLD_OR_RIGHT:
        this.offHoldOrRight();
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
      case CustomEventHandler.HOLD_OR_RIGHT:
        this.holdOrRight()
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
   * @param {string} eventName
   * @param {PointerEvent} event
   * @return {CustomEventHandler}
   */
  _dispatchEvent(eventName, event) {
    event.stopPropagation(); //TODO à supprimer après nettoyage du code sur EUIs
    let x = Math.round(event.x)
    let y = Math.round(event.y)

    const customEvent = new CustomEvent(eventName,
      {
        detail: {
          source: event.target,
          sourceEvent: event,
          x: isNumber(x) ? x : null,
          y: isNumber(y) ? y : null,
          altKey: event?.altKey ?? false,
          ctrlKey: event?.ctrlKey ?? false,
          metaKey: event?.metaKey ?? false,
          shiftKey: event?.shiftKey ?? false
        }
      }
    )

    this._element.dispatchEvent(customEvent)

    switch (eventName) {
      case CustomEventHandler.HOLD:
        if (isFunction(this._element?.onHold)) this._element.onHold.call(null, customEvent)
        break;
      case CustomEventHandler.HOLD_OR_RIGHT:
        if (isFunction(this._element?.onHoldOrRight)) this._element.onHoldOrRight.call(null, customEvent)
        break;
      case CustomEventHandler.DOUBLE_TAP:
        if (isFunction(this._element?.onDoubleTap)) this._element.onDoubleTap.call(null, customEvent)
        break;
      case CustomEventHandler.TAP:
        if (isFunction(this._element?.onTap)) this._element.onTap.call(null, customEvent)
        break;
    }

    return this
  }

  /**
   * @return {CustomEventHandler}
   * @private
   */
  _disableContextualMenu() {
    this._element.addEventListener("contextmenu", e => e.preventDefault());
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
    return !(this._tap && this._doubleTap && this._hold && this._hold_or_right)
  }

  remove() {
    this._element[__CustomEventHandler__] = null
    this._element.removeEventListener('pointerdown', this._pointerdown, true)
    this._element.removeEventListener('pointerup', this._pointerup, true)
  }
}


export class CustomEventDOMPositionHelper {
  /**
   * @param {CustomEvent} event
   * @return {DOMPosition}
   */
  static getCursorPosition(event) {
    assert(CustomEventHandler.isCustomEvent(event.type), 'Event should be hotBalloon custom event')
    return globalFlexioImport.io.flexio.flex_types.DOMPosition.builder()
      .x(event.detail.x)
      .y(event.detail.y)
      .width(0)
      .height(0)
      .build()
  }
}
