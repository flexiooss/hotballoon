import {
  should
} from 'flexio-jshelpers'
class Model {
  constructor() {
    this._schema = new Map()
  }
  get() {
    return this._schema
  }

  addSchemaProp(schemaProperty) {
    should(
      ('id' in schemaProperty) && ('name' in schemaProperty) && ('type' in schemaProperty),
      'hotballoon:Model:setSchemaProp: `schemaProperty` argument should be an Object : {id:id, name:name, type:type}'
    )
    this._schema.set(schemaProperty.id, {
      name: schemaProperty.name,
      type: schemaProperty.type
    })
  }
}
export {
  Model
}
