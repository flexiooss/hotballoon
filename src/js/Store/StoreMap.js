import {FlexMap} from '@flexio-oss/js-commons-bundle/flex-types'
import {TypeCheck} from '../Types/TypeCheck'

/**
 * @extends {FlexMap<?Store>}
 */
export class StoreMap extends FlexMap {
  _validate(v) {
    TypeCheck.assertStoreBase(v)
  }
}
