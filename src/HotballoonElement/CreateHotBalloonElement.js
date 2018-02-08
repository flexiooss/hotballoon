import {
  should,
  HyperFlex,
  isString,
  isNumber,
  isNode,
  isObject,
  hasParentPrototypeName
} from 'flexio-jshelpers'

import {
  KEY
} from './constantes'
import {
  KEY_RECONCILIATE_RULES
} from 'flexio-nodes-reconciliation'

class CreateHotBalloonElement extends HyperFlex {
  constructor(scope, querySelector, ...args) {
    super(querySelector, ...args)
    this.scope = scope
  }
  /**
     *
     * @param {NodeElement} element
     * @param {...var} arguments
     * @returns {NodeElement} element
     */
  _parseArguments(element, ...args) {
    should(isNode(element),
      'flexio-jshelpers:parseArguments: `element` argument should be a NodeElement `%s` given',
      typeof element
    )
    let countOfArgs = args.length
    for (let i = 0; i < countOfArgs; i++) {
      const arg = args[i]
      if (isNode(arg)) {
        element.appendChild(arg)
      } else if (isString(arg) || isNumber(arg)) {
        element.appendChild(document.createTextNode(arg))
      } else if (hasParentPrototypeName(arg, 'View')) {
        this._setAttributes(element, arg)
      } else if (isObject(arg)) {
        this._setAttributes(element, arg)
      }
    }
    return element
  }

  /**
     *
     * @param {NodeElement} element
     * @param {Object} attributes
     * @returns {void}
     */
  _setAttributes(element, attributes) {
    should(isNode(element),
      'flexio-jshelpers:setAttributes: `element` argument should be a NodeElement `%s` given',
      typeof element
    )
    should(isObject(attributes),
      'flexio-jshelpers:setAttributes: `attributes` argument should be an Object `%s` given',
      typeof attributes
    )
    for (let key in attributes) {
      let attribut = attributes[key]
      if (key === 'style') {
        this._setStyles(element, attribut)
      } else if (key === KEY.NODE_REF) {
        this.scope.addNodeRef(element, attribut)
      } else if (key === KEY_RECONCILIATE_RULES) {
        this._setNodeRef(element, attribut)
      } else {
        element.setAttribute(key, attribut)
      }
    }
  }
}
export {
  CreateHotBalloonElement
}
export const html = CreateHotBalloonElement.html
