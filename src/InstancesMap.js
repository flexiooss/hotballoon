import {
  ObjectMap
} from './ObjectMap'
import {
  isObject
} from './helpers'
import {
  shouldIs
} from './shouldIs'

class InstancesMap extends ObjectMap {
  constructor(classType) {
    super()
    this._classType = classType || null
  }
  add(item) {
    if (this._classType) {
      shouldIs(item instanceof this._classType,
        'hotballoon:InstancesMap:add require an argument instance of ̀ %s`',
        this._classType.constructor.name
      )
    }
    shouldIs(!(item.constructor.name in this._collection),
      'hotballoon:InstancesMap:add: `%s` instance is already registered',
      item.constructor.name
    )
    this._collection[item.constructor.name] = item
  }
  delete(item) {
    let key = (isObject(item)) ? item.constructor.name : item
    try {
      delete this._collection[key]
    } catch (error) {
      console.log(error)
    }
  }
}
export {
  InstancesMap
}
