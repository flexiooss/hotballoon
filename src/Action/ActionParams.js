import {assert, isFunction} from 'flexio-jshelpers'
import {TypeCheck} from '../TypeCheck'

/**
 * @template TYPE
 */
export class ActionParams {
  /**
   *
   * @param {Class.<TYPE>} type
   * @param {CallableFunction} validate
   * @param {Dispatcher} dispatcher
   */
  constructor(type, validate, dispatcher) {
    // TODO isClass(actionPayloadClass)
    assert(!!type,
      'hotballoon:ActionParams:constructor "type" argument should not be empty'
    )
    assert(isFunction(validate), 'hotballoon:ActionParams:constructor "validate" argument should be function')
    assert(TypeCheck.isDispatcher(dispatcher), 'hotballoon:ActionParams:constructor "dispatcher" argument should be a Dispatcher')

    this._type = type
    this._validate = validate
    this._dispatcher = dispatcher
  }

  /**
   *
   * @return {Class.<TYPE>}
   */
  get type() {
    return this._type
  }

  /**
   *
   * @return {CallableFunction}
   */
  validate(payload) {
    return this._validate(payload)
  }

  /**
   *
   * @return {Dispatcher}
   */
  get dispatcher() {
    return this._dispatcher
  }
}
