import {Action} from './Action'
import {ActionParams} from './ActionParams'
import {UID, assert, isFunction, assertType} from 'flexio-jshelpers'
import {TypeCheck} from '../TypeCheck'

/**
 * @template {TYPE}
 */
export class ActionBuilder {
  /**
   *
   * @param {PublicActionParams} publicActionParams
   * @return {Action<TYPE>}
   */
  static build(publicActionParams) {
    return new Action(
      new ActionParams(
        UID(publicActionParams.type.name + '_'),
        publicActionParams.type,
        publicActionParams.validator,
        publicActionParams.dispatcher
      )
    )
  }
}

/**
 * @template TYPE
 */
export class PublicActionParams {
  /**
   *
   * @param {Class.<TYPE>} type
   * @param {ActionParams~validatorClb<TYPE>} validator
   * @param {Dispatcher} dispatcher
   */
  constructor(type, validator, dispatcher) {
    // TODO isClass(actionPayloadClass)
    assert(!!type,
      'hotballoon:ActionParams:constructor "type" argument should not be empty'
    )
    assertType(isFunction(validator), 'hotballoon:ActionParams:constructor "validator" argument should be function')
    assertType(TypeCheck.isDispatcher(dispatcher), 'hotballoon:ActionParams:constructor "dispatcher" argument should be a Dispatcher')

    this._type = type
    this._validator = validator
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
   * @return {ActionParams~validatorClb<TYPE>}
   */
  get validator() {
    return this._validator
  }

  /**
   *
   * @return {Dispatcher}
   */
  get dispatcher() {
    return this._dispatcher
  }
}
