import {assertType} from '@flexio-oss/js-commons-bundle/assert'
import {FlexMap} from '@flexio-oss/js-commons-bundle/flex-types'
import {TypeCheck} from '../Types/TypeCheck'

/**
 * @extends {FlexMap<?Store>}
 */
export class StoreMap extends FlexMap {
  _validate(v) {
    assertType(TypeCheck.isStore(v), 'StoreMap: input should be a Store')
  }
}
