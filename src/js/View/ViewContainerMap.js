import {assertType} from '@flexio-oss/js-commons-bundle/assert'
import {FlexMap} from '@flexio-oss/js-commons-bundle/flex-types'
import {TypeCheck} from '../Types/TypeCheck'

/**
 * @extends {FlexMap<?ViewContainer>}
 */
export class ViewContainerMap extends FlexMap {
  _validate(v) {
    assertType(TypeCheck.isViewContainer(v), 'ViewContainerMap: input should be a ViewContainer')
  }
}
