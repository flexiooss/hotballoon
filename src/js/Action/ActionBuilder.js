import {Action} from './Action'
import {ActionParams} from './ActionParams'
import {ActionTypeParam} from './ActionTypeParam'
import {UID} from '@flexio-oss/js-helpers'

/**
 * @template {TYPE}
 */
export class ActionBuilder {
  /**
   *
   * @param {PublicActionParams<TYPE>} publicActionParams
   * @return {Action<TYPE>}
   */
  static build(publicActionParams) {
    return new Action(
      new ActionParams(
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
export class PublicActionParams {
  /**
   *
   * @param {ActionTypeParam<TYPE>} actionTypeParam
   * @param {Dispatcher} dispatcher
   */
  constructor(actionTypeParam, dispatcher) {
    this._params = actionTypeParam
    this._dispatcher = dispatcher
  }

  /**
   *
   * @return {ActionTypeParam<TYPE>}
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
