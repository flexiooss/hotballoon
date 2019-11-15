import {ElementEventListenerConfigBuilder} from './ElementEventListenerConfigBuilder'
import {assertType, isFunction} from '@flexio-oss/assert'

export class UIEventBuilder {
  /**
   *
   * @return {MouseEventBuilder.}
   */
  static mouseEvent() {
    return MouseEventBuilder
  }

  /**
   *
   * @return {KeyboardEventBuilder.}
   */
  static keyboardEvent() {
    return KeyboardEventBuilder
  }

  /**
   *
   * @return {KeyKeyboardEventBuilder.}
   */
  static keyKeyboardEvent() {
    return KeyKeyboardEventBuilder
  }

  /**
   *
   * @return {FocusEventBuilder.}
   */
  static focusEvent() {
    return FocusEventBuilder
  }

  /**
   *
   * @return {DragEventBuilder.}
   */
  static dragEvent() {
    return DragEventBuilder
  }

  /**
   *
   * @return {TouchEventBuilder.}
   */
  static touchEvent() {
    return TouchEventBuilder
  }

  /**
   *
   * @return {ElementEventBuilder.}
   */
  static elementEvent() {
    return ElementEventBuilder
  }

}

class MouseEventBuilder {

  /**
   *
   * @param {function(event:MouseEvent)} callback
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
   * @param {function(event:MouseEvent)} callback
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
   * @param {function(event:MouseEvent)} callback
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
   * @param {function(event:MouseEvent)} callback
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
   * @param {function(event:KeyboardEvent)} callback
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
   * @param {function(event:KeyboardEvent)} callback
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
   * @param {function(event:KeyboardEvent)} callback
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
   * @param {function(event:KeyboardEvent): boolean }condition
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
   * @param {function(event:KeyboardEvent)} callback
   * @return {function(event:KeyboardEvent)}
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
   * @param {function(event:KeyboardEvent)} callback
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
   * @param {function(event:KeyboardEvent)} callback
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
   * @param {function(event:KeyboardEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  keyup(callback) {
    return ElementEventListenerConfigBuilder
      .listen('keydown')
      .callback(this.__buildCallback(callback))
      .build()
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
  static CtrlEnter() {
    return new KeyKeyboardEventBuilder(
      event => event.ctrlKey && event.key === 'Enter'
    )
  }

  /**
   *
   * @param {function(event:KeyboardEvent)} callback
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
   * @param {function(event:KeyboardEvent)} callback
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
   * @param {function(event:KeyboardEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static keyup(callback) {
    return ElementEventListenerConfigBuilder
      .listen('keyup')
      .callback(callback)
      .build()
  }
}

class DragEventBuilder {
  /**
   *
   * @param {function(event:DragEvent)} callback
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
   * @param {function(event:DragEvent)} callback
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
   * @param {function(event:DragEvent)} callback
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
   * @param {function(event:DragEvent)} callback
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
   * @param {function(event:DragEvent)} callback
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
   * @param {function(event:DragEvent)} callback
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
   * @param {function(event:DragEvent)} callback
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
   * @param {function(event:DragEvent)} callback
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
   * @param {function(event:TouchEvent)} callback
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
   * @param {function(event:TouchEvent)} callback
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
   * @param {function(event:TouchEvent)} callback
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
   * @param {function(event:TouchEvent)} callback
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
   * @param {function(event:Event)} callback
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
   * @param {function(event:Event)} callback
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
   * @param {function(event:Event)} callback
   * @return {ElementEventListenerConfig}
   */
  static load(callback) {
    return ElementEventListenerConfigBuilder
      .listen('load')
      .callback(callback)
      .build()
  }
}

class FocusEventBuilder {
  /**
   *
   * @param {function(event:FocusEvent)} callback
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
   * @param {function(event:FocusEvent)} callback
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
   * @param {function(event:FocusEvent)} callback
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
   * @param {function(event:FocusEvent)} callback
   * @return {ElementEventListenerConfig}
   */
  static blur(callback) {
    return ElementEventListenerConfigBuilder
      .listen('blur')
      .callback(callback)
      .build()
  }
}
