import {assertType} from '@flexio-oss/assert'
import {TypeCheck} from '../Types/TypeCheck'
import {ActionTypeConfig} from './ActionTypeConfig'

/**
 * @template TYPE, TYPE_BUILDER
 */
export class ActionDispatcherConfig {
  /**
   * @param {(Symbol|String)} id
   * @param {ActionTypeConfig<TYPE, TYPE_BUILDER>} actionTypeParam
   * @param {Dispatcher} dispatcher
   */
  constructor(id, actionTypeParam, dispatcher) {

    assertType(actionTypeParam instanceof ActionTypeConfig,
      'hotballoon:ActionDispatcherConfig:constructor "actionTypeParam" should be ActionTypeConfig'
    )

    assertType(TypeCheck.isDispatcher(dispatcher), 'hotballoon:ActionDispatcherConfig:constructor "dispatcher" argument should be a Dispatcher')
    /**
     *
     * @type {Symbol|String}
     * @protected
     */
    this._id = id
    /**
     *
     * @type {ActionTypeConfig<TYPE, TYPE_BUILDER>}
     * @protected
     */
    this._params = actionTypeParam
    /**
     *
     * @type {Dispatcher}
     * @protected
     */
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
   * @return {TYPE.}
   */
  get type() {
    return this._params.type
  }

  /**
   *
   * @return {TYPE_BUILDER.}
   */
  get payloadBuilder() {
    return this._params.payloadBuilder
  }

  /**
   *
   * @return {ActionTypeConfig~validatorClb<TYPE>}
   */
  get validator() {
    return this._params.validator
  }

  /**
   *
   * @return {ActionTypeConfig~defaultCheckerClb<TYPE>}
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
