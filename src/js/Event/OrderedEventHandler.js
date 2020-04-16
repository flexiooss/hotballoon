import {OrderedEventHandler as OrderedEventHandlerBase} from '@flexio-oss/js-commons-bundle/event-handler'

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
