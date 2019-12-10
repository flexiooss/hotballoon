import {assertType, isClass} from '@flexio-oss/assert'
import {deepFreezeSeal} from '@flexio-oss/js-type-helpers'
import {StoreState} from '../StoreState'
import {StorageInterface} from './StorageInterface'

const _state = Symbol.for('_state')

/**
 * @template TYPE
 * @implements {StorageInterface<TYPE>}
 * @implements {GenericType<TYPE>}
 * @extends {StorageInterface<TYPE>}
 */
export class InMemoryStorage extends StorageInterface {
  /**
   * @constructor
   * @param {TYPE.} type
   * @param {StoreState<TYPE>} state
   */
  constructor(type, state) {
    super()

    assertType(
      isClass(type),
      'hotballoon:Storage:constructor: `type` argument should be a Class'
    )

    assertType(state instanceof StoreState,
      'hotballoon:Storage:constructor: `state` argument should be a `StoreState` instance')

    Object.defineProperties(this, {
      [_state]: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: state
      },
      type: {
        configurable: false,
        writable: false,
        enumerable: true,
        /**
         * @params {TYPE.}
         * @name InMemoryStorage#type
         */
        value: type
      }

    })

    deepFreezeSeal(this)
  }

  /**
   *
   * @param {(string|Symbol)} storeID
   * @param {TYPE} data
   * @return {InMemoryStorage<TYPE>}
   */
  set(storeID, data) {
    return new InMemoryStorage(
      this.type,
      new StoreState(storeID, this.type, data)
    )
  }

  /**
   * @returns {StoreState<TYPE>}
   */
  get() {
    return this[_state]
  }

  /**
   *
   * @return {TYPE.}
   * @private
   */
  __type__() {
    return this.type
  }

  /**
   *
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    return constructor === this.__type__()
  }
}
