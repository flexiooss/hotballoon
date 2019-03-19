import {assertType, isFunction} from 'flexio-jshelpers'
import {TypeCheck} from '../TypeCheck'

/**
 * @template TYPE
 */
export class ActionParams {
  /**
   *
   * @param {(Symbol|String)} id
   * @param {Class.<TYPE>} type
   * @param {ActionParams~validatorClb<TYPE>} validator
   * @param {Dispatcher} dispatcher
   */
  constructor(id, type, validator, dispatcher) {
    // TODO isClass(actionPayloadClass)
    assertType(!!type,
      'hotballoon:ActionParams:constructor "type" argument should not be empty'
    )
    assertType(isFunction(validator), 'hotballoon:ActionParams:constructor "validator" argument should be function')
    assertType(TypeCheck.isDispatcher(dispatcher), 'hotballoon:ActionParams:constructor "dispatcher" argument should be a Dispatcher')

    this._id = id
    this._type = type
    this._validator = validator
    this._dispatcher = dispatcher
  }

  /**
   *
   * @return {(symbol|String)}
   */
  get id() {
    return this._id
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
   * @return {ActionParams~validatorClb<TYPE>}
   */
  validate(payload) {
    return this._validator(payload)
  }

  /**
   * @template TYPE
   * @callback ActionParams~validatorClb
   * @param {TYPE} v
   * @return {boolean}
   */

  /**
   *
   * @return {Dispatcher}
   */
  get dispatcher() {
    return this._dispatcher
  }
}
