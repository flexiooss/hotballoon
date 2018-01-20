import {
  shouldIs
} from './shouldIs'
class Model {
  constructor(attributes) {
    this.setAttibutes(attributes)
  }
  setAttibutes(attributes) {
    shouldIs(
      this._attributes,
      'hotballoon:Model:setAttibutes: _attributes property already set'
    )
    this._attributes = attributes
  }
}
export {
  Model
}
