import {assertType} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {FlexMap} from '@flexio-oss/js-commons-bundle/flex-types/index.js'
import {TypeCheck} from '../Types/TypeCheck.js'

/**
 * @extends {FlexMap<?ComponentContext>}
 */
export class ComponentContextMap extends FlexMap {
  _validate(v) {
    assertType(TypeCheck.isComponentContext(v), 'ComponentContextMap: input should be a ComponentContext')
  }
}
