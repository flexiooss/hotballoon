import {assertType} from '@flexio-oss/assert'
import {SymbolStringArray} from '@flexio-oss/extended-flex-types'
import {EventListenerConfigBuilder} from '@flexio-oss/event-handler'
import {ActionDispatcherArray} from '../Action/ActionDispatcherArray'

export class DispatcherEventListenerConfigBuilder extends EventListenerConfigBuilder {
  /**
   *
   * @param {ActionDispatcherArray} actions
   */
  constructor(actions) {
    assertType(actions instanceof ActionDispatcherArray, 'hotballoon:DispatcherEventListenerFactory:constructor: `actions` argument should be an instance of ActionDispatcherArray ')
    super(actions.mapTo(new SymbolStringArray(), action => action.ID()))
  }

  /**
   *
   * @param {...ActionDispatcher} action
   * @return {DispatcherEventListenerConfigBuilder}
   * @constructor
   */
  static listen(...action) {
    return new this(new ActionDispatcherArray(...action))
  }
}
