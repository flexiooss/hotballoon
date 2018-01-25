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
  replace(item, key) {
    if (this._classType) {
      shouldIs(item instanceof this._classType,
        'hotballoon:InstancesMap:add require an argument instance of ̀ %s`',
        this._classType.constructor.name
      )
    }
    this._collection[key] = item
  }

  add(item, key) {
    key = key || item.constructor.name
    shouldIs(!(key in this._collection),
      'hotballoon:InstancesMap:add: `%s` instance is already registered',
      key
    )
    this.replace(item, key)
  }

  delete(key) {
    key = (isObject(key)) ? key.constructor.name : key
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
