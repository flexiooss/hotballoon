import {StoreState} from './StoreState'
import {ProxyStore, _store, _mapper} from './ProxyStore'
import {_dispatch, _EventHandler} from './StoreBase'

/**
 * @implements {StoreInterface<TYPE>}
 * @implements {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @template STORE_TYPE, TYPE, TYPE_BUILDER
 */
export class OnDemandProxyStore extends ProxyStore {

  /**
   * @returns {StoreState<TYPE>} state frozen
   */
  state() {
    return new StoreState(
      this.ID(),
      this.__type__(),
      this.validateDataStore(this[_mapper](this[_store].state().data()))
    )
  }

  [_dispatch](eventType, payload = this.state()) {
    this[_EventHandler].dispatch(eventType, payload)
  }

  onceOnUpdated(clb) {
    throw new Error('not implemented yet')
  }
}
