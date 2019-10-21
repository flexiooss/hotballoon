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
  get querySelector() {
    return this._querySelector
  }

  /**
   *
   * @return {HotballoonElementParams}
   */
  get params() {
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
   * @param {Object.<String, String>} attributes
   * @return {ElementDescription}
   */
  attributes(attributes) {
    this._params.addAttributes(attributes)
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
   * @param {Object.<String, String>} styles
   * @returns {ElementDescription}
   */
  styles(styles) {
    this._params.addStyles(styles)
    return this
  }

  /**
   *
   * @param {String} className
   * @param { boolean} statement
   * @return {ElementDescription}
   */
  bindClassName(className, statement) {
    this._params.bindClassName(className, statement)
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
