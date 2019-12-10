import {isObject} from '@flexio-oss/assert'

export const CLASS_TAG_NAME = Symbol.for('__HB__CLASSNAME__')
export const CLASS_TAG_NAME_HOTBALLOON_APPLICATION = Symbol.for('__HB__APPLICATION__')
export const CLASS_TAG_NAME_DISPATCHER = Symbol.for('__HB__DISPATCHER__')
export const CLASS_TAG_NAME_COMPONENT = Symbol.for('__HB__COMPONENT__')
export const CLASS_TAG_NAME_ACTION = Symbol.for('__HB__ACTION__')
export const CLASS_TAG_NAME_STORE = Symbol.for('__HB__STORE__')
export const CLASS_TAG_NAME_PROXYSTORE = Symbol.for('__HB__PROXYSTORE__')
export const CLASS_TAG_NAME_PUBLIC_STORE_HANDLER = Symbol.for('__HB__PUBLIC_STORE_HANDLER__')
export const CLASS_TAG_NAME_VIEWCONTAINER = Symbol.for('__HB__VIEWCONTAINER__')
export const CLASS_TAG_NAME_VIEW = Symbol.for('__HB__VIEW__')
export const CLASS_TAG_NAME_EXECUTOR = Symbol.for('__HB__CLASS_TAG_NAME_EXECUTOR__')
export const CLASS_TAG_NAME_JOB = Symbol.for('__HB__CLASS_TAG_NAME_JOB__')

/**
 *
 * @param {Object} object
 * @return {boolean}
 * @function
 */
export const hasClassTagName = (object) => isObject(object) && CLASS_TAG_NAME in object
/**
 *
 * @param {Object} object
 * @param {Symbol} tag
 * @return {boolean}
 * @function
 */
export const testClassTagName = (object, tag) => hasClassTagName(object) && (object[CLASS_TAG_NAME] === tag)

/**
 *
 * @param object1
 * @param object2
 * @return {boolean}
 * @function
 */
export const isEqualClassTagName = (object1, object2) => {
  return isObject(object1) && isObject(object2) && hasClassTagName(object1) && hasClassTagName(object2) && (object1[CLASS_TAG_NAME] === object2[CLASS_TAG_NAME])
}

/**
 * @interface
 */
export class HasTagClassNameInterface {
  /**
   * return {Symbol}
   */
  [CLASS_TAG_NAME]() {
  }
}
