import {
  isNode,
  should
} from 'flexio-jshelpers'
import {
  KEY
} from './constantes'
const KEY_ROOT = KEY.ROOT

class HotBalloonAttributeHandler {
  constructor(element) {
    should(
      isNode(element),
      'hotballoon:HotBalloonAttributeHandler:constructor: `element` argument should be a NodeElement, `%s` given',
      typeof element)
    this.element = element
    if (!this._hasRootAttribute()) {
      this._initRootAttribute()
    }
    this.privateAttribute = this.element[KEY_ROOT]
  }

  static createClass(element) {
    return new HotBalloonAttributeHandler(element)
  }

  _initRootAttribute() {
    this.element[KEY_ROOT] = {}
  }

  _hasRootAttribute() {
    return KEY_ROOT in this.element
  }

  setAttribute(key, value) {
    this.privateAttribute[key] = value
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
export const handleHBAttribute = HotBalloonAttributeHandler.createClass
export {
  HotBalloonAttributeHandler
}
