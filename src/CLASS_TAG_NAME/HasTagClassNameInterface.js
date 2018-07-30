import {isObject} from 'flexio-jshelpers'
import {CLASS_TAG_NAME} from '../CLASS_TAG_NAME'

export const isEqualTagClassName = (object1, object2) => {
  return isObject(object1) && isObject(object2) && (CLASS_TAG_NAME in object1) && (CLASS_TAG_NAME in object2) && (object1[CLASS_TAG_NAME] === object2[CLASS_TAG_NAME])
}

/**
 * @interface
 */
export class HasTagClassNameInterface {
  /**
   *
   * @param {HasTagClassNameInterface} instance
   * @return {boolean}
   */
  hasSameTagClassName(instance) {
    // return this.testTagClassName(instance[CLASS_TAG_NAME])
  }

  /**
   *
   * @param {Symbol} tag
   * @return {boolean}
   */
  testTagClassName(tag) {
    // return this[CLASS_TAG_NAME] === tag
  }
}
