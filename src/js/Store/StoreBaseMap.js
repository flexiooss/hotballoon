import {assertType} from '@flexio-oss/assert'
import {FlexMap} from '@flexio-oss/flex-types'
import {TypeCheck} from '../Types/TypeCheck'

/**
 * @extends {FlexMap<?StoreInterface>}
 */
export class StoreBaseMap extends FlexMap {
  _validate(v) {
    assertType(TypeCheck.isStoreBase(v), 'StoreBaseMap: input should be a StoreBase')
  }
}
