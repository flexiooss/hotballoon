import {NotOverrideException} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {isImplement} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'

/**
 * @mixin
 * @param {Class<*>} Base
 * @return {{new(): Component, prototype: Component}}
 */
export const HBComponent = (Base = class {
}) => {
  /**
   * @interface
   */
  return class Component extends Base {
    remove() {
      throw NotOverrideException.FROM_INTERFACE('Hotballoon::Component')
    }

    /**
     * @return {boolean}
     */
    isRemoving() {
      throw NotOverrideException.FROM_INTERFACE('Hotballoon::Component')
    }
  }
}

const constructorString = Object.getPrototypeOf(new (HBComponent((class e {
})))).constructor.toString()

/**
 * @param {Component} inst
 * @return {boolean}
 */
export const implementsHBComponent = (inst) => {
  return isImplement(inst, constructorString)
}