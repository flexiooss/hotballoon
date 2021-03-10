import {FlexMap} from '@flexio-oss/js-commons-bundle/flex-types'
import {assertInstanceOf} from '@flexio-oss/js-commons-bundle/assert'
import {ListenedStore} from './ListenedStore'

/**
 * @extends {FlexMap<?ListenedStore>}
 */
export class ListenedStoreMap extends FlexMap {
  _validate(v) {
    assertInstanceOf(v, ListenedStore, 'ListenedStore')
  }
}
