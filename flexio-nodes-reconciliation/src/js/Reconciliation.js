import {isNode, assert, isNull, isNodeDocumentFragment} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {removeChildNodes} from '@flexio-oss/js-commons-bundle/js-type-helpers/index.js'
import {select} from './ListenerAttributeHandler'
import {nodeReconcile} from './NodeReconciliation'
import {listenerEquals, listenerReconcile, listenerReplace} from './ListenerReconciliation'
import {RECONCILIATION_RULES as R} from './rules'
import {ReconciliationException} from "./ReconciliationException";


const MAX_SLIBINGS_NODES_UPDATE_BY_ID = 500


/**
 * @param {Element} current
 * @param {Element} candidate
 * @param {Element} parentCurrent Parent of current element
 */

export class Reconciliation {
  /**
   * @param {Element} current
   * @param {Element} candidate
   * @param {Element} parentCurrent
   */
  constructor(current, candidate, parentCurrent = null) {
    assert(isNode(current) && isNode(candidate),
      'Reconciliation: `current : %s` and  `candidate : %s` arguments assert be Node',
      typeof current, typeof candidate)

    /**
     * @params {Element}
     */
    this.current = current
    /**
     * @params {Element | null}
     */
    this.parentCurrent = parentCurrent
    /**
     *
     * @params {ListenerAttributeHandler}
     */
    this.$parentCurrent = this.castAttributes(parentCurrent)
    /**
     * @params {Element}
     */
    this.candidate = candidate
    /**
     * @params {ListenerAttributeHandler}
     */
    this.$current = this.castAttributes(current)
    /**
     * @params {ListenerAttributeHandler}
     */
    this.$candidate = this.castAttributes(candidate)
    /**
     * @params {(null|boolean)}
     * @private
     */
    this._equalNode = null
    /**
     * @params {(null|boolean)}
     * @private
     */
    this._equalListeners = null
    /**
     * @params {(null | boolean)}
     * @private
     */
    this._equalWithoutChildren = null
    /**
     * @params {boolean}
     * @private
     */
    this._isCurrentReplaced = false

    /**
     * @params {boolean}
     * @protected
     */
    this._rootReconciliation = false
  }

  /**
   * @param {boolean} rootReconciliation
   * @return {Reconciliation}
   */
  withRootReconciliation(rootReconciliation) {
    this._rootReconciliation = rootReconciliation
    return this
  }

  /**
   * @return {boolean}
   */
  isRootElementReconcile() {
    return this._rootReconciliation === true
  }

  /**
   * @param {Element} element
   * @return {AttributeHandler}
   */
  castAttributes(element) {
    return select(element)
  }

  /**
   * @static
   * @param {Element} current
   * @param {Element} candidate
   * @param {Element} parentCurrent Parent of current element
   * @return {boolean}
   */
  static reconciliation(current, candidate, parentCurrent) {
    return new Reconciliation(current, candidate, parentCurrent).reconcile()
  }

  /**
   * @static
   * @param {Element} current
   * @param {Element} candidate
   * @param {Element} parentCurrent Parent of current element
   * @return {boolean}
   */
  static startReconciliation(current, candidate, parentCurrent) {
    return new Reconciliation(current, candidate, parentCurrent)
      .withRootReconciliation(true)
      .reconcile()
  }

  /**
   * @param {Element} current
   * @param {Element} candidate
   * @param {Element} parentCurrent Parent of current element
   * @return {boolean}
   */
  reconciliation(current, candidate, parentCurrent) {
    return new Reconciliation(current, candidate, parentCurrent).reconcile()
  }

  /**
   * @return {boolean}
   * @throws ReconciliationException
   */
  reconcile() {

    if (this._isDocumentFragment()) {
      this.__reconcileChildNodes()
    } else {
      if (this._hasByPassRule()) return this._abort()

      if (this._hasOnlyChildrenRule()) {
        if (this._hasReplaceRule()) throw new ReconciliationException('REPLACE rule can not be applied with ONLY_CHILDREN rule')
        if (this._hasExcludeChildrenRule()) throw new ReconciliationException('BYPASS_CHILDREN rule can not be applied with ONLY_CHILDREN rule')

        this.__reconcileChildNodes()
      } else {
        if (this._hasReplaceRule()) {
          this.__updateCurrent()
        } else if (this.__isEqualNode()) {
          if ((!this._hasReconcileListenersRule() && !this._hasForceListenersRule())
            || (this._hasReconcileListenersRule() && this.__isEqualListeners())) return this._abort()
        } else {
          if (!this.__isEqualWithoutChildren()) {
            this.__updateCurrent()
          }

          if ((!this._isCurrentReplaced && !this._hasExcludeChildrenRule())) {
            this.__reconcileChildNodes()
          }
        }
      }

      if (!this._isCurrentReplaced && this._hasForceListenersRule()) {
        listenerReplace(this.current, this.$current, this.candidate, this.$candidate)
      } else if (!this._hasOnlyChildrenRule() && this._hasReconcileListenersRule() && !this._isCurrentReplaced && !this.__isEqualListeners()) {
        listenerReconcile(this.current, this.$current, this.candidate, this.$candidate)
      }
    }

    return this._isCurrentReplaced
  }

  /**
   * @private
   */
  __updateCurrent() {
    this._isCurrentReplaced = nodeReconcile(this.current, this.$current, this.candidate, this.$candidate)
  }

  /**
   * @private
   * @method
   * @description
   */
  __reconcileChildNodes() {
    if (this.candidate.hasChildNodes()) {
      this.__traverseChildNodes()
    } else if (this.current.hasChildNodes()) {
      removeChildNodes(this.current)
    }
  }

  /**
   * @private
   * @description traverse and reconcile slibing's nodes
   */
  __traverseChildNodes() {
    /**
     * @type {?Element}
     */
    let currentRef = (this.current.hasChildNodes()) ? this.current.firstChild : null
    /**
     * @type {?Element}
     */
    let candidate = this.candidate.firstChild
    /**
     * @type {number}
     */
    let i = 0

    do {
      /**
       * @type {?Element}
       */
      let nextCandidate = candidate.nextSibling
      /**
       * @type {?Element}
       */
      let current = this.__currentById(i, candidate)

      if (!isNull(current)) {

        currentRef = current.nextSibling
        this.reconciliation(current, candidate, this.current)
      } else {

        this.current.insertBefore(candidate, currentRef)
      }

      candidate = nextCandidate
      nextCandidate = null
      i++
    } while (candidate)

    if (this.current.childNodes.length > this.candidate.childNodes.length) {
      removeChildNodes(this.current, i)
    }
  }

  /**
   * @private
   * @param {Number} childOrder
   * @param {Element} candidate
   * @return {?Element}
   */
  __currentById(childOrder, candidate) {

    if (childOrder >= this.current.childNodes.length) {
      return null
    }
    return this.__findCurrentNodeByCandidateIdAndEnsurePosition(childOrder, candidate.id)
  }

  /**
   * @param {number} childOrder
   * @param {string} id
   * @return {?Element}
   * @private
   */
  __findCurrentNodeByCandidateIdAndEnsurePosition(childOrder, id) {
    if (id === '') {
      return null
    }
    if (this.current.childNodes[childOrder].id === id) {

      return this.current.childNodes[childOrder]
    } else {
      /**
       * @type {?Element}
       */
      let el = this.__findNodeByIdInChildNodes(this.current, id, childOrder)
      if (isNode(el)) {
        return this.current.insertBefore(el, this.current.childNodes[childOrder])
      }
    }
    return null
  }

  /**
   * @private
   * @param {Element} parentNode
   * @param {String} id
   * @return {?Element}
   */
  __findNodeByIdInChildNodes(parentNode, id, start) {
    return parentNode.querySelector(`:scope > #${id}`)
    //  if (parentNode.childNodes.length > MAX_SLIBINGS_NODES_UPDATE_BY_ID) {
    //    return null
    //  }
    //  for (let i = parentNode.childNodes.length - 1; i >= 0; i--) {
    //    if (parentNode.childNodes[i].id === id) {
    //      ret = parentNode.childNodes[i]
    //    }
    //  }
    //  return null
  }

  /**
   * @return {boolean}
   * @private
   */
  __isEqualNode() {
    if (this._equalNode === null) {
      this._equalNode = this.current.isEqualNode(this.candidate)
    }
    return this._equalNode
  }

  /**
   * @return {boolean}
   * @private
   */
  __isEqualListeners() {
    if (this._equalListeners === null) {
      this._equalListeners = listenerEquals(this.$current.eventListeners(), this.$candidate.eventListeners())
    }
    return this._equalListeners
  }

  /**
   * @return {boolean}
   * @private
   */
  __isEqualWithoutChildren() {
    if (this._equalWithoutChildren === null) {
      this._equalWithoutChildren = this.current.cloneNode(false).isEqualNode(this.candidate.cloneNode(false))
    }
    return this._equalWithoutChildren
  }

  /**
   * @return {boolean}
   * @protected
   */
  _hasByPassRule() {
    return this.$candidate.hasReconciliationRule(R.BYPASS)
  }

  /**
   * @return {boolean}
   * @protected
   */
  _isDocumentFragment() {
    return isNodeDocumentFragment(this.candidate)
  }

  /**
   * @return {boolean}
   * @protected
   */
  _hasExcludeChildrenRule() {
    return this.$candidate.hasReconciliationRule(R.BYPASS_CHILDREN)
  }

  /**
   * @return {boolean}
   * @protected
   */
  _hasOnlyChildrenRule() {
    return this.$candidate.hasReconciliationRule(R.ONLY_CHILDREN)
  }

  /**
   * @return {boolean}
   * @protected
   */
  _hasReconcileListenersRule() {
    return this.$candidate.hasReconciliationRule(R.RECONCILE_LISTENERS)
  }

  /**
   * @return {boolean}
   * @protected
   */
  _hasForceListenersRule() {
    return this.$candidate.hasReconciliationRule(R.REPLACE_LISTENERS)
  }

  /**
   * @return {boolean}
   * @protected
   */
  _hasReplaceRule() {
    return this.$candidate.hasReconciliationRule(R.REPLACE)
  }

  /**
   * @return {boolean}
   * @protected
   */
  _hasForceRule() {
    return this.$candidate.hasReconciliationRule(R.FORCE)
  }

  /**
   * @return {boolean} false
   * @protected
   */
  _abort() {
    return false
  }
}


export const reconcile = Reconciliation.reconciliation
export const startReconcile = Reconciliation.startReconciliation
