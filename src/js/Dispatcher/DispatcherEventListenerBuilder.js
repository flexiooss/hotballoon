import {assertType, EventListenerBuilder} from 'flexio-jshelpers'
import {ActionArray} from '../Action/ActionArray'
import {SymbolStringArray} from '../../../../flexio-jshelpers'

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
