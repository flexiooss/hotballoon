/**
 * @template TYPE
 */
export class StoreBaseParams {
  /**
   * @constructor
   * @param {(Symbol|String)} id
   * @param {Class<TYPE>} type
   * @param {Function} dataValidate
   * @param {StorageInterface<TYPE>} storage
   */
  constructor(id, type, dataValidate, storage) {
    this._id = id
    this._type = type
    this._dataValidate = dataValidate
    this._storage = storage
  }

  /**
   *
   * @return {(symbol|String)}
   */
  get id() {
    return this._id
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
   * @return {StorageInterface<TYPE>}
   */
  get storage() {
    return this._storage
  }
}
