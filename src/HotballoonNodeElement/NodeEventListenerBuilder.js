import {EventListenerFactory} from 'flexio-nodes-reconciliation'
import {NodeEventListenerParam} from './NodeEventListenerParam'

export class NodeEventListenerBuilder extends EventListenerFactory {
  /**
   *
   * @return {NodeEventListenerParam}
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
      return NodeEventListenerParam.createWithOptions(this._event, this._callback, options)
    } else {
      return NodeEventListenerParam.create(this._event, this._callback)
    }
  }
}
