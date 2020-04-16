import {assertType, isFunction} from '@flexio-oss/js-commons-bundle/assert'
import {OrderedEventListenerConfigBuilder} from '@flexio-oss/js-commons-bundle/event-handler'

export const WILL_REMOVE = 'WILL_REMOVE'

export class ViewContainerPublicEventHandler {
  /***
   *
   * @param {ViewPublicEventHandler~subscriberClb} subscriber
   */
  constructor(subscriber) {
    assertType(isFunction(subscriber), 'ViewContainerPublicEventHandler: `subscriber` should be a function')
    /**
     *
     * @type {ViewPublicEventHandler~subscriberClb}
     * @protected
     */
    this._subscriber = subscriber
  }

  /**
   * @callback ViewContainerPublicEventHandler~subscriberClb
   * @param {OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {String} token
   */

  /**
   *
   * @param {ViewContainerPublicEventHandler~removeClb} clb
   * @return {String}
   */
  beforeRemove(clb) {
    assertType(
      isFunction(clb),
      'ViewContainerPublicEventHandler:beforeRemove: `clb` should be a function'
    )
    return this._subscriber(
      OrderedEventListenerConfigBuilder
        .listen(WILL_REMOVE)
        .callback(() => {
          clb()
        })
        .build()
    )
  }

  /**
   * @callback ViewContainerPublicEventHandler~removeClb
   */
}
