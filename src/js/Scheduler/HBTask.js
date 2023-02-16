import { NotOverrideException} from '@flexio-oss/js-commons-bundle/assert/index.js';
import {isImplement} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'

export const HBTaskInterface = (Base = class  {
  
}) => {
  /**
   * @interface
   */
  return class HBTask extends Base {
    /**
     * @return {Promise<*>}
     */
    async exec() {
      throw NotOverrideException.FROM_INTERFACE('HBTask')
    }

    abort() {
      throw NotOverrideException.FROM_INTERFACE('HBTask')
    }

    /**
     * @return {HBTask}
     */
    toPriorityBlocking() {
      throw NotOverrideException.FROM_INTERFACE('HBTask')
    }

    /**
     * @return {HBTask}
     */
    toPriorityNormal() {
      throw NotOverrideException.FROM_INTERFACE('HBTask')
    }

    /**
     * @return {HBTask}
     */
    toPriorityBackground() {
      throw NotOverrideException.FROM_INTERFACE('HBTask')
    }
  }

}

const constructorString = Object.getPrototypeOf(new (HBTaskInterface((class e {
})))).constructor.toString()

/**
 * @param {HBSchedulerTaskBuilder} inst
 * @return {boolean}
 */
export const implementsHBTaskInterface = (inst) => {
  return isImplement(inst, constructorString)
}
