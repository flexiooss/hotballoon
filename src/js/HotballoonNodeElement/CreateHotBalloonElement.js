import {HotballoonElementParams} from './HotballoonElementParams.js'
import {HyperFlex} from '../__import__flexio-hyperflex.js'
import {$} from './HotBalloonAttributeHandler.js'
import {RECONCILIATION_RULES} from '../__import__flexio-nodes-reconciliation.js'

/**
 * @extends HyperFlex
 */
class CreateHotBalloonElement extends HyperFlex {
  /**
   * @type {View}
   */
  #scope
  /**
   * @type {?HotBalloonAttributeHandler}
   */
  #$element = null
  /**
   * @param {View} scope
   * @param {string} querySelector
   * @param {HotballoonElementParams} hotballoonElementParams
   * @param {Document} document
   */
  constructor(scope, querySelector, hotballoonElementParams = new HotballoonElementParams(), document) {
    super(querySelector, hotballoonElementParams, document)
    this.#scope = scope
  }

  /**
   * @static
   * @override
   * @param {View} scope
   * @param {string} querySelector - tag#id.class[.class,...]
   * @param {HotballoonElementParams} hotballoonElementParams
   * @param {Document} document
   * @return {Element}
   */
  static html(scope, querySelector, hotballoonElementParams, document) {
    return new CreateHotBalloonElement(
      scope,
      querySelector,
      hotballoonElementParams,
      document
    )
      .createHtmlElement()
      .#changeIdAndSetNodeRef()
      .element()
  }

  /**
   * @override
   * @return {CreateHotBalloonElement}
   */
  _setParams() {
    this.#$element = $(this._element)
    super._setParams()
    return this
      .#setViews(this._params.views())
      .#setReconciliationRule(this._params.reconciliationRules())
      .#setReconciliationProperties(new Set(Object.keys(this._params.properties())))
      .#setEventListeners(this._params.eventListeners())
  }

  /**
   * @return {CreateHotBalloonElement}
   */
  #changeIdAndSetNodeRef() {
    const shortId = this._element.id
    if (shortId) {
      this._element.id = this.#scope.elementIdFromRef(shortId)
      this.#setNodeRef(shortId, this._element)
    }
    return this
  }

  /**
   * @description alias of hotballoon/View:addNodeRef
   * @param {String} key
   * @param {Element} node
   * @return {CreateHotBalloonElement}
   */
  #setNodeRef(key, node) {
    this.#scope.addNodeRef(key, node)
    return this
  }

  /**
   *
   * @param {array.<View>} views
   * @return {CreateHotBalloonElement}
   */
  #setViews(views) {
    this.#ensureChildrenRules(views)
    const countOfViews = views.length
    for (let i = 0; i < countOfViews; i++) {
      this.#ensureSubViewRenderedMounted(views[i])
    }
    return this
  }

  /**
   * @param {array.<View>} views
   * @return {CreateHotBalloonElement}
   */
  #ensureChildrenRules(views) {
    if (views.length) {
      if (!this._params.reconciliationRules().has(RECONCILIATION_RULES.FORCE) ) {
        this._params.addReconciliationRules([RECONCILIATION_RULES.BYPASS_CHILDREN])
      }
    }
    return this
  }

  /**
   * @param {View} view
   */
  #ensureSubViewRenderedMounted(view) {
    if (!view.isRendered() && !view.isMounted()) {
      view.render()
      view.mountInto(this._element)
    }
  }

  /**
   * @param {Set<string>} rules
   * @return {CreateHotBalloonElement}
   */
  #setReconciliationRule(rules) {
    this.#$element.addReconcileRules(rules)
    return this
  }

  /**
   * @param {Array.<ElementEventListenerConfig>} listeners
   * @return {CreateHotBalloonElement}
   */
  #setEventListeners(listeners) {
    listeners.forEach((nodeEventListenerParam) => {
      this.#$element.on(nodeEventListenerParam)
    })
    return this
  }

  /**
   * @param {Set<string>} propertiesToReconciliate
   * @return {CreateHotBalloonElement}
   */
  #setReconciliationProperties(propertiesToReconciliate) {
    this.#$element.addReconcileProperties(propertiesToReconciliate)
    return this
  }
}

export const html = CreateHotBalloonElement.html
