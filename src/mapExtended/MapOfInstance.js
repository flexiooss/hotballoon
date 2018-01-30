import {
  MapExtended
} from './MapExtended'
import {
  should
} from '../helpers'

class MapOfInstance extends MapExtended {
  constructor(classType) {
    super()
    this._classType = classType || null
  }

  _initValue(key) {
    return false
  }

  _constraint(value) {
    if (this._classType) {
      should(value instanceof this._classType,
        'hotballoon:MapOfInstance:add require an argument instance of ̀ %s`, `%s` given',
        this._classType.constructor.name,
        value.constructor.name
      )
    }
    return value
  }
}
export {
  MapOfInstance
}
