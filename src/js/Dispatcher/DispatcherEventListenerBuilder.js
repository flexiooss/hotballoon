import {assertType} from '@flexio-oss/assert'
import {SymbolStringArray} from '@flexio-oss/extended-flex-types'
import {EventListenerBuilder} from '@flexio-oss/event-handler'
import {ActionDispatcherArray} from '../Action/ActionDispatcherArray'

/**
 * @extends {EventListenerBuilder}
 */
export class DispatcherEventListenerBuilder extends EventListenerBuilder {
  /**
   *
   * @param {ActionDispatcherArray} actions
   */
  constructor(actions) {
    assertType(actions instanceof ActionDispatcherArray, 'hotballoon:DispatcherEventListenerFactory:constructor: `actions` argument should be an instance of ActionDispatcherArray ')
    super(actions.mapTo(new SymbolStringArray(), action => action.ID))
  }

  /**
   *
   * @param {...ActionDispatcher} action
   * @return {DispatcherEventListenerBuilder}
   * @constructor
   */
  static listen(...action) {
    return new this(new ActionDispatcherArray(...action))
  }
}
