import {assertType} from '@flexio-oss/js-commons-bundle/assert'
import {FlexMap} from '@flexio-oss/js-commons-bundle/flex-types'
import {TypeCheck} from '../Types/TypeCheck'

/**
 * @extends {FlexMap<?ComponentContext>}
 */
export class ComponentContextMap extends FlexMap {
  _validate(v) {
    assertType(TypeCheck.isComponentContext(v), 'ComponentContextMap: input should be a ComponentContext')
  }
}
