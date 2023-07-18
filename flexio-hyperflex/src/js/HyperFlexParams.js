import {deepMerge} from '@flexio-oss/js-commons-bundle/js-type-helpers/index.js'
import {isNull, isFunction, TypeCheck, isArray} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {globalFlexioImport} from '@flexio-oss/js-commons-bundle/global-import-registry/index.js'

export class HyperFlexParams {
  /**
   * @type {Object.<String, String>}
   */
  #attributes = {}
  /**
   * @type {Object.<String, String>}
   */
  #properties = {}
  /**
   * @type {Object.<String, String>}
   */
  #styles = {}
  /**
   * @type {String}
   */
  #text = ''
  /**
   * @type {Array.<Node>}
   */
  #childNodes = []
  /**
   * @type {StringArray}
   */
  #classList = new globalFlexioImport.io.flexio.flex_types.arrays.StringArray()
  /**
   * @type {?String}
   */
  #id = null
  /**
   * @type {StringArray}
   */
  #afterBeginHTML = new globalFlexioImport.io.flexio.flex_types.arrays.StringArray()
  /**
   * @type {StringArray}
   */
  #beforeEndHTML = new globalFlexioImport.io.flexio.flex_types.arrays.StringArray()
  /**
   * @type {ChildNodesSequenceList}
   */
  #childNodeSequenceList = new globalFlexioImport.io.flexio.flexio_hyperflex.types.ChildNodesSequenceList()

  /**
   * @return {ChildNodesSequenceList}
   */
  childNodeSequenceList() {
    return this.#childNodeSequenceList
  }

  /**
   * @return {StringArray}
   */
  afterBeginHTML() {
    return this.#afterBeginHTML
  }

  /**
   * @return {StringArray}
   */
  beforeEndHTML() {
    return this.#beforeEndHTML
  }

  /**
   * @return {Object.<String, String>}
   */
  styles() {
    return this.#styles
  }

  /**
   * @return {Object.<String, String>}
   */
  attributes() {
    return this.#attributes
  }

  /**
   * @return {Object.<String, String>}
   */
  properties() {
    return this.#properties
  }

  /**
   * @return {String}
   */
  text() {
    return this.#text
  }

  /**
   * @return {String}
   */
  id() {
    return this.#id
  }

  /**
   * @return {array.<Node>}
   */
  childNodes() {
    return this.#childNodes
  }

  /**
   * @return {StringArray}
   */
  classList() {
    return this.#classList
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
    this.#childNodes.push(...childNodes)
    this.#childNodeSequenceList.push(globalFlexioImport.io.flexio.flexio_hyperflex.types.ChildNodesSequence.builder()
      .type(globalFlexioImport.io.flexio.flexio_hyperflex.types.childnodessequence.Type.APPEND_NODE)
      .count(childNodes.length)
      .build())
    return this
  }

  /**
   * @param {(boolean|function():boolean)} statement
   * @param {(Element[]|function():Element[])} value
   * @param {?(Element[]|function():Element[])} [valueFalse=null]
   * @return {this}
   */
  bindChildNodes(statement, value, valueFalse = null) {

    if ((isFunction(statement) ? statement() : statement) === true) {
      this.addChildNodes(isFunction(value) ? value() : value)
    } else {
      valueFalse = isFunction(valueFalse) ? valueFalse() : valueFalse
      if (!isNull(valueFalse)) {
        this.addChildNodes(valueFalse)
      }
    }
    return this
  }

  /**
   * @param {Object.<String, String>} attributes
   * @return {this}
   */
  addAttributes(attributes) {
    this.#attributes = deepMerge(this.#attributes, attributes)
    return this
  }

  /**
   * @param {Object.<String, *>} properties
   * @return {this}
   */
  addProperties(properties) {
    this.#properties = deepMerge(this.#properties, properties)
    return this
  }

  /**
   * @param {String} text
   * @return {this}
   */
  addText(text) {
    this.#text += text
    return this
  }

  /**
   * @param {String} id
   * @return {this}
   */
  setId(id) {
    this.#id = TypeCheck.assertIsString(id)
    return this
  }

  /**
   * @param {Object.<String, String>} styles
   * @returns {this}
   */
  addStyles(styles) {
    this.#styles = deepMerge(this.#styles, styles)
    return this
  }

  /**
   * @param {String} key
   * @param {(boolean|function():boolean)} statement
   * @param {(String|function():String)} attribute
   * @param {(String|function():String)} [attributeFalse=null]
   * @return {this}
   */
  bindAttribute(key, statement, attribute, attributeFalse = null) {

    if ((isFunction(statement) ? statement() : statement) === true) {
      this.#attributes[key] = (isFunction(attribute) ? attribute() : attribute)
    } else {
      attributeFalse = isFunction(attributeFalse) ? attributeFalse() : attributeFalse
      if (!isNull(attributeFalse)) {
        this.#attributes[key] = attributeFalse
      }
    }
    return this
  }

  /**
   * @param {String} property
   * @param {(boolean|function():boolean)} statement
   * @param {(String|function():String)} value
   * @param {(String|function():String)} [valueFalse=null]
   * @return {this}
   */
  bindStyle(property, statement, value, valueFalse = null) {
    const st = (isFunction(statement) ? statement() : statement)

    if (st === true) {
      this.#styles[property] = (isFunction(value) ? value() : value)
    } else {
      valueFalse = isFunction(valueFalse) ? valueFalse() : valueFalse
      if (!isNull(valueFalse)) {
        this.#styles[property] = isFunction(valueFalse) ? valueFalse() : valueFalse
      }
    }
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

    if ((isFunction(statement) ? statement() : statement) === true) {
      this.#properties[key] = (isFunction(property) ? property() : property)
    } else {
      propertyFalse = isFunction(propertyFalse) ? propertyFalse() : propertyFalse
      if (!isNull(propertyFalse)) {

        this.#properties[key] = propertyFalse
      }
    }
    return this
  }

  /**
   * @param {(boolean|function():boolean)} statement
   * @param {(String|string[]|function():String|string[])} classNameTrue
   * @param {(String|string[]|function():String|string[])} [classNameFalse=null]
   * @return {this}
   */
  bindClassName(statement, classNameTrue, classNameFalse = null) {

    if ((isFunction(statement) ? statement() : statement) === true) {
      classNameTrue = (isFunction(classNameTrue)) ? classNameTrue() : classNameTrue
      classNameTrue = (isArray(classNameTrue)) ? classNameTrue : [classNameTrue]
      classNameTrue.forEach(value => {
        this.addClassName(value)
      })
    } else {
      classNameFalse = isFunction(classNameFalse) ? classNameFalse() : classNameFalse
      if (!isNull(classNameFalse)) {
        classNameFalse = (isArray(classNameFalse)) ? classNameFalse : [classNameFalse]
        classNameFalse.forEach(value => {
          this.addClassName(value)
        })
      }
    }
    return this
  }

  /**
   * @param {...string} className
   * @return {this}
   */
  addClassName(...className) {
    this.#classList.push(...className)
    return this
  }

  /**
   * @param {...string} HTMLTxt
   * @return {this}
   */
  prependHTML(...HTMLTxt) {
    this.#afterBeginHTML.push(...HTMLTxt.reverse())
    this.#childNodeSequenceList.push(globalFlexioImport.io.flexio.flexio_hyperflex.types.ChildNodesSequence.builder()
      .type(globalFlexioImport.io.flexio.flexio_hyperflex.types.childnodessequence.Type.PREPEND_HTML)
      .count(HTMLTxt.length)
      .build())
    return this
  }

  /**
   * @param {...string} HTMLTxt
   * @return {this}
   */
  appendHTML(...HTMLTxt) {
    this.#beforeEndHTML.push(...HTMLTxt)
    this.#childNodeSequenceList.push(globalFlexioImport.io.flexio.flexio_hyperflex.types.ChildNodesSequence.builder()
      .type(globalFlexioImport.io.flexio.flexio_hyperflex.types.childnodessequence.Type.APPEND_HTML)
      .count(HTMLTxt.length)
      .build())
    HTMLTxt.length
    return this
  }

}
