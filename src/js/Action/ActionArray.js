import {FlexArray, assertType} from 'flexio-jshelpers'
import {TypeCheck} from '../TypeCheck'

/**
 * @extends {FlexArray<Action>}
 */
export class ActionArray extends FlexArray {
  _validate(v) {
    assertType(TypeCheck.assertIsAction(v), 'ActionArray: input should be an Action')
  }
}
