'use strict'
import {
  Dispatcher
} from './Dispatcher'

import {
  assert
} from 'flexio-jshelpers'

class Action {
  constructor(dispatcher, componentId) {
    assert(dispatcher instanceof Dispatcher,
      'hotballoon:Action:constructor "dispatcher" argument assert be an instance of Dispatcher'
    )
    assert(!!componentId,
      'hotballoon:Action:constructor "componentId" argument assert not be empty'
    )
    Object.defineProperties(this, {
      _dispatcher: {
        configurable: false,
        enumerable: false,
        value: dispatcher
      },
      _componentId: {
        configurable: false,
        enumerable: false,
        writable: false,
        value: componentId
      }
    })
  }

  /**
     * @public hub for dispatch actions
     * @param {String} type : event name
     * @param {Object} payload
     * @returns void
     */
  newAction(type, payload) {}

  /**
     * @private
     * @param {String} type : event name
     * @param {Object} payload
     * @returns void
     */
  _dispatch(type, payload) {
    this._dispatcher.dispatch(type, payload)
  }
}

export {
  Action
}
