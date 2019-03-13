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
        inMemoryParams.dataValidate,
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
        proxyParams.dataValidate,
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
   * @param {Class.<TYPE>} type
   * @param {Function} dataValidate
   * @param {TYPE} initialData
   */
  constructor(type, dataValidate, initialData) {
    this._type = type
    this._dataValidate = dataValidate
    this._initialData = initialData
  }

  /**
   *
   * @return {Class<TYPE>}
   */
  get type() {
    return this._type
  }

  /**
   *
   * @return {Function}
   */
  get dataValidate() {
    return this._dataValidate
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
   * @param {Class<TYPE>} type
   * @param {Function} dataValidate
   * @param {StoreInterface<STORE_TYPE>} store
   * @param {Function} mapper
   */
  constructor(type, dataValidate, store, mapper) {
    super(type, dataValidate, mapper(store.state().data))
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
