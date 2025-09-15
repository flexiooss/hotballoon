import {assertType, formatType, isUndefined, NotOverrideException} from '@flexio-oss/js-commons-bundle/assert/index.js';
import {isImplement} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'

export const listenableInterface = (Base=class{}) => {
  /**
   * @interface
   * @template TYPE
   * @template TYPE_BUILDER
   * @mixin
   */
  return class Listenable extends Base{
    /**
     * @param {OrderedEventListenerConfig|function(StoreEventListenerConfigBuilder<TYPE>):OrderedEventListenerConfig} orderedEventListenerConfig
     * @return {ListenedStore}
     */
    listenChanged(orderedEventListenerConfig) {
      if(!isUndefined(super.listenChanged)) return super.listenChanged(orderedEventListenerConfig)
      throw NotOverrideException.FROM_INTERFACE('Listenable')
    }
    /**
     * @return {void}
     */
    remove() {
      if(!isUndefined(super.remove)) return super.remove()
      throw NotOverrideException.FROM_INTERFACE('Listenable')
    }
    /**
     * @return {boolean}
     */
    isRemoving() {
      if(!isUndefined(super.isRemoving)) return super.isRemoving()
      throw NotOverrideException.FROM_INTERFACE('Listenable')
    }

  }

}

const constructorString = Object.getPrototypeOf(new (listenableInterface((class e {
})))).constructor.toString()

/**
 * @param {Listenable} inst
 * @return {boolean}
 */
export const implementsListenable = (inst) => {
  return isImplement(inst, constructorString)
}
/**
 * @param {Listenable} inst
 * @return {Listenable}
 */
export const assertImplementsListenable = (inst) => {
  assertType(implementsListenable(inst), ()=>`should be Listenable, given:${formatType(inst)}`)
  return inst
}
