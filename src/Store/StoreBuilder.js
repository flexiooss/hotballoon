import {Store} from './Store'
import {StoreParams} from './StoreParams'
import {InMemoryStorage} from './Storage/InMemoryStorage'
import {StoreState} from './StoreState'
import {ProxyStore} from './ProxyStore'
import {ProxyStoreParams} from './ProxyStoreParams'
import {UID} from 'flexio-jshelpers'

/**
 * @template TYPE
 */
export class StoreBuilder {
  /**
   * @param {InMemoryParams<TYPE>} inMemoryParams
   * @return {Store<TYPE>}
   */
  static InMemory(inMemoryParams) {
    const id = UID(inMemoryParams.type.name + '_')
    return new Store(
      new StoreParams(
        id,
        inMemoryParams.type,
        inMemoryParams.validator,
        new InMemoryStorage(
          inMemoryParams.type,
          new StoreState(id, inMemoryParams.type, inMemoryParams.initialData)
        )
      )
    )
  }

  /**
   * @param {ProxyParams<TYPE>} proxyParams
   * @return {ProxyStore<TYPE>}
   */
  static Proxy(proxyParams) {
    const id = UID(proxyParams.type.name + '_')
    return new ProxyStore(
      new ProxyStoreParams(
        id,
        proxyParams.type,
        proxyParams.validator,
        proxyParams.store,
        proxyParams.mapper,
        new InMemoryStorage(
          proxyParams.type,
          new StoreState(id, proxyParams.type, proxyParams.mapper(proxyParams.store.state().data))
        )
      )
    )
  }
}

/**
 * @template TYPE
 */
export class InMemoryParams {
  /**
   * @param {TypeParameter<TYPE>} typeParameter
   * @param {TYPE} initialData
   */
  constructor(typeParameter, initialData) {
    this._typeParameter = typeParameter
    this._initialData = initialData
  }

  /**
   *
   * @return {TypeParameter<TYPE>}
   */
  get typeParameter() {
    return this._typeParameter
  }

  /**
   *
   * @return {TYPE}
   */
  get initialData() {
    return this._initialData
  }
}

/**
 * @template TYPE, STORE_TYPE
 */
export class ProxyParams extends InMemoryParams {
  /**
   * @param {TypeParameter<TYPE>} typeParameter
   * @param {StoreInterface<STORE_TYPE>} store
   * @param {Function} mapper
   */
  constructor(typeParameter, store, mapper) {
    super(typeParameter, mapper(store.state().data))
    this._store = store
    this._mapper = mapper
  }

  /**
   *
   * @return {StoreInterface<STORE_TYPE>}
   */
  get store() {
    return this._store
  }

  /**
   *
   * @return {Function}
   */
  get mapper() {
    return this._mapper
  }
}
