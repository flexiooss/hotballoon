import {assertInstanceOf} from '@flexio-oss/js-commons-bundle/assert'
import {FlexMap} from '@flexio-oss/js-commons-bundle/flex-types'
import {ListenedAction} from './ListenedAction'

/**
 * @extends {FlexMap<?ListenedAction>}
 */
export class ListenedActionMap extends FlexMap {
  _validate(v) {
    assertInstanceOf(v,ListenedAction,'ListenedAction')
  }
}
