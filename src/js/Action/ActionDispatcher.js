import {assertType} from '@flexio-oss/assert'
import {UID} from '@flexio-oss/js-helpers'
import {EventAction} from './EventAction'
import {ActionDispatcherConfig} from './ActionDispatcherConfig'
import {DispatcherEventListenerBuilder} from '../Dispatcher/DispatcherEventListenerBuilder'
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
   * @return {TYPE_BUILDER.}
   */
  payloadBuilder() {
    return this[_actionConfig].payloadBuilder
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

    if (!this[_actionConfig].validator(data)) {
      throw new ValidationError('hotballoon:ActionDispatcher:dispatch "data" argument failed tot validation')
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
   * @type {ActionDispatcher~eventClb<TYPE>} callback
   * @returns {String} token
   */
  listenWithCallback(callback) {
    return this[_actionConfig].dispatcher
      .addActionListener(DispatcherEventListenerBuilder
        .listen(this)
        .callback(callback)
        .build()
      )
  }

  /**
   * @template TYPE
   * @callback ActionDispatcher~eventClb
   * @param {TYPE} payload
   * @param {(string|Symbol)} type
   */
}
