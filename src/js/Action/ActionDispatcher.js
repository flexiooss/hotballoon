import {assertType, isNull} from '@flexio-oss/assert'
import {UID} from '@flexio-oss/js-helpers'
import {EventAction} from './EventAction'
import {ActionDispatcherConfig} from './ActionDispatcherConfig'
import {DispatcherEventListenerConfigBuilder} from '../Dispatcher/DispatcherEventListenerConfigBuilder'
import {WithID} from '../abstract/WithID'
import {ValidationError} from '../Exception/ValidationError'
import {
  CLASS_TAG_NAME,
  CLASS_TAG_NAME_ACTION
} from '../Types/HasTagClassNameInterface'

const _actionConfig = Symbol('_actionParams')

/**
 * @implements {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @template TYPE, TYPE_BUILDER
 */
export class ActionDispatcher extends WithID {
  /**
   *
   * @param {ActionDispatcherConfig<TYPE, TYPE_BUILDER>} actionConfig
   */
  constructor(actionConfig) {
    super(UID(actionConfig.type.name + '_'))

    assertType(actionConfig instanceof ActionDispatcherConfig,
      'hotballoon:ActionDispatcher:constructor "actionConfig" argument assert be an instance of ActionDispatcherConfig'
    )

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_ACTION
    })

    Object.defineProperties(this, {
      [_actionConfig]: {
        configurable: false,
        enumerable: false,
        writable: false,
        value: actionConfig
      }

    })
  }

  /**
   *
   * @return {TYPE_BUILDER}
   */
  payloadBuilder() {
    return this[_actionConfig].type.builder()
  }

  /**
   * @param {Object} object
   * @return {TYPE_BUILDER}
   */
  payloadFromObject(object) {
    return this[_actionConfig].type.fromObject(object)
  }

  /**
   *
   * @param {TYPE} instance
   * @return {TYPE_BUILDER}
   */
  payloadFrom(instance) {
    return this[_actionConfig].type.from(instance)
  }

  /**
   *
   * @param {string} json
   * @return {TYPE_BUILDER}
   */
  payloadFromJSON(json) {
    return this[_actionConfig].type.fromJSON(json)
  }

  /**
   *
   * @return {TYPE.}
   */
  get __type__() {
    return this[_actionConfig].type
  }

  /**
   *
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    return constructor === this.__type__
  }

  /**
   * @param {TYPE} payload
   */
  dispatch(payload) {
    const data = this[_actionConfig].defaultChecker(payload)

    assertType(
      data instanceof this.__type__,
      'hotballoon:ActionDispatcher:dispatch "data" argument should be an instance of %s',
      this.__type__.name
    )

    if (!isNull(this[_actionConfig].validator) && !this[_actionConfig].validator.isValid(payload)) {
      throw new ValidationError('hotballoon:ActionDispatcher:dispatch "data" argument failed to validation')
    }

    this[_actionConfig].dispatcher.dispatchAction(
      EventAction.create(
        this.ID,
        payload
      )
    )
  }

  /**
   *
   * @param {function(payload: TYPE, type: (string|Symbol))} callback
   * @returns {String} token
   */
  listenWithCallback(callback) {
    return this[_actionConfig].dispatcher
      .addActionListener(
        DispatcherEventListenerConfigBuilder
          .listen(this)
          .callback(callback)
          .build()
      )
  }

  /**
   *
   * @param {...string} token
   */
  waitFor(...token) {
    this[_actionConfig].dispatcher.waitFor(this.ID, token)
  }
}
