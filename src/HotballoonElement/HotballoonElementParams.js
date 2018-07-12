'use strict'
import {HyperFlexParams} from 'flexio-hyperflex'

class HotballoonElementParams extends HyperFlexParams {
  /**
   *
   * @param attributes
   * @param style
   * @param text
   * @param children
   * @param {Array<string>} reconciliationRules
   * @return {HotballoonElementParams}
   */
  constructor() {
    super()
    this._views = []
    this._reconciliationRules = []
  }

  /**
   *
   * @return {array<string>}
   */
  get reconciliationRules() {
    return this._reconciliationRules
  }

  /**
   *
   * @return {Array<View>}
   */
  get views() {
    return this._views
  }

  /**
   *
   * @param {Array<string>} reconciliationRules
   * @return {HotballoonElementParams}
   */
  addReconciliationRules(reconciliationRules) {
    this._reconciliationRules = reconciliationRules
    return this
  }
}

export {
  HotballoonElementParams
}
