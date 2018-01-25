export const sortObject = (object, callback) => {
  var arrayTemp = []
  var objectTemp = []
  for (let prop in object) {
    if (object.hasOwnProperty(prop)) {
      arrayTemp.push({
        'key': prop,
        'value': object[prop]
      })
    }
  }
  arrayTemp.sort(function(a, b) {
    return callback(a, b)
  })
  let countOfArray = arrayTemp.length
  for (let i = 0; i < countOfArray; i++) {
    objectTemp[arrayTemp[i]['key']] = arrayTemp[i]['value']
  }
  return objectTemp
}

export const filterObject = (object, callback) => {
  Object.keys(object).forEach((key) => {
    const value = object[key]
    if (!callback(value, key, object)) {
      delete object[key]
    }
  })
  return object
}

export const deepFreeze = (object) => {
  let propNames = Object.getOwnPropertyNames(object)
  propNames.forEach(function(name) {
    var prop = object[name]
    if (typeof prop === 'object' && prop !== null && !Object.isFrozen(prop)) {
      deepFreeze(prop)
    }
  })
  return Object.freeze(object)
}
export const deepSeal = (object) => {
  let propNames = Object.getOwnPropertyNames(object)
  propNames.forEach(function(name) {
    var prop = object[name]
    if (typeof prop === 'object' && prop !== null && !Object.isSealed(prop)) {
      deepSeal(prop)
    }
  })
  return Object.seal(object)
}
export const deepFreezeSeal = (object) => {
  let propNames = Object.getOwnPropertyNames(object)
  propNames.forEach(function(name) {
    var prop = object[name]
    if (typeof prop === 'object' && prop !== null && !Object.isSealed(prop) && !Object.isFrozen(prop)) {
      deepFreezeSeal(prop)
    }
  })
  return Object.freeze(Object.seal(object))
}

/**
 * split a keys and deep check if key exists in an Object
 * @param {*} object
 * @param {string} keys
 * @param {string} separator
 * @returns false || value of Object[key]
 */
export const deepKeyResolver = (object, keys, separator = '.') => {
  var arrayKeys = keys.split(separator)
  var ret = object
  do {
    var key = arrayKeys.shift()
    if (key in object) {
      ret = object[key]
    } else {
      return false
    }
  } while (arrayKeys.length)
  return ret
}
export const intersectObjectByKey = (object) => {
  return Object.keys(object)
    .filter(key => this.storesName.includes(key))
    .reduce((obj, key) => {
      obj[key] = object[key]
      return obj
    }, {})
}
