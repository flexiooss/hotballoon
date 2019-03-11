'use strict'
import {HyperFlexParams} from 'flexio-hyperflex'

/**
 *
 * @extends {HyperFlexParams}
 */
export class HotballoonElementParams extends HyperFlexParams {
  constructor() {
    super()
    /**
     *
     * @type {Array.<View>}
     * @private
     */
    this._views = []
    /**
     *
     * @type {Array.<String>}
     * @private
     */
    this._reconciliationRules = []
    /**
     *
     * @type {Array<ElementEventListenerParam>}
     * @private
     */
    this._eventListeners = []
  }

  /**
   *
   * @return {Array.<string>}
   */
  get reconciliationRules() {
    return this._reconciliationRules
  }

  /**
   *
   * @return {Array.<View>}
   */
  get views() {
    return this._views
  }

  /**
   *
   * @return {Array.<ElementEventListenerParam>}
   */
  get eventListeners() {
    return this._eventListeners
  }

  /**
   * @static
   * @param {Array.<View>} views
   * @return {HyperFlexParams}
   * @constructor
   */
  static withViews(views) {
    const i = new this()
    i._views = views
    return i
  }

  /**
   *
   * @param {Array.<View>} views
   * @return {HotballoonElementParams}
   */
  addViews(views) {
    this._views = views
    return this
  }

  /**
   * @static
   * @param {Array.<String>} rules
   * @return {HyperFlexParams}
   * @constructor
   */
  static withReconciliationRules(rules) {
    return new this().addReconciliationRules(rules)
  }

  /**
   *
   * @param {Array.<string>} reconciliationRules
   * @return {this}
   */
  addReconciliationRules(reconciliationRules) {
    // TODO merge array
    this._reconciliationRules = reconciliationRules
    return this
  }

  /**
   * @static
   * @param {ElementEventListenerParam} nodeEventListenerParam
   * @return {this}
   * @constructor
   */
  static withEventListener(nodeEventListenerParam) {
    return new this().addEventListener(nodeEventListenerParam)
  }

  /**
   *
   * @param {ElementEventListenerParam} nodeEventListenerParam
   * @return {this}
   */
  addEventListener(nodeEventListenerParam) {
    this._eventListeners.push(nodeEventListenerParam)
    return this
  }
}
