import {StringArray} from '@flexio-oss/extended-flex-types'
import {OrderedEventHandler as OrderedEventHandlerBase} from '@flexio-oss/event-handler'

export class OrderedEventHandler extends OrderedEventHandlerBase {
  /**
   *
   * @param {OrderedEventListenerConfig} orderedEventListenerConfig
   * @return {(String|StringArray)} token
   * @throws AssertionError
   */
  on(orderedEventListenerConfig) {
    return this.addEventListener(orderedEventListenerConfig)
  }
}
