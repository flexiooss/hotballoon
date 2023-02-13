import {assertType} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {FlexMap} from '@flexio-oss/js-commons-bundle/flex-types/index.js'
import {TypeCheck} from '../Types/TypeCheck.js'

/**
 * @extends {FlexMap<?StoreInterface>}
 */
export class StoreBaseMap extends FlexMap {
  _validate(v) {
    assertType(TypeCheck.isStoreBase(v), 'StoreBaseMap: input should be a StoreBase')
  }
}
