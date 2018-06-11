import { isObject } from 'flexio-jshelpers'

export const CLASS_TAG_NAME = '__HB__CLASSNAME__'
export const isEqualTagClassName = (object1, object2) => {
  return isObject(object1) && isObject(object2) && (CLASS_TAG_NAME in object1) && (CLASS_TAG_NAME in object2) && (object1[CLASS_TAG_NAME] === object2[CLASS_TAG_NAME])
}
