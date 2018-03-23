'use strict'
import {
  assert,
  HyperFlex,
  isString,
  isNumber,
  isNode,
  isObject
} from 'flexio-jshelpers'

import {
  select as $$
} from './HotBalloonAttributeHandler'

import {
  KEY
} from './constantes'
import {
  KEY_RECONCILIATE_RULES
} from 'flexio-nodes-reconciliation'

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
    return new CreateHotBalloonElement(scope, querySelector, ...args)._createElement()
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
      } else if (key === KEY.NODE_REF) {
        this._setNodeRef(element, attribut)
      } else if (key === KEY_RECONCILIATE_RULES) {
        this._setReconciliationRule(element, attribut)
      } else {
        element.setAttribute(key, attribut)
      }
    }
  }

  /**
     * @private
     * @param {NodeElement} node
     * @param {String} key
     * @description alias of hotballoon/View:addNodeRef
     */
  _setNodeRef(node, key) {
    this.scope.addNodeRef(key, node)
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
