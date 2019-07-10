import {CLASS_TAG_NAME, CLASS_TAG_NAME_PROXYSTORE} from '../HasTagClassNameInterface'
import {StoreBase, _set} from './StoreBase'

const _store = Symbol('_store')
const _mapper = Symbol('_mapper')

/**
 * @implements {StoreInterface<TYPE>}
 * @implements {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @template STORE_TYPE, TYPE
 */
export class ProxyStore extends StoreBase {
  /**
   *
   * @param {ProxyStoreParams} proxyStoreParams
   */
  constructor(proxyStoreParams) {
    super(proxyStoreParams)

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
        value: proxyStoreParams.store
      },

      [_mapper]: {
        enumerable: false,
        configurable: false,
        /**
         * @property {ProxyStoreParams~mapperClb<TYPE>}
         * @name ProxyStore#_mapper
         * @private
         */
        value: proxyStoreParams.mapper
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
   *
   * @param {StoreState<STORE_TYPE>} payload
   * @param {string} eventType
   * @private
   */
  __mapAndUpdate(payload, eventType) {
    this[_set](this[_mapper](payload.data))
  }

}
