import {assertType} from '@flexio-oss/js-commons-bundle/assert'
import {FlexArray} from '@flexio-oss/js-commons-bundle/flex-types'
import {TypeCheck} from '../Types/TypeCheck'

/**
 * @extends {FlexArray<Action>}
 */
export class ActionDispatcherArray extends FlexArray {
  _validate(v) {
    assertType(TypeCheck.assertIsActionDispatcher(v), 'ActionDispatcherArray: input should be an ActionDispatcher')
  }
}
