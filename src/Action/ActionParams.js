import {assert, isFunction, isPrimitive} from 'flexio-jshelpers'
import {TypeCheck} from '../TypeCheck'

/**
 * @template TYPE
 */
export class ActionParams {
  /**
   *
   * @param {string} name
   * @param {Class.<TYPE>} type
   * @param {CallableFunction} validate
   * @param {Dispatcher} dispatcher
   */
  constructor(name, type, validate, dispatcher) {
    assert(!!name && isPrimitive(name),
      'hotballoon:ActionParams:constructor "name" argument should not be empty'
    )
    // TODO isClass(actionPayloadClass)
    assert(!!type,
      'hotballoon:ActionParams:constructor "type" argument should not be empty'
    )
    assert(isFunction(validate), 'hotballoon:ActionParams:constructor "validate" argument should be function')
    assert(TypeCheck.isDispatcher(dispatcher), 'hotballoon:ActionParams:constructor "dispatcher" argument should be a Dispatcher')

    this._name = name
    this._type = type
    this._validate = validate
    this._dispatcher = dispatcher
  }

  /**
   *
   * @return {string}
   */
  get name() {
    return this._name
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
