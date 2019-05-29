import {AttributeHandler} from 'flexio-nodes-reconciliation'
import {KEY} from './constantes'

/**
 * @extends AttributeHandler
 */
class HotBalloonAttributeHandler extends AttributeHandler {
  /**
   * @static
   * @param {Node} element
   * @return {HotBalloonAttributeHandler}
   */
  static select(element) {
    return new HotBalloonAttributeHandler(element)
  }

  /**
   *
   * @param {string} ref
   */
  setViewRef(ref) {
    Object.defineProperty(this.privateAttribute, KEY.VIEW_REF, {
      enumerable: true,
      configurable: false,
      writable: false,
      value: ref
    })
  }

  /**
   *
   * @return {string | null}
   */
  viewRef() {
    return (KEY.VIEW_REF in this.privateAttribute) ? this.privateAttribute[KEY.VIEW_REF] : null
  }

  /**
   *
   * @return {boolean}
   */
  hasViewRef() {
    return this.viewRef() !== null
  }

  /**
   *
   * @param {string} ref
   */
  setNodeRef(ref) {
    Object.defineProperty(this.privateAttribute, KEY.NODE_REF, {
      enumerable: true,
      configurable: false,
      writable: false,
      value: ref
    })
  }

  /**
   *
   * @return {string | null}
   */
  nodeRef() {
    return (KEY.NODE_REF in this.privateAttribute) ? this.privateAttribute[KEY.NODE_REF] : null
  }
}

export const select = HotBalloonAttributeHandler.select
export const $ = HotBalloonAttributeHandler.select
export {
  HotBalloonAttributeHandler
}
