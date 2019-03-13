'use strict'
import {assert, UID} from 'flexio-jshelpers'
import {
  CLASS_TAG_NAME,
  CLASS_TAG_NAME_ACTION
} from '../HasTagClassNameInterface'
import {EventAction} from './EventAction'
import {ActionParams} from './ActionParams'
import {DispatcherEventListenerBuilder} from '../Dispatcher/DispatcherEventListenerBuilder'
import {WithIDBase} from '../bases/WithIDBase'

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

    assert(actionParams instanceof ActionParams,
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
    assert(
      payload instanceof this.__type__,
      'hotballoon:Action:dispatchPayload "payload" argument should be an instance of %s',
      this.__type__.name
    )
    assert(
      this[_actionParams].validate(payload),
      'hotballoon:Action:dispatchPayload "payload" argument assert not validated'
    )
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
   * @param {Function} callback
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
