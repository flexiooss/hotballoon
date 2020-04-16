import {AttributeHandler} from './__import__flexio-hyperflex'
import {assert} from '@flexio-oss/js-commons-bundle/assert'
import {
  KEY_RECONCILIATE_RULES,
  KEY_RECONCILIATE_PROPERTIES
} from './constantes'
import {
  RECONCILIATION_RULES
} from './rules'

/**
 * @extends AttributeHandler
 */
class ReconciliationAttributeHandler extends AttributeHandler {
  /**
   * @static
   * @param {Node} element
   * @return {ReconciliationAttributeHandler}
   */
  static select(element) {
    return new ReconciliationAttributeHandler(element)
  }

  /**
   *
   * @return {boolean}
   */
  hasReconciliationRules() {
    return KEY_RECONCILIATE_RULES in this.privateAttribute
  }

  /**
   *
   * @return {boolean}
   */
  hasReconciliationProperties() {
    return KEY_RECONCILIATE_PROPERTIES in this.privateAttribute
  }

  /**
   *
   * @param {string} rule
   * @return {boolean}
   */
  hasReconciliationProperty(property) {
    return this.reconcileProperties().indexOf(property) > -1
  }

  /**
   *
   * @param {string} rule
   * @return {boolean}
   */
  hasReconciliationRule(rule) {
    return this.reconcileRules().indexOf(rule) > -1
  }

  /**
   *
   * @return {array<string>}
   */
  reconcileRules() {
    if (!(KEY_RECONCILIATE_RULES in this.privateAttribute)) {
      this.privateAttribute[KEY_RECONCILIATE_RULES] = this.__initReconcileRule()
    }
    return this.privateAttribute[KEY_RECONCILIATE_RULES]
  }

  /**
   *
   * @return {array<string>}
   */
  reconcileProperties() {
    if (!(KEY_RECONCILIATE_PROPERTIES in this.privateAttribute)) {
      this.privateAttribute[KEY_RECONCILIATE_PROPERTIES] = this.__initReconcileProperties()
    }
    return this.privateAttribute[KEY_RECONCILIATE_PROPERTIES]
  }

  /**
   * @private
   * @return {array}
   */
  __initReconcileRule() {
    return []
  }

  /**
   * @private
   * @return {array}
   */
  __initReconcileProperties() {
    return []
  }

  /**
   * @param {array<string>} rules
   */
  addReconcileRules(rules) {
    assert(Array.isArray(rules),
      'flexio-nodes-reconciliation:ReconciliationAttributeHandler:addReconcileRules: `rules` argument assert be an Array `%s` given',
      typeof rules
    )

    for (const rule of rules) {
      this.__addReconcileRule(rule)
    }
  }

  /**
   * @private
   * @param {string} rule
   */
  __addReconcileRule(rule) {
    if (this.__isAllowedRule(rule) && !this.hasReconciliationRule(rule)) {
      this.reconcileRules().push(rule)
    }
  }

  /**
   * @param {String} rule
   */
  removeReconcileRule(rule) {
    const index = this.reconcileRules().indexOf(rule)
    if (index > -1) {
      this.reconcileRules().splice(index, 1)
    }
  }

  /**
   * @private
   * @param {String} rule
   * @return {boolean}
   */
  __isAllowedRule(rule) {
    return rule in RECONCILIATION_RULES
  }

  /**
   * @param {Array<string>} properties
   */
  addReconcileProperties(properties) {
    assert(Array.isArray(properties),
      'flexio-nodes-reconciliation:ReconciliationAttributeHandler:addReconcileProperties: `properties` argument assert be an Array `%s` given',
      typeof properties
    )

    for (const property of properties) {
      this.__addReconcileProperty(property)
    }
  }

  /**
   * @private
   * @param {string} property
   */
  __addReconcileProperty(property) {
    this.reconcileProperties().push(property)
  }

  /**
   * @param {String} property
   */
  removeReconcileProperty(property) {
    const index = this.reconcileProperties().indexOf(property)
    if (index > -1) {
      this.reconcileProperties().splice(index, 1)
    }
  }
}

export const select = ReconciliationAttributeHandler.select
export {
  ReconciliationAttributeHandler
}
