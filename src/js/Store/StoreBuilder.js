import {Store} from './Store'
import {StoreConfig} from './StoreConfig'
import {InMemoryStorage} from './Storage/InMemoryStorage'
import {StoreState} from './StoreState'
import {ProxyStore} from './ProxyStore'
import {ProxyStoreConfig} from './ProxyStoreConfig'
import {UID} from '@flexio-oss/js-helpers'

/**
 * @template TYPE, TYPE_BUILDER
 */
export class StoreBuilder {
  /**
   * @param {InMemoryConfig<TYPE, TYPE_BUILDER>} inMemoryConfig
   * @return {Store<TYPE>}
   */
  static InMemory(inMemoryConfig) {

    const id = UID(inMemoryConfig.storeTypeConfig.type.name + '_')

    return new Store(
      new StoreConfig(
        id,
        inMemoryConfig.storeTypeConfig,
        new InMemoryStorage(
          inMemoryConfig.storeTypeConfig.type,
          new StoreState(
            id,
            inMemoryConfig.storeTypeConfig.type,
            inMemoryConfig.initialData
          )
        )
      )
    )
  }

  /**
   * @param {ProxyConfig<STORE_TYPE, TYPE, TYPE_BUILDER>} proxyConfig
   * @return {ProxyStore<TYPE>}
   * @template STORE_TYPE, TYPE, TYPE_BUILDER
   */
  static Proxy(proxyConfig) {

    const id = UID(proxyConfig.typeParameter.type.name + '_')

    return new ProxyStore(
      new ProxyStoreConfig(
        id,
        proxyConfig.store,
        proxyConfig.typeParameter,
        proxyConfig.mapper,
        new InMemoryStorage(
          proxyConfig.typeParameter.type,
          new StoreState(
            id,
            proxyConfig.typeParameter.type,
            proxyConfig.initialData
          )
        )
      )
    )
  }
}

/**
 * @template TYPE, TYPE_BUILDER
 */
export class InMemoryConfig {
  /**
   * @param {StoreTypeConfig<TYPE, TYPE_BUILDER>} storeTypeConfig
   * @param {TYPE} initialData
   */
  constructor(storeTypeConfig, initialData) {
    this._storeTypeConfig = storeTypeConfig
    this._initialData = initialData
  }

  /**
   *
   * @return {StoreTypeConfig<TYPE, TYPE_BUILDER>}
   */
  get storeTypeConfig() {
    return this._storeTypeConfig
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
 * @template  STORE_TYPE, TYPE, TYPE_BUILDER
 */
export class ProxyConfig extends InMemoryConfig {
  /**
   * @param {StoreTypeConfig<TYPE, TYPE_BUILDER>} storeTypeConfig
   * @param {StoreInterface<STORE_TYPE>} store
   * @param {ProxyStoreConfig~mapperClb<STORE_TYPE, TYPE>} mapper
   */
  constructor(storeTypeConfig, store, mapper) {
    super(storeTypeConfig, mapper(store.state().data))
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
   * @return {ProxyStoreConfig~mapperClb<STORE_TYPE, TYPE>}
   */
  get mapper() {
    return this._mapper
  }
}
