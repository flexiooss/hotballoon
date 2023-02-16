import {assertType} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {FlexArray} from '@flexio-oss/js-commons-bundle/flex-types/index.js'
import {TypeCheck} from '../Types/TypeCheck.js'

/**
 * @extends {FlexArray<Action>}
 */
export class ActionDispatcherArray extends FlexArray {
  _validate(v) {
    assertType(TypeCheck.assertIsActionDispatcher(v), 'ActionDispatcherArray: input should be an ActionDispatcher')
  }
}
