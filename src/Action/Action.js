'use strict'
import {assert} from 'flexio-jshelpers'
import {
  CLASS_TAG_NAME,
  CLASS_TAG_NAME_ACTION
} from '../HasTagClassNameInterface'
import {EventAction} from './EventAction'
import {ActionParams} from './ActionParams'
import {DispatcherEventListenerFactory} from '../Dispatcher/DispatcherEventListenerFactory'


const _uid = Symbol('_uid')
const _actionParams = Symbol('_actionParams')

/**
 * @implements HasTagClassNameInterface
 * @template TYPE
 */
export class Action {
  /**
   *
   * @param {ActionParams} actionParams
   */
  constructor(actionParams) {
    assert(actionParams instanceof ActionParams,
      'hotballoon:Action:constructor "actionParams" argument assert be an instance of ActionParams'
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
         * @property {ActionParams} [_actionParams]
         * @private
         */
        value: actionParams
      },
      [_uid]: {
        configurable: false,
        enumerable: false,
        writable: false,
        /**
         * @property {Symbol} _name
         * @name Action#_uid
         * @private
         */
        value: Symbol(actionParams.name)
      }
    })
  }

  /**
   * @return {string}
   */
  get name() {
    return this[_actionParams].name
  }

  /**
   *
   * @return {Symbol}
   */
  get uid() {
    return this[_uid]
  }

  /**
   *
   * @return {Class.<TYPE>}
   */
  get type() {
    return this[_actionParams].type
  }

  /**
   * @param {TYPE} payload
   * @return void
   */
  dispatch(payload) {
    assert(
      this[_actionParams].validate(payload),
      'hotballoon:Action:dispatchPayload "payload" argument assert not validated'
    )

    this[_actionParams].dispatcher.dispatch(
      EventAction.create(
        this.uid,
        payload)
    )
  }

  /**
   *
   * @param {EventListenerParam} callback
   * @returns {String} token
   */
  listenWithCallback(callback) {
    return this[_actionParams].dispatcher
      .addActionListener(DispatcherEventListenerFactory
        .listen(this)
        .callback(callback)
        .build()
      )
  }
}
