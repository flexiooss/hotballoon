import {assertInstanceOf} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {FlexMap} from '@flexio-oss/js-commons-bundle/flex-types/index.js'
import {ListenedAction} from './ListenedAction.js'

/**
 * @extends {FlexMap<?ListenedAction>}
 */
export class ListenedActionMap extends FlexMap {
  _validate(v) {
    assertInstanceOf(v,ListenedAction,'ListenedAction')
  }
}
