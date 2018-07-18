'use strict'
import {Dispatcher} from './Dispatcher'
import {assert, isFunction, deepFreezeSeal} from 'flexio-jshelpers'
import {CoreException} from './CoreException'
import {CLASS_TAG_NAME} from './CLASS_TAG_NAME'

export const CLASS_TAG_NAME_ACTION = Symbol('__HB__ACTION__')

/**
 * @class
 * @description Action is the entry point of Component
 */
class Action {
  /**
   *
   * @param {hotballoon:Dispatcher} dispatcher
   * @param {string} componentId
   */
  constructor(dispatcher, componentId) {
    assert(dispatcher instanceof Dispatcher,
      'hotballoon:Action:constructor "dispatcher" argument assert be an instance of Dispatcher'
    )
    assert(!!componentId,
      'hotballoon:Action:constructor "componentId" argument assert not be empty'
    )
    const _actions = new Map()

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_ACTION
    })

    Object.defineProperties(this, {
      _dispatcher: {
        configurable: false,
        enumerable: false,
        /**
         * @property {hotballoon:Dispatcher} _dispatcher
         * @name Action#_dispatcher
         * @private
         */
        value: dispatcher
      },
      /**
       * @property {string} _componentId
       * @private
       */
      _componentId: {
        configurable: false,
        enumerable: false,
        writable: false,
        value: componentId
      },
      _actions: {
        configurable: false,
        /**
         * @property {Map<string, Function>} _actions
         * @name Action#_actions
         * @private
         */
        value: _actions
      }
    })
    this._registerActions()
  }

  /**
   * Call on construct
   * @protected
   */
  _registerActions() {
    throw new CoreException('_registerActions should be override', 'METHOD_NOT_OVERRIDE')
  }

  /**
   *
   * @param {string} type
   * @param {Function} callback
   * @protected
   */
  _registerAction(type, callback = (payload) => {
    return {
      payload: payload
    }
  }) {
    this._actions.set(type, callback)
  }

  /**
   * hub for dispatch actions
   * @public
   * @param {String} type : event name
   * @param {Object} payload
   * @return void
   */
  trigger(type, payload) {
    assert(this._actions.has(type),
      'hotballoon:Action:trigger "type" : `%s` of _actions not registered',
      type
    )
    const action = this._actions.get(type)
    assert(isFunction(action),
      'hotballoon:Action:trigger "type" : `%s` of _actions should be an instance of function',
      type
    )
    const finalPayload = action(payload)
    assert(!('type' in finalPayload),
      'hotballoon:Action:trigger "type" property of payload is reserved'
    )

    finalPayload.type = type
    this._dispatch(type, finalPayload)
  }

  /**
   * @private
   * @param {String} type : event name
   * @param {Object} payload
   * @return void
   */
  _dispatch(type, payload) {
    this._dispatcher.dispatch(type, deepFreezeSeal(payload))
  }
}

export {
  Action
}
