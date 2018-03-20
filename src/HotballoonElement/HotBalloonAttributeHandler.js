'use strict'
import {
  ListenerAttributeHandler
} from 'flexio-nodes-reconciliation'
import {
  KEY
} from './constantes'

/**
 * @class
 */
class HotBalloonAttributeHandler extends ListenerAttributeHandler {
  static select(element, scope) {
    return new HotBalloonAttributeHandler(element, scope)
  }
  setViewRef(ref) {
    Object.defineProperty(this.privateAttribute, KEY.VIEW_REF, {
      enumerable: true,
      configurable: false,
      writable: false,
      value: ref
    })
  }
  viewRef() {
    return (KEY.NODE_REF in this.privateAttribute) ? this.privateAttribute[KEY.VIEW_REF] : null
  }
  setNodeRef(ref) {
    Object.defineProperty(this.privateAttribute, KEY.NODE_REF, {
      enumerable: true,
      configurable: false,
      writable: false,
      value: ref
    })
  }
  nodeRef() {
    return (KEY.NODE_REF in this.privateAttribute) ? this.privateAttribute[KEY.NODE_REF] : null
  }
}
export const select = HotBalloonAttributeHandler.select
export {
  HotBalloonAttributeHandler
}
