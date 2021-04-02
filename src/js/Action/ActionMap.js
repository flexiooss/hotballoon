import {assertType} from '@flexio-oss/js-commons-bundle/assert'
import {FlexMap} from '@flexio-oss/js-commons-bundle/flex-types'
import {TypeCheck} from '../Types/TypeCheck'

/**
 * @extends {FlexMap<?ActionDispatcher>}
 */
export class ActionMap extends FlexMap {
  _validate(v) {
    TypeCheck.assertIsActionDispatcher(v)
  }
}
