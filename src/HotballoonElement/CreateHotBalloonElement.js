'use strict'
import {HotballoonElementParams} from './HotballoonElementParams'
import {assert, isObject, isNode} from 'flexio-jshelpers'
import {HyperFlex} from 'flexio-hyperflex'
import {$} from './HotBalloonAttributeHandler'
import {KEY_RECONCILIATE_RULES} from 'flexio-nodes-reconciliation'

/**
 * @class
 * @extends HyperFlex - flexio-jshelpers
 */
class CreateHotBalloonElement extends HyperFlex {
  /**
   *
   * @param  {View} scope
   * @param {string} querySelector
   * @param {HotballoonElementParams} hotballoonElementParams
   * @return {CreateHotBalloonElement}
   */
  constructor(scope, querySelector, hotballoonElementParams) {
    super(querySelector, hotballoonElementParams)
    this.scope = scope
  }

  /**
   * @static
   * @description Helper for create a Node
   * @param {Object} scope - View instance
   * @param {String} querySelector - tag#id.class[.class,...]
   * @param {Node} [child] child
   * @param {mixed} args - attributes, style, childs, text
   * @example html(this, 'div#MyID.class1.class2', {data-type: 'myType', style:{color: '#000'}}, 'My Text', html(this, 'div#MyChildID','Child'))
   * @returns {No}
   */
  // static html(scope, querySelector, ...args) {
  //   const elFactory = new CreateHotBalloonElement(scope, querySelector, ...args)
  //   let el = elFactory._createElement()
  //   return elFactory._changeIdAndSetNodeRef(el)
  // }

  /**
   * @static
   * @param {View} scope
   * @param {string} querySelector - tag#id.class[.class,...]
   * @param {HotballoonElementParams} hotballoonElementParams
   * @return {Node}
   */
  static html(scope, querySelector, hotballoonElementParams) {
    const elFactory = new CreateHotBalloonElement(scope, querySelector, hotballoonElementParams)
    elFactory.createHtmlElement()
    return elFactory._changeIdAndSetNodeRef()
  }

  /**
   *
   * @private
   * @param {Node} element
   * @return {Node} element
   */
  _changeIdAndSetNodeRef(element) {
    const shortId = element.id
    if (shortId) {
      element.id = this._generateIdFromScope(element.id)
      this._setNodeRef(shortId, element)
    }
    return element
  }

  /**
   *
   * @private
   * @param {String} id
   * @return {String} id
   */
  _generateIdFromScope(id) {
    return this.scope.APP()._ID + '-' + this.scope.Component()._ID + '-' + this.scope.ViewContainer()._ID + '-' + id
  }

  /**
   * @private
   * @param {String} key
   * @param {Node} node
   * @description alias of hotballoon/View:addNodeRef
   */
  _setNodeRef(key, node) {
    this.scope.addNodeRef(key, node)
  }

  /**
   * @private
   * @param {Node} element
   * @param {...var} arguments
   * @returns {Node} element
   */
  _parseArguments(element) {
    // console.log('_parseArguments')

    assert(isNode(element),
      'flexio-jshelpers:parseArguments: `element` argument assert be a Node `%s` given',
      typeof element
    )

    const args = [...this.args][0]
    console.log('args')
    console.log(element)
    console.log(args)
    assert(args instanceof HotballoonElementParams,
      'hotballoon:_parseArguments: `args` property should be an instanceof `HotballoonElementParams`, `%s` given',
      typeof args
    )

    this._setAttributes(element, args._attributes)
    this._setStyles(element, args._style)
    this._setReconciliationRule(element, args._reconciliationRules)

    if (args._text !== '') {
      element.appendChild(document.createTextNode(args._text))
    }

    const countOfChildren = args._children.length
    console.log('countOfChildren')
    console.log(countOfChildren)
    for (let i = 0; i < countOfChildren; i++) {
      const child = args._children[i]
      child.parentNode = element
      child.renderAndMount()
    }

    return element
  }

  /**
   * @private
   * @param {Node} element
   * @param {Object<string, string>} attributes
   * @returns {void}
   */
  _setAttributes(element, attributes) {
    assert(isNode(element),
      'flexio-jshelpers:setAttributes: `element` argument assert be a Node `%s` given',
      typeof element
    )
    assert(isObject(attributes),
      'flexio-jshelpers:setAttributes: `attributes` argument assert be an Object `%s` given',
      typeof attributes
    )
    for (let key in attributes) {
      let attribut = attributes[key]
      if (key === 'style') {
        this._setStyles(element, attribut)
      } else if (key === KEY_RECONCILIATE_RULES) {
        this._setReconciliationRule(element, attribut)
      } else if (attribut !== null) {
        element.setAttribute(key, attribut)
      }
    }
  }

  /**
   * @private
   * @param {Node} element
   * @param {Array<string>} rules
   */
  _setReconciliationRule(element, rules) {
    $(element).addReconcileRules(rules)
  }
}

export const html = CreateHotBalloonElement.html
