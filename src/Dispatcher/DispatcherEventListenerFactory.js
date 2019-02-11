import {Action} from '../Action/Action'
import {assert, EventListenerFactory} from 'flexio-jshelpers'

/**
 * @extends {EventListenerFactory}
 */
export class DispatcherEventListenerFactory extends EventListenerFactory {
  /**
   *
   * @param {Action} action
   */
  constructor(action) {
    assert(action instanceof Action, 'hotballoon:DispatcherEventListenerFactory:constructor: `action` argument should be an instance of Action ')
    super(action.name)
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
