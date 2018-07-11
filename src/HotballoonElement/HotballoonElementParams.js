'use strict'
import {HyperFlexParams} from 'flexio-hyperflex'

class HotballoonElementParams extends HyperFlexParams {
  /**
   *
   * @param attributes
   * @param style
   * @param text
   * @param children
   * @param {array<string>} reconciliationRules
   * @return {HotballoonElementParams}
   */
  constructor(attributes = {}, style = {}, text = '', children = [], reconciliationRules = []) {
    super(attributes = {}, style = {}, text = '', children = [])
    this._reconciliationRules = reconciliationRules
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
   * @param {array<string>} reconciliationRules
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
