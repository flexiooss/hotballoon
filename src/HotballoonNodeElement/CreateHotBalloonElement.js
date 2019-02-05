'use strict'
import {HotballoonElementParams} from './HotballoonElementParams'
import {HyperFlex} from 'flexio-hyperflex'
import {$} from './HotBalloonAttributeHandler'
import {toString} from 'flexio-jshelpers'

const _changeIdAndSetNodeRef = Symbol('_changeIdAndSetNodeRef')
const _generateIdFromScope = Symbol('_generateIdFromScope')
const _setNodeRef = Symbol('_setNodeRef')
const _setReconciliationRule = Symbol('_setReconciliationRule')
const _setViews = Symbol('_setViews')
const _setReconciliationProperties = Symbol('_setReconciliationProperties')
const _setEventListeners = Symbol('_setEventListeners')

/**
 * @class
 * @extends HyperFlex
 */
class CreateHotBalloonElement extends HyperFlex {
  /**
   *
   * @param {View} scope
   * @param {string} querySelector
   * @param {HotballoonElementParams} hotballoonElementParams
   * @return {CreateHotBalloonElement}
   */
  constructor(scope, querySelector, hotballoonElementParams = new HotballoonElementParams()) {
    super(querySelector, hotballoonElementParams)
    /**
     *
     * @type {View}
     * @private
     */
    this._scope = scope
    /**
     *
     * @type {HotBalloonAttributeHandler | null}
     * @private
     */
    this._$element = null
  }

  /**
   * @static
   * @override
   * @param {View} scope
   * @param {string} querySelector - tag#id.class[.class,...]
   * @param {HotballoonElementParams} hotballoonElementParams
   * @return {Node}
   */
  static html(scope, querySelector, hotballoonElementParams) {
    return new CreateHotBalloonElement(scope, querySelector, hotballoonElementParams)
      .createHtmlElement()[_changeIdAndSetNodeRef]()
      ._element
  }

  /**
   * @override
   * @return {CreateHotBalloonElement}
   */
  _setParams() {
    this._$element = $(this._element)
    super._setParams()
    return this[_setViews](this._params.views)[_setReconciliationRule](this._params.reconciliationRules)[_setReconciliationProperties](Object.keys(this._params.properties))[_setEventListeners](this._params.eventListeners)
  }

  /**
   *
   * @private
   * @return {CreateHotBalloonElement}
   */
  [_changeIdAndSetNodeRef]() {
    const shortId = this._element.id
    if (shortId) {
      this._element.id = this[_generateIdFromScope](shortId)
      this[_setNodeRef](shortId, this._element)
    }
    return this
  }

  /**
   *
   * @private
   * @param {String} id
   * @return {String}
   */
  [_generateIdFromScope](id) {
    return `${toString(this._scope.APP().ID)}-${toString(this._scope.componentContext().ID)}-${toString(this._scope.container().ID)}-${toString(id)}`
  }

  /**
   * @description alias of hotballoon/View:addNodeRef
   * @param {String} key
   * @param {Node} node
   * @return {CreateHotBalloonElement}
   * @private
   */
  [_setNodeRef](key, node) {
    this._scope.addNodeRef(key, node)
    return this
  }

  /**
   *
   * @param {array<view>} views
   * @return {CreateHotBalloonElement}
   * @private
   */
  [_setViews](views) {
    const countOfViews = views.length
    for (let i = 0; i < countOfViews; i++) {
      views[i].parentNode = this._element
      views[i].renderAndMount()
    }
    return this
  }

  /**
   * @private
   * @param {Array<string>} rules
   * @return {CreateHotBalloonElement}
   */
  [_setReconciliationRule](rules) {
    this._$element.addReconcileRules(rules)
    return this
  }

  /**
   * @private
   * @param {Array<NodeEventListenerParam>} listeners
   * @return {CreateHotBalloonElement}
   */
  [_setEventListeners](listeners) {
    listeners.forEach((nodeEventListenerParam) => {
      this._$element.on(nodeEventListenerParam)
    })
    return this
  }

  /**
   * @private
   * @param {Array<string>} propertiesToReconciliate
   * @return {CreateHotBalloonElement}
   */
  [_setReconciliationProperties](propertiesToReconciliate) {
    this._$element.addReconcileProperties(propertiesToReconciliate)
    return this
  }
}

export const html = CreateHotBalloonElement.html
