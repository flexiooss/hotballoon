import {FlexMap} from '@flexio-oss/js-commons-bundle/flex-types/index.js'
import {TypeCheck} from '../Types/TypeCheck.js'

/**
 * @extends {FlexMap<?Store>}
 */
export class StoreMap extends FlexMap {
  _validate(v) {
    TypeCheck.assertStoreBase(v)
  }
}
