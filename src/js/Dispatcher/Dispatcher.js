import {assertInstanceOf, isNull, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {EventHandlerBase} from '@flexio-oss/js-commons-bundle/event-handler/index.js'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_DISPATCHER} from '../Types/HasTagClassNameInterface.js'
import {EventAction} from '../Action/EventAction.js'
import {Logger} from '@flexio-oss/js-commons-bundle/hot-log/index.js';


/**
 * @description dispatcher is the events handler between Actions and componentContext
 * @extends {EventHandlerBase}
 * @implements HasTagClassNameInterface
 */
export class Dispatcher extends EventHandlerBase {
  #logger = Logger.getLogger(this.constructor.name, 'HotBalloon.Dispatcher')

  /**
   * @param {number} maxExecution
   */
  constructor(maxExecution = 100) {
    super(maxExecution)

    Object.defineProperties(this, {
      [CLASS_TAG_NAME]: {
        configurable: false,
        writable: false,
        enumerable: true,
        value: CLASS_TAG_NAME_DISPATCHER
      }
    })
  }

  /**
   * @description Ensure that a Listener already called
   * @param {String} type of Listener
   * @param {Array.<String>} ids
   */
  waitFor(type, ids) {
    if (!this.isDispatching()) {
      return
    }

    for (const listenerToken of TypeCheck.assertIsArray(ids)) {
      /**
       * @type {?DispatchExecution}
       */
      const execution = this.currentExecution()

      if (!isNull(execution)) {
        if (!execution.isHandled(listenerToken) && execution.listeners().get(listenerToken).active()) {
          this._invokeCallback(execution, listenerToken, execution.listeners().get(listenerToken).callback())
        }
      }
    }
  }

  /**
   * @param {EventListenerConfig} eventListenerConfig
   * @returns {(String|StringArray)} token
   */
  addActionListener(eventListenerConfig) {
    return this.addEventListener(eventListenerConfig)
  }

  /**
   * @param {String} event
   * @param {String} id
   * @returns void
   */
  removeActionListener(event, id) {
    this.removeEventListener(event, id)
  }

  /**
   * @param {EventAction} eventAction
   */
  dispatchAction(eventAction) {
    assertInstanceOf(eventAction, EventAction, 'EventAction')

    this.#logger.debug('ActionDispatcher dispatched : ' + eventAction.name(), eventAction)
    super.dispatch(eventAction.name(), eventAction.payload())
  }
}
