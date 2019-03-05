import {assert, EventListenerFactory} from 'flexio-jshelpers'
import {TypeCheck} from '../TypeCheck'

/**
 * @extends {EventListenerFactory}
 */
export class DispatcherEventListenerFactory extends EventListenerFactory {
  /**
   *
   * @param {Action} action
   */
  constructor(action) {
    assert(TypeCheck.isAction(action), 'hotballoon:DispatcherEventListenerFactory:constructor: `action` argument should be an instance of Action ')
    super(action.uid)
  }

  /**
   *
   * @param {Action} action
   * @return {DispatcherEventListenerFactory}
   * @constructor
   */
  static listen(action) {
    return new this(action)
  }
}
