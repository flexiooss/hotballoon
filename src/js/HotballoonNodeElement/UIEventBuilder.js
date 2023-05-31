import {ElementEventListenerConfigBuilder} from './ElementEventListenerConfigBuilder.js'
import {assertType, isFunction} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {CustomEventHandler} from "../../../flexio-nodes-reconciliation/index.js";

export class UIEventBuilder {

  /**
   * @return {CustomEventBuilder.}
   */
  static customEvent() {
    return CustomEventBuilder
  }

  /**
   * @return {PointerEventBuilder.}
   */
  static pointerEvent() {
    return PointerEventBuilder
  }

  /**
   * @return {MouseEventBuilder.}
   */
  static mouseEvent() {
    return MouseEventBuilder
  }

  /**
   * @return {KeyboardEventBuilder.}
   */
  static keyboardEvent() {
    return KeyboardEventBuilder
  }

  /**
   * @return {KeyKeyboardEventBuilder.}
   */
  static keyKeyboardEvent() {
    return KeyKeyboardEventBuilder
  }

  /**
   * @return {FocusEventBuilder.}
   */
  static focusEvent() {
    return FocusEventBuilder
  }

  /**
   * @return {DragEventBuilder.}
   */
  static dragEvent() {
    return DragEventBuilder
  }

  /**
   * @return {TouchEventBuilder.}
   */
  static touchEvent() {
    return TouchEventBuilder
  }

  /**
   * @return {ElementEventBuilder.}
   */
  static elementEvent() {
    return ElementEventBuilder
  }

  /**
   * @return {ClipboardEventBuilder.}
   */
  static clipboardEvent() {
    return ClipboardEventBuilder
  }

  /**
   * @return {CompositionEventBuilder.}
   */
  static compositionEvent() {
    return CompositionEventBuilder
  }

  /**
   * @return {BaseEventBuilder.}
   */
  static baseEvent() {
    return BaseEventBuilder
  }

}

class CustomEventBuilder {
  /**
   * @param {function(CustomEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static doubleTap(callback) {
    return ElementEventListenerConfigBuilder
      .listen(CustomEventHandler.DOUBLE_TAP)
      .callback(callback)
      .build()
  }

  /**
   * @param {function(CustomEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static tap(callback) {
    return ElementEventListenerConfigBuilder
      .listen(CustomEventHandler.TAP)
      .callback(callback)
      .build()
  }

  /**
   * @param {function(CustomEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static hold(callback) {
    return ElementEventListenerConfigBuilder
      .listen(CustomEventHandler.HOLD)
      .callback(callback)
      .build()
  }

  /**
   * @param {function(CustomEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static holdOrRight(callback) {
    return ElementEventListenerConfigBuilder
      .listen(CustomEventHandler.HOLD_OR_RIGHT)
      .callback(callback)
      .build()
  }

}
class PointerEventBuilder {

  /**
   * @param {function(PointerEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static over(callback) {
    return ElementEventListenerConfigBuilder
      .listen('pointerover')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(PointerEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static enter(callback) {
    return ElementEventListenerConfigBuilder
      .listen('pointerenter')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(PointerEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static move(callback) {
    return ElementEventListenerConfigBuilder
      .listen('pointermove')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(PointerEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static down(callback) {
    return ElementEventListenerConfigBuilder
      .listen('pointerdown')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(PointerEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static up(callback) {
    return ElementEventListenerConfigBuilder
      .listen('pointerup')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(PointerEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static cancel(callback) {
    return ElementEventListenerConfigBuilder
      .listen('pointercancel')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(PointerEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static out(callback) {
    return ElementEventListenerConfigBuilder
      .listen('pointerout')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(PointerEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static leave(callback) {
    return ElementEventListenerConfigBuilder
      .listen('pointerleave')
      .callback(callback)
      .build()
  }

}

class MouseEventBuilder {

  /**
   *
   * @param {function(MouseEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static click(callback) {
    return ElementEventListenerConfigBuilder
      .listen('click')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(MouseEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static dblclick(callback) {
    return ElementEventListenerConfigBuilder
      .listen('dblclick')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(MouseEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static mouseup(callback) {
    return ElementEventListenerConfigBuilder
      .listen('mouseup')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(MouseEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static mousedown(callback) {
    return ElementEventListenerConfigBuilder
      .listen('mousedown')
      .callback(callback)
      .build()
  }
}

class KeyboardEventBuilder {
  /**
   *
   * @param {function(KeyboardEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static keydown(callback) {
    return ElementEventListenerConfigBuilder
      .listen('keydown')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(KeyboardEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static keypress(callback) {
    return ElementEventListenerConfigBuilder
      .listen('keypress')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(KeyboardEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static keyup(callback) {
    return ElementEventListenerConfigBuilder
      .listen('keyup')
      .callback(callback)
      .build()
  }
}

class KeyKeyboardEventBuilder {
  /**
   *
   * @param {function(KeyboardEvent): boolean }condition
   */
  constructor(condition) {
    assertType(
      isFunction(condition),
      this.constructor.name + ': `condition` should be Function'
    )
    /**
     *
     * @type {function(KeyboardEvent): boolean}
     * @private
     */
    this.__condition = condition
  }

  /**
   *
   * @return {KeyKeyboardEventBuilder}
   */
  static Enter() {
    return new KeyKeyboardEventBuilder(
      event => event.key === 'Enter'
    )
  }

  /**
   *
   * @return {KeyKeyboardEventBuilder}
   */
  static Space() {
    return new KeyKeyboardEventBuilder(
      event => event.key === ' '
    )
  }

  /**
   *
   * @return {KeyKeyboardEventBuilder}
   */
  static CtrlEnter() {
    return new KeyKeyboardEventBuilder(
      event => event.ctrlKey && event.key === 'Enter'
    )
  }

  /**
   *
   * @param {function(KeyboardEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static keydown(callback) {
    return ElementEventListenerConfigBuilder
      .listen('keydown')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(KeyboardEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static keypress(callback) {
    return ElementEventListenerConfigBuilder
      .listen('keypress')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(KeyboardEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static keyup(callback) {
    return ElementEventListenerConfigBuilder
      .listen('keyup')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(KeyboardEvent)} callback
   * @return {function(KeyboardEvent)}
   * @private
   */
  __buildCallback(callback) {
    return (event) => {
      if (this.__condition(event)) {
        callback(event)
      }
    }
  }

  /**
   *
   * @param {function(KeyboardEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  keydown(callback) {
    return ElementEventListenerConfigBuilder
      .listen('keydown')
      .callback(this.__buildCallback(callback))
      .build()
  }

  /**
   *
   * @param {function(KeyboardEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  keypress(callback) {
    return ElementEventListenerConfigBuilder
      .listen('keydown')
      .callback(this.__buildCallback(callback))
      .build()
  }

  /**
   *
   * @param {function(KeyboardEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  keyup(callback) {
    return ElementEventListenerConfigBuilder
      .listen('keydown')
      .callback(this.__buildCallback(callback))
      .build()
  }
}

class DragEventBuilder {
  /**
   *
   * @param {function(DragEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static drag(callback) {
    return ElementEventListenerConfigBuilder
      .listen('drag')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(DragEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static dragend(callback) {
    return ElementEventListenerConfigBuilder
      .listen('dragend')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(DragEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static dragenter(callback) {
    return ElementEventListenerConfigBuilder
      .listen('dragenter')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(DragEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static dragexit(callback) {
    return ElementEventListenerConfigBuilder
      .listen('dragexit')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(DragEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static dragleave(callback) {
    return ElementEventListenerConfigBuilder
      .listen('dragleave')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(DragEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static dragover(callback) {
    return ElementEventListenerConfigBuilder
      .listen('dragover')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(DragEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static dragstart(callback) {
    return ElementEventListenerConfigBuilder
      .listen('dragstart')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(DragEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static drop(callback) {
    return ElementEventListenerConfigBuilder
      .listen('drop')
      .callback(callback)
      .build()
  }
}

class TouchEventBuilder {
  /**
   *
   * @param {function(TouchEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static touchstart(callback) {
    return ElementEventListenerConfigBuilder
      .listen('touchstart')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(TouchEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static touchend(callback) {
    return ElementEventListenerConfigBuilder
      .listen('touchend')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(TouchEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static touchmove(callback) {
    return ElementEventListenerConfigBuilder
      .listen('touchmove')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(TouchEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static touchcancel(callback) {
    return ElementEventListenerConfigBuilder
      .listen('touchcancel')
      .callback(callback)
      .build()
  }
}

class ElementEventBuilder {
  /**
   *
   * @param {function(Event)} callback
   * @return {ElementEventListenerConfig}
   */
  static change(callback) {
    return ElementEventListenerConfigBuilder
      .listen('change')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(Event)} callback
   * @return {ElementEventListenerConfig}
   */
  static scroll(callback) {
    return ElementEventListenerConfigBuilder
      .listen('scroll')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(Event)} callback
   * @return {ElementEventListenerConfig}
   */
  static load(callback) {
    return ElementEventListenerConfigBuilder
      .listen('load')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(InputEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static input(callback) {
    return ElementEventListenerConfigBuilder
      .listen('input')
      .callback(callback)
      .build()
  }
}

class FocusEventBuilder {
  /**
   *
   * @param {function(FocusEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static focus(callback) {
    return ElementEventListenerConfigBuilder
      .listen('focus')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(FocusEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static focusin(callback) {
    return ElementEventListenerConfigBuilder
      .listen('focusin')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(FocusEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static focusout(callback) {
    return ElementEventListenerConfigBuilder
      .listen('focusout')
      .callback(callback)
      .build()
  }

  /**
   *
   * @param {function(FocusEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static blur(callback) {
    return ElementEventListenerConfigBuilder
      .listen('blur')
      .callback(callback)
      .build()
  }
}

class ClipboardEventBuilder {
  /**
   * @param {function(ClipboardEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static copy(callback) {
    return ElementEventListenerConfigBuilder
      .listen('copy')
      .callback(callback)
      .build()
  }

  /**
   * @param {function(ClipboardEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static cut(callback) {
    return ElementEventListenerConfigBuilder
      .listen('cut')
      .callback(callback)
      .build()
  }

  /**
   * @param {function(ClipboardEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static paste(callback) {
    return ElementEventListenerConfigBuilder
      .listen('paste')
      .callback(callback)
      .build()
  }
}

class CompositionEventBuilder {
  /**
   * @param {function(CompositionEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static compositionend(callback) {
    return ElementEventListenerConfigBuilder
      .listen('compositionend')
      .callback(callback)
      .build()
  }

  /**
   * @param {function(CompositionEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static compositionstart(callback) {
    return ElementEventListenerConfigBuilder
      .listen('compositionstart')
      .callback(callback)
      .build()
  }

  /**
   * @param {function(CompositionEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static compositionupdate(callback) {
    return ElementEventListenerConfigBuilder
      .listen('compositionupdate')
      .callback(callback)
      .build()
  }
}

class BaseEventBuilder {
  /**
   * @param {function(Event)} callback
   * @return {ElementEventListenerConfig}
   */
  static cancel(callback) {
    return ElementEventListenerConfigBuilder
      .listen('cancel')
      .callback(callback)
      .build()
  }

  /**
   * @param {function(Event)} callback
   * @return {ElementEventListenerConfig}
   */
  static error(callback) {
    return ElementEventListenerConfigBuilder
      .listen('error')
      .callback(callback)
      .build()
  }

  /**
   * @param {function(Event)} callback
   * @return {ElementEventListenerConfig}
   */
  static scroll(callback) {
    return ElementEventListenerConfigBuilder
      .listen('scroll')
      .callback(callback)
      .build()
  }

  /**
   * @param {function(Event)} callback
   * @return {ElementEventListenerConfig}
   */
  static select(callback) {
    return ElementEventListenerConfigBuilder
      .listen('select')
      .callback(callback)
      .build()
  }

  /**
   * @param {function(Event)} callback
   * @return {ElementEventListenerConfig}
   */
  static wheel(callback) {
    return ElementEventListenerConfigBuilder
      .listen('wheel')
      .callback(callback)
      .build()
  }

  /**
   * @param {function(Event)} callback
   * @return {ElementEventListenerConfig}
   */
  static securitypolicyviolation(callback) {
    return ElementEventListenerConfigBuilder
      .listen('securitypolicyviolation')
      .callback(callback)
      .build()
  }
}
