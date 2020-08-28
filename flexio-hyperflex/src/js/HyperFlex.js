import {assert, assertType, isNull, isObject, isString} from '@flexio-oss/js-commons-bundle/assert'
import {HyperFlexParams} from './HyperFlexParams'

const _querySelector_ = Symbol.for('_querySelector_')
const _document = Symbol.for('_document')

class HyperFlex {
  /**
   *
   * @param {string} querySelector
   * @param {HyperFlexParams} hyperFlexParams
   * @param {Document} document
   * @return {HyperFlex}
   */
  constructor(querySelector, hyperFlexParams, document) {
    assertType(isString(querySelector),
      'flexio-hyperflex:constructor: `querySelector` argument assertType be a String `%s` given',
      typeof querySelector
    )
    assertType(hyperFlexParams instanceof HyperFlexParams,
      'flexio-hyperflex:constructor: `hyperFlexParams` property should be an instanceof `HyperFlexParams`, `%s` given',
      typeof hyperFlexParams
    )
    /**
     *
     * @params {string}
     * @private
     */
    this[_querySelector_] = querySelector
    /**
     *
     * @type {Document}
     * @private
     */
    this[_document] = document

    /**
     *
     * @params {HyperFlexParams}
     * @protected
     */
    this._params = hyperFlexParams
    /**
     *
     * @params {Element}
     * @protected
     */
    this._element = null

  }

  /**
   * @static
   * @param {string} querySelector
   * @param {HyperFlexParams} hyperFlexParams
   * @param {Document} document
   * @return {Element}
   */
  static html(querySelector, hyperFlexParams, document) {
    return new HyperFlex(querySelector, hyperFlexParams, document).createHtmlElement()._element
  }

  /**
   * Create Html Element and set `_element` property
   * @return {HyperFlex}
   */
  createHtmlElement() {
    const {
      tag,
      id,
      classList
    } = this._parseQuerySelector(this.querySelector())

    this._element = this[_document].createElement(tag)

    return this._setId(id)
      ._setClassList(classList)
      ._setParams()
  }

  /**
   *
   * @return {Element}
   */
  element() {
    return this._element
  }

  /**
   *
   * @return {string}
   */
  querySelector() {
    return this[_querySelector_]
  }

  /**
   *
   * @param {string} querySelector : tag#myId.class1.class2...
   * @returns {Object} { tag: String, id: String, classList: Array<String> }
   *
   */
  _parseQuerySelector(querySelector) {
    const matches = new RegExp('^([\\w-]*)([#\\w\\d-_]*)?([.\\w\\d-_]*)?$', 'gi').exec(querySelector)
    assert(
      matches !== null,
      'query selector \'' + querySelector + '\' does not match the right format : ([\\w-]*)([#\\w\\d-_]*)?([.\\w\\d-_]*)? expected'
    )
    const tag = matches[1]
    assertType(!!tag,
      'flexio-hyperflex:parseQuerySelector: `tag` argument assertType not be empty'
    )
    const id = (matches[2]) ? matches[2].substr(1) : ''
    const classList = (matches[3]) ? matches[3].substr(1).split('.') : []
    return {
      tag,
      id,
      classList
    }
  }

  /**
   *
   * @protected
   * @param {string} id
   * @return {HyperFlex}
   */
  _setId(id) {
    if (id) {
      this._element.id = id
    }
    if (!isNull(this._params.id())) {
      this._element.id = this._params.id()
    }
    return this
  }

  /**
   * @protected
   * @return {HyperFlex}
   */
  _setParams() {
    return this._setAttributes(this._params.attributes())
      ._setProperties(this._params.properties())
      ._setClassList(this._params.classList())
      ._setStyles(this._params.styles())
      ._setText(this._params.text())
      ._setChildNodes(this._params.childNodes())
  }

  /**
   * @protected
   * @param {Object} styles
   * @return {HyperFlex}
   */

  _setStyles(styles) {
    assertType(isObject(styles),
      'flexio-hyperflex:setStyles: `styles` argument assertType be an Object `%s` given',
      typeof styles
    )

    for (const key in styles) {
      if (styles.hasOwnProperty(key)) {
        this._element.style[key] = styles[key]
      }
    }
    return this
  }

  /**
   * @protected
   * @param {Object} attributes
   * @return {HyperFlex}
   */
  _setAttributes(attributes) {
    assertType(isObject(attributes),
      'flexio-hyperflex:setAttributes: `attributes` argument assertType be an Object `%s` given',
      typeof attributes
    )

    for (const key in attributes) {
      if (attributes.hasOwnProperty(key) && attributes[key] !== null) {
        this._element.setAttribute(key, attributes[key])
      }
    }
    return this
  }

  /**
   * @protected
   * @param {Object} properties
   * @return {HyperFlex}
   */
  _setProperties(properties) {
    assertType(isObject(properties),
      'flexio-hyperflex:_setProperties: `properties` argument assertType be an Object `%s` given',
      typeof properties
    )

    for (const key in properties) {
      if (properties.hasOwnProperty(key) && properties[key] !== null) {
        this._element[key] = properties[key]
      }
    }
    return this
  }

  /**
   *
   * @protected
   * @param {Array<String>} classList
   * @return {HyperFlex}
   */
  _setClassList(classList) {
    if (classList.length) {
      this._element.classList.add(...classList)
    }
    return this
  }

  /**
   * @protected
   * @param {string} text
   * @return {HyperFlex}
   */
  _setText(text) {
    if (text !== '') {
      this._element.appendChild(this[_document].createTextNode(text))
    }
    return this
  }

  /**
   *
   * @protected
   * @param {Array<Node>} childNodes
   * @return {HyperFlex}
   */
  _setChildNodes(childNodes) {
    const countOfChildren = childNodes.length
    for (let i = 0; i < countOfChildren; i++) {
      this._element.appendChild(childNodes[i])
    }
    return this
  }
}

export {HyperFlex}
export const html = HyperFlex.html
