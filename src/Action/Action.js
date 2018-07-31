'use strict'
import {Dispatcher} from '../Dispatcher/Dispatcher'
import {assert} from 'flexio-jshelpers'
import {
  CLASS_TAG_NAME,
  CLASS_TAG_NAME_ACTION
} from '../HasTagClassNameInterface'
import {EventAction} from './EventAction'
import {ActionParams} from './ActionParams'
import {ActionPayload} from './ActionPayload'

/**
 * @class
 * @description Action is the entry point of Component
 * @implements HasTagClassNameInterface
 */
export class Action {
  /**
   *
   * @param {hotballoon:Dispatcher} dispatcher
   * @param {Class<ActionPayload>} actionPayloadClass
   */
  constructor(actionParams) {
    assert(actionParams instanceof ActionParams,
      'hotballoon:Action:constructor "actionParams" argument assert be an instance of ActionParams'
    )

    var payload = new ActionPayload()

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_ACTION
    })

    Object.defineProperties(this, {
      _name: {
        configurable: false,
        enumerable: false,
        writable: false,
        /**
         * @property {string} _name
         * @name Action#_name
         * @private
         */
        value: actionParams.name
      },
      _actionPayloadClass: {
        configurable: false,
        enumerable: false,
        writable: false,
        /**
         * @property {string} _actionPayloadClass
         * @name Action#_actionPayloadClass
         * @private
         */
        value: actionParams.actionPayloadClass
      },
      _payload: {
        configurable: false,
        enumerable: false,
        /**
         * @property {ActionPayload} _payload
         * @name Action#_payload
         * @private
         */
        get: () => payload,
        set: (v) => {
          assert(v instanceof this._actionPayloadClass,
            'hotballoon:Action:payload "payload" argument assert be an instance of _actionPayloadClass::class'
          )
          assert(v instanceof ActionPayload,
            'hotballoon:Action:payload "payload" argument assert be an instance of ActionPayload'
          )
          payload = v
        }
      }
    })
  }

  /**
   * @return {string}
   */
  get name() {
    return this._name
  }

  /**
   *
   * @param {ActionPayload} payload
   * @return {Action}
   */
  static withPayload(payload) {
    return new this().payload(payload)
  }

  /**
   *
   * @param {CLASS_TAG_NAME} instance
   * @return {boolean}
   */
  hasSameTagClassName(instance) {
    return this.testTagClassName(instance[CLASS_TAG_NAME])
  }

  /**
   *
   * @param {Symbol} tag
   * @return {boolean}
   */
  testTagClassName(tag) {
    return this[CLASS_TAG_NAME] === tag
  }

  /**
   *
   * @param {ActionPayload} payload
   * @return {Action}
   */
  payload(payload) {
    this._payload = payload
    return this
  }

  /**
   * @param {Dispatcher} dispatcher
   * @return void
   */
  dispatchWith(dispatcher) {
    assert(dispatcher instanceof Dispatcher,
      'hotballoon:Action:constructor "actionParams" argument assert be an instance of ActionParams'
    )
    dispatcher.dispatch(EventAction.create(this.name, this._payload))
  }
}
