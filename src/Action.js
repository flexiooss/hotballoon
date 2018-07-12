'use strict'
import {Dispatcher} from './Dispatcher'
import {assert, isFunction} from 'flexio-jshelpers'
import {CoreException} from './CoreException'

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

    Object.defineProperties(this, {
      /**
       * @property {string} __HB__CLASSNAME__
       */
      '__HB__CLASSNAME__': {
        configurable: false,
        writable: false,
        enumerable: true,
        value: '__HB__ACTION__'
      },
      /**
       * @property {hotballoon:Dispatcher} _dispatcher
       * @private
       */
      _dispatcher: {
        configurable: false,
        enumerable: false,
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
      /**
       * @property {Map<string, Function>} _actions
       * @private
       */
      _actions: {
        configurable: false,
        value: _actions
      }
    })
    this._registerActions()
  }

  /**
   * Call on construct
   * @private
   */
  _registerActions() {
    throw new CoreException('_registerActions should be overiderd', 'METHOD_NOT_OVERIDED')
  }

  /**
   *
   * @param {string} type
   * @param {Function} callback
   * @private
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
    this._dispatcher.dispatch(type, payload)
  }
}

export {
  Action
}
