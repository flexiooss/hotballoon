'use strict'
import {HotballoonElementParams} from './HotballoonElementParams'
import {assert, isObject, isNode} from 'flexio-jshelpers'
import {HyperFlex} from 'flexio-hyperflex'
import {$} from './HotBalloonAttributeHandler'

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
      .createHtmlElement()
      .__changeIdAndSetNodeRef()
      ._element
  }

  /**
   *
   * @private
   * @return {CreateHotBalloonElement}
   */
  __changeIdAndSetNodeRef() {
    const shortId = this._element.id
    if (shortId) {
      this._element.id = this.__generateIdFromScope(shortId)
      this._setNodeRef(shortId, this._element)
    }
    return this
  }

  /**
   *
   * @private
   * @param {String} id
   * @return {String}
   */
  __generateIdFromScope(id) {
    return this._scope.APP()._ID +
      '-' + this._scope.Component()._ID +
      '-' + this._scope.Container()._ID +
      '-' + id
  }

  /**
   * @description alias of hotballoon/View:addNodeRef
   * @param {String} key
   * @param {Node} node
   * @return {CreateHotBalloonElement}
   * @private
   */
  _setNodeRef(key, node) {
    this._scope.addNodeRef(key, node)
    return this
  }

  /**
   * @private
   * @override
   * @return {CreateHotBalloonElement}
   */
  _setParams() {
    this._$element = $(this._element)
    super._setParams()
    return this._setViews(this._params.views)
      .__setReconciliationRule(this._params.reconciliationRules)
      .__setReconciliationProperties(Object.keys(this._params.properties))
      .__setEventListeners(this._params.eventListeners)
  }

  /**
   *
   * @param {array<View>} views
   * @return {CreateHotBalloonElement}
   * @private
   */
  _setViews(views) {
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
  __setReconciliationRule(rules) {
    this._$element.addReconcileRules(rules)
    return this
  }

  /**
   * @private
   * @param {Array<NodeEventListenerParam>} listeners
   * @return {CreateHotBalloonElement}
   */
  __setEventListeners(listeners) {
    listeners.forEach((v) => {
      this._$element.on(v.event, v.callback, v.options)
    })
    return this
  }

  /**
   * @private
   * @param {Array<string>} propertiesToReconciliate
   * @return {CreateHotBalloonElement}
   */
  __setReconciliationProperties(propertiesToReconciliate) {
    this._$element.addReconcileProperties(propertiesToReconciliate)
    return this
  }
}

export const html = CreateHotBalloonElement.html
