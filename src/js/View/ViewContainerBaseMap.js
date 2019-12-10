import {assertType} from '@flexio-oss/assert'
import {FlexMap} from '@flexio-oss/flex-types'
import {TypeCheck} from '../Types/TypeCheck'

/**
 * @extends {FlexMap<?ViewContainerBase>}
 */
export class ViewContainerBaseMap extends FlexMap {
  _validate(v) {
    assertType(TypeCheck.isViewContainerBase(v), 'ViewContainerBaseMap: input should be a ViewContainerBase')
  }
}
