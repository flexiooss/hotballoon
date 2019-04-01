import {assert, EventListenerBuilder} from 'flexio-jshelpers'
import {TypeCheck} from '../TypeCheck'

/**
 * @extends {EventListenerBuilder}
 */
export class DispatcherEventListenerBuilder extends EventListenerBuilder {
  /**
   *
   * @param {Action} action
   */
  constructor(action) {
    assert(TypeCheck.isAction(action), 'hotballoon:DispatcherEventListenerFactory:constructor: `action` argument should be an instance of Action ')
    super(action.ID)
  }

  /**
   *
   * @param {Action} action
   * @return {DispatcherEventListenerBuilder}
   * @constructor
   */
  static listen(action) {
    return new this(action)
  }
}
