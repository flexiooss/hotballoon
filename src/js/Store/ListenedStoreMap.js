import {FlexMap} from '@flexio-oss/js-commons-bundle/flex-types/index.js'
import {assertInstanceOf} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {ListenedStore} from './ListenedStore.js'

/**
 * @extends {FlexMap<?ListenedStore>}
 */
export class ListenedStoreMap extends FlexMap {
  _validate(v) {
    assertInstanceOf(v, ListenedStore, 'ListenedStore')
  }
}
