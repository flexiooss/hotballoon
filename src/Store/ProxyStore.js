import {EventListenerOrderedBuilder} from '../Event/EventListenerOrderedBuilder'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_PROXYSTORE} from '../HasTagClassNameInterface'
import {STORE_CHANGED} from './StoreInterface'
import {StoreBase, _set} from './StoreBase'

const _store = Symbol('_store')
const _mapper = Symbol('_mapper')

/**
 * @implements {StoreInterface<TYPE>}
 * @implements {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @template TYPE_STORE, TYPE
 */
export class ProxyStore extends StoreBase {
  /**
   *
   * @param {ProxyStoreParams} proxyStoreParams
   */
  constructor(proxyStoreParams) {
    super(proxyStoreParams)

    this.debug.color = 'magenta'

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
         * @type {StoreInterface<TYPE_STORE>}
         * @name ProxyStore#_Store
         * @private
         */
        value: proxyStoreParams.store
      },

      [_mapper]: {
        enumerable: false,
        configurable: false,
        /**
         * @property {Function}
         * @name ProxyStore#_mapper
         * @private
         */
        value: proxyStoreParams.mapper
      }

    })

    this.__subscribeToStore()
  }

  __subscribeToStore() {
    this[_store].subscribe(
      EventListenerOrderedBuilder.listen(STORE_CHANGED)
        .callback((payload, eventType) => {
          this.__mapAndUpdate(payload, eventType)
        })
        .priority(20)
        .build(this)
    )
  }

  /**
   *
   * @param {StoreState<TYPE_STORE>} payload
   * @param {string} eventType
   * @private
   */
  __mapAndUpdate(payload, eventType) {
    this[_set](this[_mapper](payload.data))
  }
}
