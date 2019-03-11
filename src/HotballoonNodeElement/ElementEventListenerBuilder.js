import {EventListenerFactory} from 'flexio-nodes-reconciliation'
import {ElementEventListenerParam} from './ElementEventListenerParam'

export class ElementEventListenerBuilder extends EventListenerFactory {
  /**
   *
   * @return {ElementEventListenerParam}
   */
  build() {
    if (this._hasOptions()) {
      const options = {}
      if (this._capture) {
        options.capture = true
      }
      if (this._once) {
        options.once = true
      }
      if (this._passive) {
        options.passive = true
      }
      return ElementEventListenerParam.createWithOptions(this._event, this._callback, options)
    } else {
      return ElementEventListenerParam.create(this._event, this._callback)
    }
  }
}
