import {assertType} from '@flexio-oss/assert'
import {SymbolStringArray} from '@flexio-oss/extended-flex-types'
import {EventListenerBuilder} from '@flexio-oss/event-handler'
import {ActionArray} from '../Action/ActionArray'

/**
 * @extends {EventListenerBuilder}
 */
export class DispatcherEventListenerBuilder extends EventListenerBuilder {
  /**
   *
   * @param {ActionArray} actions
   */
  constructor(actions) {
    assertType(actions instanceof ActionArray, 'hotballoon:DispatcherEventListenerFactory:constructor: `actions` argument should be an instance of ActionArray ')
    super(actions.mapTo(new SymbolStringArray(), action => action.ID))
  }

  /**
   *
   * @param {Action} action
   * @return {DispatcherEventListenerBuilder}
   * @constructor
   */
  static listen(...action) {
    return new this(new ActionArray(...action))
  }
}
