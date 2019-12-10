import {assertType} from '@flexio-oss/assert'
import {FlexArray} from '@flexio-oss/flex-types'
import {TypeCheck} from '../Types/TypeCheck'

/**
 * @extends {FlexArray<Action>}
 */
export class ActionDispatcherArray extends FlexArray {
  _validate(v) {
    assertType(TypeCheck.assertIsActionDispatcher(v), 'ActionDispatcherArray: input should be an ActionDispatcher')
  }
}
