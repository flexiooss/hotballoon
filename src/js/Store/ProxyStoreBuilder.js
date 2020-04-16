import {UID} from '@flexio-oss/js-commons-bundle/js-helpers'
import {InMemoryStorage} from './Storage/InMemoryStorage'
import {StoreState} from './StoreState'
import {StoreTypeConfig} from './StoreTypeConfig'
import {ProxyStore} from './ProxyStore'
import {ProxyStoreConfig} from './ProxyStoreConfig'

/**
 *
 * @template  STORE_TYPE, STORE_TYPE_BUILDER,  TYPE, TYPE_BUILDER
 */
export class ProxyStoreBuilder {
  constructor() {
    /**
     *
     * @type {?StoreInterface<STORE_TYPE>}
     * @private
     */
    this.__store = null

    /**
     *
     * @type {?TYPE.}
     * @private
     */
    this.__type = null

    /**
     *
     * @type  {?ValueObjectValidator}
     * @private
     */
    this.__validator = null
    /**
     *
     * @type {StoreTypeConfig~defaultCheckerClb<TYPE>}
     * @private
     */
    this.__defaultChecker = v => v

    /**
     *
     * @type {?function(state: STORE_TYPE ):TYPE} mapper
     * @private
     */
    this.__mapper = null
  }

  /**
   *
   * @param {StoreInterface<STORE_TYPE, STORE_TYPE_BUILDER>} store
   * @return {ProxyStoreBuilder}
   */
  store(store) {
    this.__store = store
    return this
  }

  /**
   *
   * @param {function(state: STORE_TYPE ):TYPE} mapper
   * @return {ProxyStoreBuilder}
   */
  mapper(mapper) {
    this.__mapper = mapper
    return this
  }

  /**
   *
   * @param {TYPE.} type
   * @return {ProxyStoreBuilder}
   */
  type(type) {
    this.__type = type
    return this
  }

  /**
   *
   * @param {StoreTypeConfig~defaultCheckerClb<TYPE>} defaultChecker
   * @return {ProxyStoreBuilder}
   */
  defaultChecker(defaultChecker) {
    this.__defaultChecker = defaultChecker
    return this
  }

  /**
   *
   * @param {?ValueObjectValidator} validator
   * @return {ProxyStoreBuilder}
   */
  validator(validator) {
    this.__validator = validator
    return this
  }

  /**
   *
   * @return {ProxyStore<STORE_TYPE, STORE_TYPE_BUILDER, TYPE, TYPE_BUILDER>}
   */
  build() {

    const id = UID(this.__type.name + '_')
    const data = this.__store.state().data()
    const initialData = this.__mapper(data)

    return new ProxyStore(
      new ProxyStoreConfig(
        id,
        initialData,
        this.__store,
        new StoreTypeConfig(
          this.__type,
          this.__defaultChecker,
          this.__validator
        ),
        this.__mapper,
        new InMemoryStorage(
          this.__type,
          new StoreState(
            id,
            this.__type,
            initialData
          )
        )
      )
    )
  }
}
