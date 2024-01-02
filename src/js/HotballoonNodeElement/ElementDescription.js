import {HotballoonElementParams} from './HotballoonElementParams.js'
import {isFunction, isString} from "@flexio-oss/js-commons-bundle/assert/index.js";
import {RECONCILIATION_RULES} from "../../../flexio-nodes-reconciliation/index.js";
import {UIEventBuilder} from './UIEventBuilder.js'

export class ElementDescription {
  /**
   *
   * @param {string} querySelector
   */
  constructor(querySelector) {
    this._querySelector = querySelector
    this._params = new HotballoonElementParams()
  }

  /**
   *
   * @return {string}
   */
  querySelector() {
    return this._querySelector
  }

  /**
   *
   * @return {HotballoonElementParams}
   */
  params() {
    return this._params
  }

  /**
   * @param {string,string[]|function(ReconciliationRulesBuilder):string[]} reconciliationRules
   * @return {ElementDescription}
   */
  reconciliationRules(reconciliationRules) {
    if (isFunction(reconciliationRules)) {
      reconciliationRules = reconciliationRules.call(null, new ReconciliationRulesBuilder())
    }
    if(isString(reconciliationRules)){
      reconciliationRules= [reconciliationRules]
    }
    this._params.addReconciliationRules(reconciliationRules)

    return this
  }

  /**
   * @param {ElementEventListenerConfig|function(UIEventBuilder.):ElementEventListenerConfig} nodeEventListenerParam
   * @return {this}
   */
  listenEvent(nodeEventListenerParam) {
    if (isFunction(nodeEventListenerParam)) {
      nodeEventListenerParam = nodeEventListenerParam.call(null, UIEventBuilder)
    }
    this._params.addEventListener(nodeEventListenerParam)

    return this
  }

  /**
   * @param {View} views
   * @return {this}
   */
  views(...views) {
    this._params.addViews(views)

    return this
  }

  /**
   * @param {(boolean|function():boolean)} statement
   * @param {(View|function():View)} view
   * @param {(View|function():?View)} [viewFalse=null]
   * @return {this}
   */
  bindView(statement, view, viewFalse = null) {
    this._params.bindView(statement, view, viewFalse)
    return this
  }

  /**
   *
   * @param {...Element} childNodes
   * @return {this}
   */
  childNodes(...childNodes) {
    this._params.addChildNodes(childNodes)
    return this
  }

  /**
   *
   * @param {(boolean|function():boolean)} statement
   * @param {(Element[]|function():Element[])} value
   * @param {?(Element[]|function():Element[])} [valueFalse=null]
   * @return {this}
   */
  bindChildNodes(statement, value, valueFalse = null) {
    this._params.bindChildNodes(statement, value, valueFalse)
    return this
  }

  /**
   *
   * @param {String} key
   * @param {(boolean|function():boolean)} statement
   * @param {(String|function():String)} attribute
   * @param {(String|function():String)} [attributeFalse=null]
   * @return {this}
   */
  bindAttribute(key, statement, attribute, attributeFalse = null) {
    this._params.bindAttribute(key, statement, attribute, attributeFalse)
    return this
  }

  /**
   *
   * @param {Object.<String, String>} attributes
   * @return {this}
   */
  attributes(attributes) {
    this._params.addAttributes(attributes)
    return this
  }

  /**
   * @param {String} key
   * @param {(boolean|function():boolean)} statement
   * @param {(*|function():*)} property
   * @param {(*|function():*)} [propertyFalse=null]
   * @return {this}
   */
  bindProperty(key, statement, property, propertyFalse = null) {
    this._params.bindProperty(key, statement, property, propertyFalse)
    return this
  }

  /**
   *
   * @param {Object.<String, *>} properties
   * @return {this}
   */
  properties(properties) {
    this._params.addProperties(properties)
    return this
  }

  /**
   *
   * @param {String} text
   * @return {this}
   */
  text(text) {
    this._params.addText(text)
    return this
  }

  /**
   * @param {String} id
   * @return {this}
   */
  id(id) {
    this._params.setId(id)
    return this
  }

  /**
   *
   * @param {String} property
   * @param {(boolean|function():boolean)} statement
   * @param {(String|function():String)} value
   * @param {(String|function():String)} [valueFalse=null]
   * @return {this}
   */
  bindStyle(property, statement, value, valueFalse = null) {
    this._params.bindStyle(property, statement, value, valueFalse)
    return this
  }

  /**
   *
   * @param {Object.<String, String>} styles
   * @returns {this}
   */
  styles(styles) {
    this._params.addStyles(styles)
    return this
  }

  /**
   *
   * @param { boolean|function():boolean} statement
   * @param {(String|string[]|function():String|string[])} classNameTrue
   * @param {(String|string[]|function():String|string[])} [classNameFalse=null]
   * @return {this}
   */
  bindClassName(statement, classNameTrue, classNameFalse = null) {
    this._params.bindClassName(statement, classNameTrue, classNameFalse)
    return this
  }

  /**
   *
   * @param {...string} className
   * @return {this}
   */
  className(...className) {
    this._params.addClassName(...className)
    return this
  }

  /**
   * @param {...string} HTMLTxt
   * @return {this}
   */
  prependHTML(...HTMLTxt) {
    this._params.prependHTML(...HTMLTxt)
    return this
  }

  /**
   * @param {...string} HTMLTxt
   * @return {this}
   */
  appendHTML(...HTMLTxt) {
    this._params.appendHTML(...HTMLTxt)
    return this
  }
}

/**
 * @param {string} querySelector
 * @return {ElementDescription}
 */
export const e = (querySelector) => new ElementDescription(querySelector)


class ReconciliationRulesBuilder {
  /**
   * @type {string[]}
   */
  #list = []

  /**
   * @return {ReconciliationRulesBuilder}
   * @constructor
   */
  replace() {
    this.#list.push(RECONCILIATION_RULES.REPLACE)
    return this
  }

  /**
   * @return {ReconciliationRulesBuilder}
   * @constructor
   */
  bypass() {
    this.#list.push(RECONCILIATION_RULES.BYPASS)
    return this
  }

  /**
   * @return {ReconciliationRulesBuilder}
   * @constructor
   */
  bypassOnce() {
    this.#list.push(RECONCILIATION_RULES.BYPASS_ONCE)
    return this
  }

  /**
   * @return {ReconciliationRulesBuilder}
   * @constructor
   */
  bypassChildren() {
    this.#list.push(RECONCILIATION_RULES.BYPASS_CHILDREN)
    return this
  }

  /**
   * @return {ReconciliationRulesBuilder}
   * @constructor
   */
  onlyChildren() {
    this.#list.push(RECONCILIATION_RULES.ONLY_CHILDREN)
    return this
  }

  /**
   * @return {ReconciliationRulesBuilder}
   * @constructor
   */
  bypassChildrenOnce() {
    this.#list.push(RECONCILIATION_RULES.BYPASS_CHILDREN_ONCE)
    return this
  }

  /**
   * @return {ReconciliationRulesBuilder}
   * @constructor
   */
  reconcileListeners() {
    this.#list.push(RECONCILIATION_RULES.RECONCILE_LISTENERS)
    return this
  }

  /**
   * @return {ReconciliationRulesBuilder}
   * @constructor
   */
  replaceListeners() {
    this.#list.push(RECONCILIATION_RULES.REPLACE_LISTENERS)
    return this
  }

  /**
   * @return {ReconciliationRulesBuilder}
   * @constructor
   */
  bypassListeners() {
    this.#list.push(RECONCILIATION_RULES.BYPASS_LISTENERS)
    return this
  }

  /**
   * @return {ReconciliationRulesBuilder}
   * @constructor
   */
  bypassListenersOnce() {
    this.#list.push(RECONCILIATION_RULES.BYPASS_LISTENERS_ONCE)
    return this
  }

  /**
   * @return {ReconciliationRulesBuilder}
   * @constructor
   */
  force() {
    this.#list.push(RECONCILIATION_RULES.FORCE)
    return this
  }

  /**
   * @return {string[]}
   */
  build() {
    return this.#list
  }
}