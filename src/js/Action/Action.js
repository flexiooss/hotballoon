'use strict'
import {assert, assertType, UID} from 'flexio-jshelpers'
import {
  CLASS_TAG_NAME,
  CLASS_TAG_NAME_ACTION
} from '../HasTagClassNameInterface'
import {EventAction} from './EventAction'
import {ActionParams} from './ActionParams'
import {DispatcherEventListenerBuilder} from '../Dispatcher/DispatcherEventListenerBuilder'
import {WithIDBase} from '../bases/WithIDBase'
import {ValidationError} from '../Exception/ValidationError'

const _actionParams = Symbol('_actionParams')

/**
 * @implements {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @template TYPE
 */
export class Action extends WithIDBase {
  /**
   *
   * @param {ActionParams} actionParams
   */
  constructor(actionParams) {
    super(UID(actionParams.type.name + '_'))

    assertType(actionParams instanceof ActionParams,
      'hotballoon:Action:constructor "actionParams" argument assert be an instance of ActionParams'
    )

    this.debug.color = 'sandDark'

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
         * @property {ActionParams} [_actionParams]
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
      'hotballoon:Action:dispatch "data" argument should be an instance of %s',
      this.__type__.name
    )

    if (!this[_actionParams].validator(data)) {
      throw new ValidationError('hotballoon:Action:dispatch "data" argument failed tot validation')
    }

    this.debug.log('Action dispatch : ' + this.ID).size(1).background()
    this.debug.object(payload)
    this.debug.print()

    this[_actionParams].dispatcher.dispatchAction(
      EventAction.create(
        this.ID,
        payload
      )
    )
  }

  /**
   *
   * @type {EventHandlerBase~eventClb} callback
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
}
