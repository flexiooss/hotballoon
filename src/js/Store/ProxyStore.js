import {CLASS_TAG_NAME, CLASS_TAG_NAME_PROXYSTORE} from '../Types/HasTagClassNameInterface'
import {_set, StoreBase} from './StoreBase'
import {StoreBaseConfig} from './StoreBaseConfig'
import {assertType} from '@flexio-oss/js-commons-bundle/assert'
import {ProxyStoreConfig} from './ProxyStoreConfig'
import {StoreState} from './StoreState'

export const _store = Symbol('_store')
export const _mapper = Symbol('_mapper')

/**
 * @implements {StoreInterface<TYPE>}
 * @implements {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @template STORE_TYPE, TYPE, TYPE_BUILDER
 */
export class ProxyStore extends StoreBase {
  /**
   * @param {ProxyStoreConfig<STORE_TYPE, TYPE, TYPE_BUILDER>} proxyStoreConfig
   */
  constructor(proxyStoreConfig) {
    super(
      new StoreBaseConfig(
        proxyStoreConfig.id(),
        proxyStoreConfig.initialData(),
        proxyStoreConfig.storeTypeConfig(),
        proxyStoreConfig.storage()
      )
    )

    assertType(
      proxyStoreConfig instanceof ProxyStoreConfig,
      '`proxyStoreConfig` argument should be a ProxyStoreConfig'
    )

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_PROXYSTORE
    })

    Object.defineProperties(this, {

      [_store]: {
        enumerable: false,
        configurable: false,
        /**
         * @params {StoreInterface<STORE_TYPE>}
         * @name ProxyStore#_Store
         * @private
         */
        value: proxyStoreConfig.store()
      },

      [_mapper]: {
        enumerable: false,
        configurable: false,
        /**
         * @property {ProxyStoreConfig~mapperClb<STORE_TYPE, TYPE>}
         * @name ProxyStore#_mapper
         * @private
         */
        value: proxyStoreConfig.mapper()
      }

    })
    if (this[_store].hasOwnProperty('logger')) {
      this.setLogger(this[_store].logger())
    }

    this.__subscribeToStore()
  }

  __subscribeToStore() {
    this[_store].listenChanged(
      (payload, eventType) => {
        this.__mapAndUpdate(payload, eventType)
      }
    )
  }

  /**
   * @param {StoreState<STORE_TYPE>} payload
   * @param {string} eventType
   * @private
   */
  __mapAndUpdate(payload, eventType) {
    this[_set](this[_mapper](payload.data()))
  }
}
