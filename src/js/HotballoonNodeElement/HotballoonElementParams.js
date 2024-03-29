import {HyperFlexParams} from '../__import__flexio-hyperflex.js'
import {isFunction, isNull, TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js';

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
     * @params {Set<String>}
     * @private
     */
    this._reconciliationRules = new Set()
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
    return new this().addReconciliationRules(rules)
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
   * @return {Set<string>}
   */
  reconciliationRules() {
    return this._reconciliationRules
  }

  /**
   * @return {Array.<View>}
   */
  views() {
    return this._views
  }

  /**
   * @return {Array.<ElementEventListenerParam>}
   */
  eventListeners() {
    return this._eventListeners
  }

  /**
   * @param {Array.<View>} views
   * @return {HotballoonElementParams}
   */
  addViews(views) {
    this._views.push(...views)
    return this
  }

  /**
   * @param {(boolean|function():boolean)} statement
   * @param {(View|function():View)} view
   * @param {(View|function():?View)} [viewFalse=null]
   * @return {this}
   */
  bindView(statement, view, viewFalse = null) {
    if ((isFunction(statement) ? statement() : statement) === true) {
      this._views.push((isFunction(view) ? view() : view))
    } else {
      viewFalse = isFunction(viewFalse) ? viewFalse() : viewFalse
      if (!isNull(viewFalse)) {
        this._views.push(viewFalse)
      }
    }
    return this
  }

  /**
   * @param {string[]} reconciliationRules
   * @return {this}
   */
  addReconciliationRules(reconciliationRules) {
    TypeCheck.assertIsArray(reconciliationRules)
    reconciliationRules.forEach(v=>{
      this._reconciliationRules.add(v)
    })
    return this
  }

  /**
   * @param {ElementEventListenerConfig} nodeEventListenerParam
   * @return {this}
   */
  addEventListener(nodeEventListenerParam) {
    this._eventListeners.push(nodeEventListenerParam)
    return this
  }
}
