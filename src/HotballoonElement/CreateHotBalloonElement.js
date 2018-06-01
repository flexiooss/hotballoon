'use strict'
import {
  assert,
  HyperFlex,
  isString,
  isNumber,
  isNode,
  isObject
} from 'flexio-jshelpers'
import { select as $$ } from './HotBalloonAttributeHandler'
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
   * @param {mixed} args - attributes, style, childs, text
   * @example html(this, 'div#MyID.class1.class2', {data-type: 'myType', style:{color: '#000'}}, 'My Text', html(this, 'div#MyChildID','Child'))
   * @returns {NodeElement}
   */
  static html(scope, querySelector, ...args) {
    const elFactory = new CreateHotBalloonElement(scope, querySelector, ...args)
    let el = elFactory._createElement()
    elFactory._changeIdAndSetNodeRef(el)
    return el
  }

  /**
   *
   * @private
   * @param {DomElement} element
   */
  _changeIdAndSetNodeRef(element) {
    const shortId = element.id
    if (shortId) {
      element.id = this._generateIdFromScope(element.id)
      this._setNodeRef(shortId, element)
    }
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
    let countOfArgs = args.length

    for (let i = 0; i < countOfArgs; i++) {
      const arg = args[i]

      if (isNode(arg)) {
        element.appendChild(arg)
      } else if (isString(arg) || isNumber(arg)) {
        element.appendChild(document.createTextNode(arg))
      } else if (this._hasSameHBClassName(arg, this.scope)) {
        element.appendChild(arg.node())
      } else if (isObject(arg)) {
        this._setAttributes(element, arg)
      }
    }
    return element
  }

  _hasSameHBClassName(object1, object2) {
    return isObject(object1) && isObject(object2) && ('__HB__CLASSNAME__' in object1) && ('__HB__CLASSNAME__' in object2) && (object1.__HB__CLASSNAME__ === object2.__HB__CLASSNAME__)
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
      } else {
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
    $$(element).addReconcileRules(rules)
  }
}

export const html = CreateHotBalloonElement.html
