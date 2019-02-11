'use strict'
import {HyperFlexParams} from 'flexio-hyperflex'

/**
 * @extends {HyperFlexParams}
 */
export class HotballoonElementParams extends HyperFlexParams {
  /**
   * @return {this}
   */
  constructor() {
    super()
    /**
     *
     * @type {Array<view>}
     * @private
     */
    this._views = []
    /**
     *
     * @type {Array<String>}
     * @private
     */
    this._reconciliationRules = []
    /**
     *
     * @type {Array<NodeEventListenerParam>}
     * @private
     */
    this._eventListeners = []
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
   * @return {Array<view>}
   */
  get views() {
    return this._views
  }

  /**
   *
   * @return {Array<NodeEventListenerParam>}
   */
  get eventListeners() {
    return this._eventListeners
  }

  /**
   * @static
   * @param {Array<view>} views
   * @return {this}
   * @constructor
   */
  static withViews(views) {
    const i = new this()
    i._views = views
    return i
  }

  /**
   * @static
   * @param {Array<String>} rules
   * @return {this}
   * @constructor
   */
  static withReconciliationRules(rules) {
    return new this().addReconciliationRules(rules)
  }

  /**
   *
   * @param {Array<string>} reconciliationRules
   * @return {this}
   */
  addReconciliationRules(reconciliationRules) {
    this._reconciliationRules = reconciliationRules
    return this
  }

  /**
   * @static
   * @param {NodeEventListenerParam} nodeEventListenerParam
   * @return {this}
   * @constructor
   */
  static withEventListener(nodeEventListenerParam) {
    return new this().addEventListener(nodeEventListenerParam)
  }

  /**
   *
   * @param {NodeEventListenerParam} nodeEventListenerParam
   * @return {this}
   */
  addEventListener(nodeEventListenerParam) {
    this._eventListeners.push(nodeEventListenerParam)
    return this
  }
}
