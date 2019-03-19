/**
 * @template TYPE
 */
export class StoreBaseParams {
  /**
   * @constructor
   * @param {(Symbol|String)} id
   * @param {TypeParameter<TYPE>} typeParameter
   * @param {StorageInterface<TYPE>} storage
   */
  constructor(id, typeParameter, storage) {
    this._id = id
    this._typeParameter = typeParameter
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
    return this._typeParameter.type
  }

  /**
   *
   * @return {TypeParameter~validatorClb<TYPE>}
   */
  get validator() {
    return this._typeParameter.validator
  }

  /**
   *
   * @return {TypeParameter~defaultCheckerClb<TYPE>}
   */
  get defaultChecker() {
    return this._typeParameter.defaultChecker
  }

  /**
   *
   * @return {TypeParameter~fromObjectClb<TYPE>}
   */
  get fromObject() {
    return this._typeParameter.fromObject
  }

  /**
   *
   * @return {StorageInterface<TYPE>}
   */
  get storage() {
    return this._storage
  }
}
