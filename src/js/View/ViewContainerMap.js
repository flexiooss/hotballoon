import {assertType} from '@flexio-oss/assert'
import {FlexMap} from '@flexio-oss/flex-types'
import {TypeCheck} from '../TypeCheck'

/**
 * @extends {FlexMap<?ViewContainer>}
 */
export class ViewContainerMap extends FlexMap {
  _validate(v) {
    assertType(TypeCheck.isViewContainer(v), 'StoreMap: input should be a ViewContainer')
  }
}