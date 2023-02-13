import {assertType} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {FlexMap} from '@flexio-oss/js-commons-bundle/flex-types/index.js'
import {TypeCheck} from '../Types/TypeCheck.js'

/**
 * @extends {FlexMap<?ViewContainer>}
 */
export class ViewContainerMap extends FlexMap {
  _validate(v) {
    assertType(TypeCheck.isViewContainer(v), 'ViewContainerMap: input should be a ViewContainer')
  }
}
