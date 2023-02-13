import {FlexMap} from '@flexio-oss/js-commons-bundle/flex-types/index.js'
import {TypeCheck} from '../Types/TypeCheck.js'

/**
 * @extends {FlexMap<?ActionDispatcher>}
 */
export class ActionMap extends FlexMap {
  _validate(v) {
    TypeCheck.assertIsActionDispatcher(v)
  }
}
