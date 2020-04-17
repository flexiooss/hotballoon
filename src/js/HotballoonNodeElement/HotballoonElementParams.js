import {HyperFlexParams} from '../__import__flexio-hyperflex'

/**
 *
 * @extends {HyperFlexParams}
 */
export class HotballoonElementParams extends HyperFlexParams {
  constructor() {
    super()
    /**
     *
     * @params {Array.<View>}
     * @private
     */
    this._views = []
    /**
     *
     * @params {Array.<String>}
     * @private
     */
    this._reconciliationRules = []
    /**
     *
     * @params {Array<ElementEventListenerConfig>}
     * @private
     */
    this._eventListeners = []
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
   * @static
   * @param {...String} rules
   * @return {HyperFlexParams}
   * @constructor
   */
  static withReconciliationRules(...rules) {
    return new this().addReconciliationRules(...rules)
  }

  /**
   * @static
   * @param {ElementEventListenerConfig} nodeEventListenerParam
   * @return {this}
   * @constructor
   */
  static withEventListener(nodeEventListenerParam) {
    return new this().addEventListener(nodeEventListenerParam)
  }

  /**
   *
   * @return {Array.<string>}
   */
  reconciliationRules() {
    return this._reconciliationRules
  }

  /**
   *
   * @return {Array.<View>}
   */
  views() {
    return this._views
  }

  /**
   *
   * @return {Array.<ElementEventListenerParam>}
   */
  eventListeners() {
    return this._eventListeners
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
   *
   * @param {...string} reconciliationRules
   * @return {this}
   */
  addReconciliationRules(...reconciliationRules) {
    reconciliationRules.forEach((r) => {
      this._reconciliationRules.push(...reconciliationRules)
    })

    return this
  }

  /**
   *
   * @param {ElementEventListenerConfig} nodeEventListenerParam
   * @return {this}
   */
  addEventListener(nodeEventListenerParam) {
    this._eventListeners.push(nodeEventListenerParam)
    return this
  }
}
