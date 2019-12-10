import {HotballoonElementParams} from './HotballoonElementParams'


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
   *
   * @param {string} reconciliationRules
   * @return {ElementDescription}
   */
  reconciliationRules(...reconciliationRules) {
    this._params.addReconciliationRules(...reconciliationRules)
    return this
  }

  /**
   *
   * @param {ElementEventListenerConfig} nodeEventListenerParam
   * @return {ElementDescription}
   */
  listenEvent(nodeEventListenerParam) {
    this._params.addEventListener(nodeEventListenerParam)
    return this
  }

  /**
   *
   * @param {View} views
   * @return {ElementDescription}
   */
  views(...views) {
    this._params.addViews(views)
    return this
  }

  /**
   *
   * @param {...Element} childNodes
   * @return {ElementDescription}
   */
  childNodes(...childNodes) {
    this._params.addChildNodes(childNodes)
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
   * @return {ElementDescription}
   */
  attributes(attributes) {
    this._params.addAttributes(attributes)
    return this
  }

  /**
   *
   * @param {String} key
   * @param {(boolean|function():boolean)} statement
   * @param {(String|function():String)} property
   * @param {(String|function():String)} [propertyFalse=null]
   * @return {this}
   */
  bindProperty(key, statement, property, propertyFalse = null) {
    this._params.bindProperty(key, statement, property, propertyFalse)
    return this
  }

  /**
   *
   * @param {Object.<String, String>} properties
   * @return {ElementDescription}
   */
  properties(properties) {
    this._params.addProperties(properties)
    return this
  }

  /**
   *
   * @param {String} text
   * @return {ElementDescription}
   */
  text(text) {
    this._params.addText(text)
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
   * @returns {ElementDescription}
   */
  styles(styles) {
    this._params.addStyles(styles)
    return this
  }

  /**
   *
   * @param { boolean} statement
   * @param {String} classNameTrue
   * @param {String} [classNameFalse=null]
   * @return {ElementDescription}
   */
  bindClassName(statement, classNameTrue, classNameFalse = null) {
    this._params.bindClassName(statement, classNameTrue, classNameFalse)
    return this
  }

  /**
   *
   * @param {...string} className
   * @return {ElementDescription}
   */
  className(...className) {
    this._params.addClassName(...className)
    return this
  }
}


/**
 *
 * @param {string} querySelector
 * @return {ElementDescription}
 */
export const e = (querySelector) => new ElementDescription(querySelector)
