import {assertType} from '@flexio-oss/assert'
import {FlexMap} from '@flexio-oss/flex-types'
import {TypeCheck} from '../Types/TypeCheck'

/**
 * @extends {FlexMap<?Store>}
 */
export class StoreMap extends FlexMap {
  _validate(v) {
    assertType(TypeCheck.isStore(v), 'StoreMap: input should be a Store')
  }
}
