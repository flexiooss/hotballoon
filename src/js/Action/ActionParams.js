import {assertType} from '@flexio-oss/assert'
import {TypeCheck} from '../TypeCheck'
import {ActionTypeParam} from './ActionTypeParam'

/**
 * @template TYPE
 */
export class ActionParams {
  /**
   * @param {(Symbol|String)} id
   * @param {ActionTypeParam<TYPE>} actionTypeParam
   * @param {Dispatcher} dispatcher
   */
  constructor(id, actionTypeParam, dispatcher) {
    assertType(actionTypeParam instanceof ActionTypeParam,
      'hotballoon:ActionParams:constructor "actionTypeParam" should be ActionTypeParam'
    )

    assertType(TypeCheck.isDispatcher(dispatcher), 'hotballoon:ActionParams:constructor "dispatcher" argument should be a Dispatcher')

    this._id = id
    this._params = actionTypeParam
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
    return this._params.type
  }

  /**
   *
   * @return {ActionTypeParam~validatorClb<TYPE>}
   */
  get validator() {
    return this._params.validator
  }

  /**
   *
   * @return {ActionTypeParam~defaultCheckerClb<TYPE>}
   */
  get defaultChecker() {
    return this._params.defaultChecker
  }

  /**
   *
   * @return {Dispatcher}
   */
  get dispatcher() {
    return this._dispatcher
  }
}
