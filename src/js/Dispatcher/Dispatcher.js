import {assert, assertType, isArray} from '@flexio-oss/assert'
import {EventHandlerBase} from '@flexio-oss/event-handler'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_DISPATCHER} from '../HasTagClassNameInterface'
import {EventAction} from '../Action/EventAction'

/**
 * @class
 * @description dispatcher is the events handler between Actions and componentContext
 * @extends {EventHandlerBase}
 * @implements HasTagClassNameInterface
 */
export class Dispatcher extends EventHandlerBase {
  constructor() {
    super()
    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_DISPATCHER
    })
    console.log(this)
  }

  /**
   * @description Ensure that a Listener already called
   * @param {String} type of Listener
   * @param {Array<String>} ids
   */
  waitFor(type, ids) {
    assertType(!!this.isDispatching(),
      'hotballoon:dispatcher:waitFor: Must be invoked while dispatching.'
    )
    assertType(!!isArray(ids),
      'hotballoon:dispatcher:waitFor: `ids` argument should be Array params')
    let countOfIds = ids.length
    for (let i = 0; i < countOfIds; i++) {
      let id = ids[i]
      if (!this._isPending.has(id)) {
        assert(!this._isHandled.has(id),
          'hotballoon:dispatcher:waitFor: `id` : `%s` already handled',
          id)
        assert(this._listeners.get(type).has(id),
          'hotballoon:dispatcher:waitFor: `id` : `%s` not defined',
          id)
        this._invokeCallback(type, id)
      }
    }
  }

  /**
   *
   * @param {EventListenerParam} eventListenerParam
   * @returns {(String|StringArray)} token
   */
  addActionListener(eventListenerParam) {
    return this.addEventListener(eventListenerParam)
  }

  /**
   *
   * @param {String} event
   * @param {String} id
   * @returns void
   */
  removeActionListener(event, id) {
    this.removeEventListener(event, id)
  }

  /**
   *
   * @param {EventAction} eventAction
   */
  dispatchAction(eventAction) {
    assertType(eventAction instanceof EventAction,
      'hotballoon:dispatcher:dispatch "actionPayload" argument should be an instance of EventAction'
    )
    super.dispatch(eventAction.name, eventAction.payload)
  }
}
