import {AttributeHandler} from './__import__flexio-hyperflex'
import { TypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
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
    return this.reconcileProperties().has(property)
  }

  /**
   *
   * @param {string} rule
   * @return {boolean}
   */
  hasReconciliationRule(rule) {
    return this.reconcileRules().has(rule)
  }

  /**
   * @return {Set<string>}
   */
  reconcileRules() {
    if (!(KEY_RECONCILIATE_RULES in this.privateAttribute)) {
      this.privateAttribute[KEY_RECONCILIATE_RULES] = new Set()
    }
    return this.privateAttribute[KEY_RECONCILIATE_RULES]
  }

  /**
   * @return {Set<string>}
   */
  reconcileProperties() {
    if (!(KEY_RECONCILIATE_PROPERTIES in this.privateAttribute)) {
      this.privateAttribute[KEY_RECONCILIATE_PROPERTIES] = new Set()
    }
    return this.privateAttribute[KEY_RECONCILIATE_PROPERTIES]
  }

  /**
   * @param {Set<string>} rules
   */
  addReconcileRules(rules) {
    TypeCheck.assertIsSetType(rules)
    for (const rule of rules) {
      this.#addReconcileRule(rule)
    }
  }

  /**
   * @param {string} rule
   */
  #addReconcileRule(rule) {
    if (ReconciliationAttributeHandler.#isAllowedRule(rule)) {
      this.reconcileRules().add(rule)
    }
  }

  /**
   * @param {String} rule
   */
  removeReconcileRule(rule) {
    this.reconcileRules().delete(rule)
  }

  /**
   * @param {String} rule
   * @return {boolean}
   */
  static #isAllowedRule(rule) {
    return rule in RECONCILIATION_RULES
  }

  /**
   * @param {Set<string>}  properties
   */
  addReconcileProperties(properties) {
    TypeCheck.assertIsSetType(properties)
    if (!this.hasReconciliationProperties()) {
      this.privateAttribute[KEY_RECONCILIATE_PROPERTIES] = properties
    } else {
      for (const property of properties) {
        this.reconcileProperties().add(property)
      }
    }
  }

  /**
   * @param {String} property
   */
  removeReconcileProperty(property) {
    this.reconcileProperties().delete(property)
  }
}

export const select = ReconciliationAttributeHandler.select
export {
  ReconciliationAttributeHandler
}
