import {assertType} from '@flexio-oss/assert'
import {FlexMap} from '@flexio-oss/flex-types'
import {TypeCheck} from '../Types/TypeCheck'

/**
 * @extends {FlexMap<?ActionDispatcher>}
 */
export class ActionMap extends FlexMap {
  _validate(v) {
    assertType(TypeCheck.isActionDispatcher(v), 'ActionMap: input should be a ActionDispatcher')
  }
}
