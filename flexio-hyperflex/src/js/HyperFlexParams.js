import {deepMerge} from '@flexio-oss/js-commons-bundle/js-type-helpers'
import {isNull, isFunction} from '@flexio-oss/js-commons-bundle/assert'
import {globalFlexioImport} from '@flexio-oss/js-commons-bundle/global-import-registry'


/**
 *
 */
export class HyperFlexParams {
  constructor() {
    /**
     *
     * @params {Object.<String, String>}
     * @private
     */
    this._attributes = {}
    /**
     *
     * @params {Object.<String, String>}
     * @private
     */
    this._properties = {}
    /**
     *
     * @params {Object.<String, String>}
     * @private
     */
    this._styles = {}
    /**
     *
     * @params {String}
     * @private
     */
    this._text = ''
    /**
     *
     * @params {Array.<Node>}
     * @private
     */
    this._childNodes = []
    /**
     *
     * @params {StringArray}
     * @private
     */
    this._classList = new globalFlexioImport.io.flexio.flex_types.arrays.StringArray()
  }

  /**
   *
   * @return {Object.<String, String>}
   */
  styles() {
    return this._styles
  }

  /**
   *
   * @return {Object.<String, String>}
   */
  attributes() {
    return this._attributes
  }

  /**
   *
   * @return {Object.<String, String>}
   */
  properties() {
    return this._properties
  }

  /**
   *
   * @return {String}
   */
  text() {
    return this._text
  }

  /**
   *
   * @return {array.<Node>}
   */
  childNodes() {
    return this._childNodes
  }

  /**
   *
   * @return {StringArray}
   */
  classList() {
    return this._classList
  }

  /**
   * @static
   * @param {array.<Node>} childNodes
   * @constructor
   * @return {HyperFlexParams}
   */
  static withChildNodes(childNodes) {
    return new this().addChildNodes(childNodes)
  }

  /**
   * @param {Object.<String, String>} attributes
   * @returns {HyperFlexParams}
   */
  static withAttributes(attributes) {
    return new this().addAttributes(attributes)
  }

  /**
   * @static
   * @param {Object.<String, String>} properties
   * @constructor
   * @return {HyperFlexParams}
   */
  static withProperties(properties) {
    return new this().addProperties(properties)
  }

  /**
   * @static
   * @param {Object.<String, String>} styles
   * @return {HyperFlexParams}
   */
  static withStyles(styles) {
    return new this().addStyles(styles)
  }

  /**
   * @static
   * @param {string} text
   * @constructor
   * @return {HyperFlexParams}
   */
  static withText(text) {
    return new this().addText(text)
  }

  /**
   *
   * @param {array.<Node>} childNodes
   * @return {this}
   */
  addChildNodes(childNodes) {
    this._childNodes = this._childNodes.concat(childNodes)
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

    if ((isFunction(statement) ? statement() : statement) === true) {
      this._childNodes = (isFunction(value) ? value() : value)
    } else {
      valueFalse = isFunction(valueFalse) ? valueFalse() : valueFalse
      if (!isNull(valueFalse)) {
        this._childNodes = valueFalse
      }
    }
    return this
  }

  /**
   *
   * @param {Object.<String, String>} attributes
   * @return {this}
   */
  addAttributes(attributes) {
    this._attributes = deepMerge(this._attributes, attributes)
    return this
  }

  /**
   *
   * @param {Object.<String, String>} properties
   * @return {this}
   */
  addProperties(properties) {
    this._properties = deepMerge(this._properties, properties)
    return this
  }

  /**
   *
   * @param {String} text
   * @return {this}
   */
  addText(text) {
    this._text += text
    return this
  }

  /**
   *
   * @param {Object.<String, String>} styles
   * @returns {this}
   */
  addStyles(styles) {
    this._styles = deepMerge(this._styles, styles)
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

    if ((isFunction(statement) ? statement() : statement) === true) {
      this._attributes[key] = (isFunction(attribute) ? attribute() : attribute)
    } else {
      attributeFalse = isFunction(attributeFalse) ? attributeFalse() : attributeFalse
      if (!isNull(attributeFalse)) {
        this._attributes[key] = attributeFalse
      }
    }
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
    const st = (isFunction(statement) ? statement() : statement)

    if (st === true) {
      this._styles[property] = (isFunction(value) ? value() : value)
    } else {
      valueFalse = isFunction(valueFalse) ? valueFalse() : valueFalse
      if (!isNull(valueFalse)) {
        this._styles[property] = isFunction(valueFalse) ? valueFalse() : valueFalse
      }
    }
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

    if ((isFunction(statement) ? statement() : statement) === true) {
      this._properties[key] = (isFunction(property) ? property() : property)
    } else {
      propertyFalse = isFunction(propertyFalse) ? propertyFalse() : propertyFalse
      if (!isNull(propertyFalse)) {

        this._properties[key] = propertyFalse
      }
    }
    return this
  }

  /**
   *
   * @param {(boolean|function():boolean)} statement
   * @param {(String|function():String)} classNameTrue
   * @param {(String|function():String)} [classNameFalse=null]
   * @return {this}
   */
  bindClassName(statement, classNameTrue, classNameFalse = null) {

    if ((isFunction(statement) ? statement() : statement) === true) {
      this.addClassName((isFunction(classNameTrue) ? classNameTrue() : classNameTrue))
    } else {
      classNameFalse = isFunction(classNameFalse) ? classNameFalse() : classNameFalse
      if (!isNull(classNameFalse)) {

        this.addClassName(classNameFalse)
      }
    }
    return this
  }

  /**
   *
   * @param {...string} className
   * @return {this}
   */
  addClassName(...className) {
    this._classList.push(...className)
    return this
  }
}
