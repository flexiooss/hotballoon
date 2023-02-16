import {NotOverrideException} from '@flexio-oss/js-commons-bundle/assert/index.js';
import {isImplement} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'

export const HBSchedulerTaskBuilderInterface = (Base) => {
  /**
   * @interface
   */
  return class HBSchedulerTaskBuilder extends Base {

    /**
     * @return {HBSchedulerTaskBuilder}
     */
    blocking() {
      throw NotOverrideException.FROM_INTERFACE('HBSchedulerTaskBuilder')
    }

    /**
     * @return {HBSchedulerTaskBuilder}
     */
    background() {
      throw NotOverrideException.FROM_INTERFACE('HBSchedulerTaskBuilder')
    }

    /**
     * @param {number} value - ms
     * @return {HBSchedulerTaskBuilder}
     */
    delay(value) {
      throw NotOverrideException.FROM_INTERFACE('HBSchedulerTaskBuilder')
    }

    /**
     * @return {HBTask}
     */
    build() {
      throw NotOverrideException.FROM_INTERFACE('HBSchedulerTaskBuilder')
    }
  }

}

const constructorString = Object.getPrototypeOf(new (HBSchedulerTaskBuilderInterface((class e {
})))).constructor.toString()

/**
 * @param {HBSchedulerTaskBuilder} inst
 * @return {boolean}
 */
export const implementsHBSchedulerTaskBuilderInterface = (inst) => {
  return isImplement(inst, constructorString)
}
