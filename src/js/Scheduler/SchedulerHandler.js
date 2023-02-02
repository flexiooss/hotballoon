import {NotOverrideException} from "@flexio-oss/js-commons-bundle/assert";
import {isImplement} from '@flexio-oss/js-commons-bundle/js-helpers'

export const SchedulerHandlerInterface = (Base = class{}) => {
  /**
   * @interface
   */
  return class SchedulerHandler extends Base {

    /**
     * @param  {function} task
     * @return {HBSchedulerTaskBuilder}
     */
    postTask(task) {
      throw NotOverrideException.FROM_INTERFACE('SchedulerHandler')
    }
  }

}

const constructorString = Object.getPrototypeOf(new (SchedulerHandlerInterface((class e {
})))).constructor.toString()

/**
 * @param {SchedulerHandler} inst
 * @return {boolean}
 */
export const implementsSchedulerHandlerInterface = (inst) => {
  return isImplement(inst, constructorString)
}
