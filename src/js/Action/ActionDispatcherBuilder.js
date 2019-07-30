import {ActionDispatcher} from './ActionDispatcher'
import {ActionDispatcherConfig} from './ActionDispatcherConfig'
import {ActionTypeConfig} from './ActionTypeConfig'
import {UID} from '@flexio-oss/js-helpers'
import {assertType} from '@flexio-oss/assert'

/**
 * @template {TYPE}
 */
export class ActionDispatcherBuilder {
  /**
   *
   * @param {PublicActionDispatcherConfig<TYPE>} publicActionParams
   * @return {ActionDispatcher<TYPE>}
   */
  static build(publicActionParams) {

    assertType(
      publicActionParams instanceof PublicActionDispatcherConfig,
      'hotballoon:ActionDispatcherBuilder:build: `publicActionParams` should be an instance of PublicActionDispatcherConfig'
    )

    return new ActionDispatcher(
      new ActionDispatcherConfig(
        UID(publicActionParams.params.name + '_'),
        publicActionParams.params,
        publicActionParams.dispatcher
      )
    )
  }
}

/**
 * @template TYPE
 */
export class PublicActionDispatcherConfig {
  /**
   *
   * @param {ActionTypeConfig<TYPE>} actionTypeParam
   * @param {Dispatcher} dispatcher
   */
  constructor(actionTypeParam, dispatcher) {
    this._params = actionTypeParam
    this._dispatcher = dispatcher
  }

  /**
   *
   * @return {ActionTypeConfig<TYPE>}
   */
  get params() {
    return this._params
  }

  /**
   *
   * @return {Dispatcher}
   */
  get dispatcher() {
    return this._dispatcher
  }
}
