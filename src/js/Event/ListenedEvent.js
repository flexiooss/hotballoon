import {assertType, formatType, isUndefined, NotOverrideException} from '@flexio-oss/js-commons-bundle/assert/index.js';
import {isImplement} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'

export const listenedEventInterface = (Base=class{}) => {
  /**
   * @interface
   */
  return class ListenedEvent extends Base{
    /**
     * @return {string}
     */
    token() {
      if(!isUndefined(super.token)) return super.token()
      throw NotOverrideException.FROM_INTERFACE('ListenedEvent')
    }
    /**
     * @return {void}
     */
    remove() {
      if(!isUndefined(super.remove)) return super.remove()
      throw NotOverrideException.FROM_INTERFACE('ListenedEvent')
    }

  }

}

const constructorString = Object.getPrototypeOf(new (listenedEventInterface((class e {
})))).constructor.toString()

/**
 * @param {ListenedEvent} inst
 * @return {boolean}
 */
export const implementsListenedEvent = (inst) => {
  return isImplement(inst, constructorString)
}
/**
 * @param {ListenedEvent} inst
 * @return {ListenedEvent}
 */
export const assertImplementsListenedEvent = (inst) => {
  assertType(implementsListenedEvent(inst), ()=>`should be ListenedEvent, given:${formatType(inst)}`)
  return inst
}
