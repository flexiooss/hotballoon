import {
  assert,
  assertInstanceOf,
  assertType,
  isNull,
  isObject,
  isString,
  TypeCheck
} from '@flexio-oss/js-commons-bundle/assert'
import {HyperFlexParams} from './HyperFlexParams'
import {globalFlexioImport} from '@flexio-oss/js-commons-bundle/global-import-registry'

export class HyperFlex {

  /**
   * @type {string}
   */
  #querySelector
  /**
   * @type {Document}
   */
  #document
  /**
   * @type {?Element}
   * @protected
   */
  _element = null
  /**
   * @type {HyperFlexParams}
   * @protected
   */
  _params

  /**
   * @param {string} querySelector
   * @param {HyperFlexParams} hyperFlexParams
   * @param {Document} document
   * @return {HyperFlex}
   */
  constructor(querySelector, hyperFlexParams, document) {
    this.#querySelector = TypeCheck.assertIsString(querySelector)
    this.#document = document
    this._params = assertInstanceOf(hyperFlexParams, HyperFlexParams, 'HyperFlexParams')
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

    this._element = this.#document.createElement(tag)

    return this._setId(id)
      ._setClassList(classList)
      ._setParams()
      ._setChildNodes()
  }

  /**
   * @return {Element}
   */
  element() {
    return this._element
  }

  /**
   * @return {string}
   */
  querySelector() {
    return this.#querySelector
  }

  /**
   * @param {string} querySelector : tag#myId.class1.class2...
   * @returns {Object} { tag: String, id: String, classList: Array<String> }
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
  }

  /**
   * @protected
   * @param {Object} styles
   * @return {HyperFlex}
   */
  _setStyles(styles) {

    for (/**@type{string}*/const key in TypeCheck.assertIsObject(styles)) {
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
    for (/**@type{string}*/const key in TypeCheck.assertIsObject(attributes)) {
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
    for (/**@type{string}*/const key in TypeCheck.assertIsObject(properties)) {
      if (properties.hasOwnProperty(key) && properties[key] !== null) {
        this._element[key] = properties[key]
      }
    }
    return this
  }

  /**
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
      this._element.appendChild(this.#document.createTextNode(text))
    }
    return this
  }

  /**
   * @protected
   * @return {HyperFlex}
   */
  _setChildNodes() {
    new ChildNodesHandler(
      new ChildNodesHandlerConfig(
        this._params.childNodeSequenceList(),
        this._params.childNodes(),
        this._params.afterBeginHTML(),
        this._params.beforeEndHTML(),
        this.element()
      )).insert()

    return this
  }
}

export const html = HyperFlex.html

class ChildNodesHandlerConfig {
  /**
   * @type {HTMLElement}
   */
  #element
  /**
   * @type {ChildNodesSequenceList}
   */
  #childNodeSequenceList
  /**
   * @type {Array<Node>}
   */
  #childNodes
  /**
   * @type {StringArray}
   */
  #afterBeginHTML
  /**
   * @type {StringArray}
   */
  #beforeEndHTML

  /**
   * @return {ChildNodesSequenceList}
   */
  childNodeSequenceList() {
    return this.#childNodeSequenceList
  }

  /**
   * @return {HTMLElement}
   */
  element() {
    return this.#element
  }

  /**
   * @return {Array<Node>}
   */
  childNodes() {
    return this.#childNodes
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
   * @param {ChildNodesSequenceList} childNodeSequenceList
   * @param {Array<Node>} childNodes
   * @param {StringArray} afterBeginHTML
   * @param {StringArray} beforeEndHTML
   * @param {HTMLElement} element
   */
  constructor(childNodeSequenceList, childNodes, afterBeginHTML, beforeEndHTML, element) {
    this.#childNodeSequenceList = childNodeSequenceList
    this.#childNodes = childNodes
    this.#afterBeginHTML = afterBeginHTML
    this.#beforeEndHTML = beforeEndHTML
    this.#element = element
  }
}

class ChildNodesHandler {
  /**
   * @type {ChildNodesHandlerConfig}
   */
  #config
  /**
   * @type {Number}
   */
  #childNodesCursor = 0
  /**
   * @type {Number}
   */
  #afterBeginHTMLCursor = 0
  /**
   * @type {Number}
   */
  #beforeEndHTMLCursor = 0

  /**
   * @param {ChildNodesHandlerConfig} config
   */
  constructor(config) {
    this.#config = assertInstanceOf(config, ChildNodesHandlerConfig, 'ChildNodesHandlerConfig')
  }

  /**
   * @return {ChildNodesHandler}
   */
  insert() {
    for (/**@type{ChildNodesSequence}*/const childNodesSequence of this.#config.childNodeSequenceList()) {
      switch (childNodesSequence.type()) {
        case globalFlexioImport.io.flexio.flexio_hyperflex.types.childnodessequence.ChildNodesSequenceType.APPEND_NODE:
          this.#appendNode(childNodesSequence.count())
          break
        case globalFlexioImport.io.flexio.flexio_hyperflex.types.childnodessequence.ChildNodesSequenceType.PREPEND_HTML:
          this.#prependHTML(childNodesSequence.count())
          break
        case globalFlexioImport.io.flexio.flexio_hyperflex.types.childnodessequence.ChildNodesSequenceType.APPEND_HTML:
          this.#appendHTML(childNodesSequence.count())
          break
        default:
          throw new Error('insert node type not recognized : ' + childNodesSequence.type())
      }
    }
    return this
  }

  /**
   * @param {number} count
   * @return {ChildNodesHandler}
   */
  #appendNode(count) {
    for (let i = 0; i < count; i++) {
      this.#config.element().appendChild(this.#config.childNodes()[this.#childNodesCursor])
      this.#childNodesCursor++
    }
    return this
  }

  /**
   * @param {number} count
   * @return {ChildNodesHandler}
   */
  #prependHTML(count) {
    for (let i = 0; i < count; i++) {
      this.#config.element().insertAdjacentHTML('afterbegin', this.#config.afterBeginHTML().get(this.#afterBeginHTMLCursor))
      this.#afterBeginHTMLCursor++
    }
    return this
  }

  /**
   * @param {number} count
   * @return {ChildNodesHandler}
   */
  #appendHTML(count) {
    for (let i = 0; i < count; i++) {
      this.#config.element().insertAdjacentHTML('beforeend', this.#config.beforeEndHTML().get(this.#beforeEndHTMLCursor))
      this.#beforeEndHTMLCursor++
    }
    return this
  }
}
