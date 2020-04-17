import {EventListenerConfigBuilder} from '../__import__flexio-nodes-reconciliation'
import {ElementEventListenerConfig} from './ElementEventListenerConfig'

export class ElementEventListenerConfigBuilder extends EventListenerConfigBuilder {
  /**
   *
   * @return {ElementEventListenerConfig}
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
      return ElementEventListenerConfig.createWithOptions(this._event, this._callback, options)
    } else {
      return ElementEventListenerConfig.create(this._event, this._callback)
    }
  }
}
