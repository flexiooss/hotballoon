import {Action} from './Action'
import {ActionParams} from './ActionParams'
import {UID, assert, isFunction} from 'flexio-jshelpers'
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
        publicActionParams.validate,
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
  get validate() {
    return this._validate
  }

  /**
   *
   * @return {Dispatcher}
   */
  get dispatcher() {
    return this._dispatcher
  }
}
