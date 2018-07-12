'use strict'
import {HotballoonElementParams} from './HotballoonElementParams'
import {assert, isObject, isNode} from 'flexio-jshelpers'
import {HyperFlex} from 'flexio-hyperflex'
import {$} from './HotBalloonAttributeHandler'
import {KEY_RECONCILIATE_RULES} from 'flexio-nodes-reconciliation'

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
   * @return {hotballoon:CreateHotBalloonElement}
   */
  constructor(scope, querySelector, hotballoonElementParams) {
    super(querySelector, hotballoonElementParams)
    /**
     *
     * @type {View}
     * @private
     */
    this._scope = scope
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
      ._changeIdAndSetNodeRef()
      ._element
  }

  /**
   *
   * @private
   * @return {CreateHotBalloonElement}
   */
  _changeIdAndSetNodeRef() {
    const shortId = this._element.id
    if (shortId) {
      this._element.id = this._generateIdFromScope(shortId)
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
  _generateIdFromScope(id) {
    return this._scope.APP()._ID +
      '-' + this._scope.Component()._ID +
      '-' + this._scope.ViewContainer()._ID +
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
    super._setParams()
    return this._setViews(this._hyperFlexParams.reconciliationRules)
      ._setReconciliationRule(this._hyperFlexParams.reconciliationRules)
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
  _setReconciliationRule(rules) {
    $(this._element).addReconcileRules(rules)
    return this
  }
}

export const html = CreateHotBalloonElement.html
