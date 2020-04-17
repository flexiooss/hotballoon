import {assert, assertType, isArray, isNull} from '@flexio-oss/js-commons-bundle/assert'
import {EventHandlerBase} from '@flexio-oss/js-commons-bundle/event-handler'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_DISPATCHER} from '../Types/HasTagClassNameInterface'
import {EventAction} from '../Action/EventAction'
import {LoggerInterface} from '@flexio-oss/js-commons-bundle/js-logger'


const dispatcherLogOptions = {
  color: 'pink',
  titleSize: 2
}


/**
 * @class
 * @description dispatcher is the events handler between Actions and componentContext
 * @extends {EventHandlerBase}
 * @implements HasTagClassNameInterface
 */
export class Dispatcher extends EventHandlerBase {
  /**
   * @param {LoggerInterface} logger
   * @param {number} maxExecution
   */
  constructor(logger, maxExecution = 100) {
    super(maxExecution)

    assertType(logger instanceof LoggerInterface,
      'hotballoon:Dispatcher:constructor: `logger` argument should be an instance of LoggerInterface'
    )

    Object.defineProperties(this, {
      [CLASS_TAG_NAME]: {
        configurable: false,
        writable: false,
        enumerable: true,
        value: CLASS_TAG_NAME_DISPATCHER
      },
      _logger: {
        configurable: false,
        enumerable: true,
        /**
         * @name Dispatcher#_logger
         * @protected
         */
        get: () => logger,
        set: (v) => {
          assert(isNull(logger), 'hotballoon:' + this.constructor.name + ':constructor: `logger` already set')
          logger = v
        }
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

    assertType(
      !!isArray(ids),
      'hotballoon:dispatcher:waitFor: `ids` argument should be Array params'
    )

    for (const listenerToken of ids) {
      /**
       *
       * @type {?DispatchExecution}
       */
      const execution = this.currentExecution()

      if (!isNull(execution)) {
        if (!execution.isHandled(listenerToken)) {

          this._invokeCallback(execution, listenerToken, execution.listeners().get(listenerToken).callback)
        }

      }
    }
  }

  /**
   *
   * @param {EventListenerConfig} eventListenerConfig
   * @returns {(String|StringArray)} token
   */
  addActionListener(eventListenerConfig) {
    return this.addEventListener(eventListenerConfig)
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

    this.logger().log(
      this.logger().builder()
        .info()
        .pushLog('ActionDispatcher dispatched : ' + eventAction.name())
        .pushLog(eventAction.payload()),
      dispatcherLogOptions
    )

    super.dispatch(eventAction.name(), eventAction.payload())
  }

  /**
   *
   * @return {LoggerInterface}
   */
  logger() {
    return this._logger
  }
}
