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

const _actionParams = Symbol('_actionParams')

/**
 * @implements {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @template TYPE
 */
export class ActionDispatcher extends WithID {
  /**
   *
   * @param {ActionDispatcherConfig} actionParams
   */
  constructor(actionParams) {
    super(UID(actionParams.type.name + '_'))

    assertType(actionParams instanceof ActionDispatcherConfig,
      'hotballoon:ActionDispatcher:constructor "actionParams" argument assert be an instance of ActionDispatcherConfig'
    )

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_ACTION
    })

    Object.defineProperties(this, {
      [_actionParams]: {
        configurable: false,
        enumerable: false,
        writable: false,
        /**
         * @property {ActionDispatcherConfig} [_actionParams]
         * @private
         */
        value: actionParams
      }

    })
  }

  /**
   *
   * @return {Class.<TYPE>}
   */
  get __type__() {
    return this[_actionParams].type
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
    const data = this[_actionParams].defaultChecker(payload)

    assertType(
      data instanceof this.__type__,
      'hotballoon:ActionDispatcher:dispatch "data" argument should be an instance of %s',
      this.__type__.name
    )

    if (!this[_actionParams].validator(data)) {
      throw new ValidationError('hotballoon:ActionDispatcher:dispatch "data" argument failed tot validation')
    }

    this[_actionParams].dispatcher.dispatchAction(
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
    return this[_actionParams].dispatcher
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
