'use strict'
import {HyperFlexParams} from 'flexio-hyperflex'

/**
 * @extends HyperFlexParams
 */
class HotballoonElementParams extends HyperFlexParams {
  /**
   * @return {HotballoonElementParams}
   */
  constructor() {
    super()
    /**
     *
     * @type {Array<View>}
     * @private
     */
    this._views = []
    /**
     *
     * @type {Array<String>}
     * @private
     */
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
   * @static
   * @param {Array<View>} views
   * @return {HotballoonElementParams}
   */
  static withViews(views) {
    const i = new this()
    i._views = views
    return i
  }

  /**
   * @static
   * @param {Array<String>} rules
   * @return {HotballoonElementParams}
   */
  static withReconciliationRules(rules) {
    return new this().addReconciliationRules(rules)
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

export {HotballoonElementParams}
