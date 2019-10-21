import {assert, assertType, isArray, isNull} from '@flexio-oss/assert'
import {EventHandlerBase} from '@flexio-oss/event-handler'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_DISPATCHER} from '../Types/HasTagClassNameInterface'
import {EventAction} from '../Action/EventAction'
import {LoggerInterface} from '@flexio-oss/js-logger'

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
   */
  constructor(logger) {
    super()

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
        while (!this._isHandled.has(id)) {
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
        .pushLog('ActionDispatcher dispatched : ' + eventAction.name)
        .pushLog(eventAction.payload),
      dispatcherLogOptions
    )

    super.dispatch(eventAction.name, eventAction.payload)
  }

  /**
   *
   * @return {LoggerInterface}
   */
  logger() {
    return this._logger
  }
}
