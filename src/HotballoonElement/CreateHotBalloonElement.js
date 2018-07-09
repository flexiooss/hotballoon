'use strict'
import { isEqualTagClassName } from '../CLASS_TAG_NAME'
import { assert, isString, isNumber, isNode, isObject } from 'flexio-jshelpers'
import { HyperFlex } from 'flexio-hyperflex'
import { select as $ } from './HotBalloonAttributeHandler'
import { KEY_RECONCILIATE_RULES } from 'flexio-nodes-reconciliation'

/**
 * @class
 * @extends HyperFlex - flexio-jshelpers
 */
class CreateHotBalloonElement extends HyperFlex {
  constructor(scope, querySelector, ...args) {
    super(querySelector, ...args)
    this.scope = scope
  }

  /**
   * @static
   * @description Helper for create a NodeElement
   * @param {Object} scope - View instance
   * @param {String} querySelector - tag#id.class[.class,...]
   * @param {NodeElement} [child] child
   * @param {mixed} args - attributes, style, childs, text
   * @example html(this, 'div#MyID.class1.class2', {data-type: 'myType', style:{color: '#000'}}, 'My Text', html(this, 'div#MyChildID','Child'))
   * @returns {NodeElement}
   */
  // static html(scope, querySelector, ...args) {
  //   const elFactory = new CreateHotBalloonElement(scope, querySelector, ...args)
  //   let el = elFactory._createElement()
  //   return elFactory._changeIdAndSetNodeRef(el)
  // }

  /**
   *
   * @param {View} scope
   * @param {string} querySelector - tag#id.class[.class,...]
   * @param {HotballoonElementParams} hotballoonElementParam
   */
  static html(scope, querySelector, hotballoonElementParam) {

  }

  /**
   *
   * @private
   * @param {NodeElement} element
   * @return {NodeElement} element
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
   * @returns {String} id
   */
  _generateIdFromScope(id) {
    return this.scope.APP()._ID + '-' + this.scope.Component()._ID + '-' + this.scope.ViewContainer()._ID + '-' + id
  }

  /**
   * @private
   * @param {String} key
   * @param {NodeElement} node
   * @description alias of hotballoon/View:addNodeRef
   */
  _setNodeRef(key, node) {
    this.scope.addNodeRef(key, node)
  }

  /**
   * @private
   * @param {NodeElement} element
   * @param {...var} arguments
   * @returns {NodeElement} element
   */
  _parseArguments(element, ...args) {
    // console.log('_parseArguments')

    assert(isNode(element),
      'flexio-jshelpers:parseArguments: `element` argument assert be a NodeElement `%s` given',
      typeof element
    )
    const countOfArgs = args.length

    for (let i = 0; i < countOfArgs; i++) {
      const arg = args[i]

      if (isNode(arg)) {
        element.appendChild(arg)
      } else if (isString(arg) || isNumber(arg)) {
        element.appendChild(document.createTextNode(arg))
      } else if (isEqualTagClassName(arg, this.scope)) {
        arg.parentNode = element
        arg.renderAndMount()
        // element.appendChild(arg.node())
      } else if (isObject(arg)) {
        this._setAttributes(element, arg)
      }
    }
    return element
  }

  /**
 * @private
 * @param {NodeElement} element
 * @param {Object} attributes
 * @returns {void}
 */
  _setAttributes(element, attributes) {
    assert(isNode(element),
      'flexio-jshelpers:setAttributes: `element` argument assert be a NodeElement `%s` given',
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
   * @param {NodeElement} element
   * @param {Array} rules
   */
  _setReconciliationRule(element, rules) {
    $(element).addReconcileRules(rules)
  }
}

export const html = CreateHotBalloonElement.html
