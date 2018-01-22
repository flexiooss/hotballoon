export const staticClassName = object => object.toString().split('(' || /s+/)[0].split(' ' || /s+/)[1]
export const hasParentPrototypeName = (object, name) => {
  var objectPrototype = Object.getPrototypeOf(object)
  while (objectPrototype !== null) {
    if (objectPrototype.constructor.name === name) {
      return true
    }
    objectPrototype = Object.getPrototypeOf(objectPrototype)
  }
  return false
}
