'use strict'
import {
  assert,
  filterObject
} from 'flexio-jshelpers'

/**
 * @class
 */
class StoreModel {
  constructor() {
    this._schema = new Map()
  }

  /**
     * @returns {Map}
     */
  get() {
    return this._schema
  }

  /**
     *
     * @param {Object} schemaProperty
     * { id: <string>,name: <string>, type: <string> text|number|...  }
     */
  addSchemaProp(schemaProperty) {
    assert(
      ('id' in schemaProperty) && ('name' in schemaProperty) && ('type' in schemaProperty),
      'hotballoon:Model:setSchemaProp: `schemaProperty` argument assert be an Object : {id:id, name:name, type:type}'
    )
    this._schema.set(schemaProperty.id, {
      name: schemaProperty.name,
      type: schemaProperty.type
    })
  }

  /**
     *
     * @param {Object} state
     */
  fillState(state) {
    return this._inModel(state)
  }

  /**
     * @private
     * @param {Object} object
     */
  _inModel(object) {
    if (this.hasModel) {
      filterObject(object, (value, key, scope) => {
        return this.get().has(key)
      })
    }
    return object
  }
}
export {
  StoreModel
}