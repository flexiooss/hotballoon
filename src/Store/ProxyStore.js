import {EventListenerOrderedFactory} from '../Event/EventListenerOrderedFactory'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_PROXYSTORE} from '../HasTagClassNameInterface'
import {STORE_CHANGED} from './StoreInterface'
import {StoreBase, _set} from './StoreBase'

const _store = Symbol('_store')
const _mapper = Symbol('_mapper')

/**
 * @implements StoreInterface
 * @implements HasTagClassNameInterface
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
         * @type {Store<TYPE_STORE>}
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
      EventListenerOrderedFactory.listen(STORE_CHANGED)
        .callback((eventType, payload) => {
          this.__mapAndUpdate(eventType, payload)
        })
        .priority(20)
        .build(this)
    )
  }

  /**
   *
   * @param {string} eventType
   * @param {State<TYPE_STORE>} payload
   * @private
   */
  __mapAndUpdate(eventType, payload) {
    this[_set](this[_mapper](payload.data))
  }
}
