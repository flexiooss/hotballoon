import {assertType} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {FlexMap} from '@flexio-oss/js-commons-bundle/flex-types/index.js'
import {TypeCheck} from '../Types/TypeCheck.js'

/**
 * @extends {FlexMap<?ViewContainerBase>}
 */
export class ViewContainerBaseMap extends FlexMap {
  _validate(v) {
    assertType(TypeCheck.isViewContainerBase(v), 'ViewContainerBaseMap: input should be a ViewContainerBase')
  }
}
