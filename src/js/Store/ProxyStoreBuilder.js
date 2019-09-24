import {UID} from '@flexio-oss/js-helpers'
import {InMemoryStorage} from './Storage/InMemoryStorage'
import {StoreState} from './StoreState'
import {StoreTypeConfig} from './StoreTypeConfig'
import {ProxyStore} from './ProxyStore'
import {ProxyStoreConfig} from './ProxyStoreConfig'

/**
 *
 * @template  STORE_TYPE, TYPE, TYPE_BUILDER
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
     * @type {?TYPE_BUILDER.}
     * @private
     */
    this.__typeBuilder = null

    /**
     *
     * @type  {StoreTypeConfig~validatorClb<TYPE>}
     * @private
     */
    this.__validator = () => true
    /**
     *
     * @type {StoreTypeConfig~defaultCheckerClb<TYPE>}
     * @private
     */
    this.__defaultChecker = v => v

    /**
     *
     * @type {?ProxyStoreConfig~mapperClb<STORE_TYPE, TYPE>} mapper
     * @private
     */
    this.__mapper = null
  }

  /**
   *
   * @param {StoreInterface<STORE_TYPE>} store
   * @return {ProxyStoreBuilder}
   */
  store(store) {
    this.__store = store
    return this
  }

  /**
   *
   * @param {ProxyStoreConfig~mapperClb<STORE_TYPE, TYPE>} mapper
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
   * @param {TYPE_BUILDER.} typeBuilder
   * @return {ProxyStoreBuilder}
   */
  typeBuilder(typeBuilder) {
    this.__typeBuilder = typeBuilder
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
   * @param {StoreTypeConfig~validatorClb<TYPE>} validator
   * @return {ProxyStoreBuilder}
   */
  validator(validator) {
    this.__validator = validator
    return this
  }

  /**
   *
   * @return {ProxyStore<STORE_TYPE, TYPE, TYPE_BUILDER>}
   */
  build() {

    const id = UID(this.__type.name + '_')

    return new ProxyStore(
      new ProxyStoreConfig(
        id,
        this.__store,
        new StoreTypeConfig(
          this.__type,
          this.__typeBuilder,
          this.__defaultChecker,
          this.__validator
        ),
        this.__mapper,
        new InMemoryStorage(
          this.__type,
          new StoreState(
            id,
            this.__type,
            this.__mapper(this.__store.state().data)
          )
        )
      )
    )
  }
}
