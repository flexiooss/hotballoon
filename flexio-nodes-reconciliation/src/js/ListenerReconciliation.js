import {isNode, assert} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {EventListenerConfig} from './EventListenerConfig'


/**
 * @param {ElementDescription} current
 * @param {ElementDescription} candidate
 */
class ListenerReconciliation {
  /**
   *
   * @param {Node} current
   * @param {ListenerAttributeHandler} $current
   * @param {Node} candidate
   * @param {ListenerAttributeHandler} $candidate
   */
  constructor(current, $current, candidate, $candidate) {
    assert(isNode(current) && isNode(candidate),
      'EventReconciliation: `current` and  `candidate` arguments assert be Node')

    this.current = current
    this.$current = $current
    this.candidate = candidate
    this.$candidate = $candidate
  }

  /**
   * @static
   * @param {Node} current
   * @param {ListenerAttributeHandler} $current
   * @param {Node} candidate
   * @param {ListenerAttributeHandler} $candidate
   */
  static listenerReconciliation(current, $current, candidate, $candidate) {
    new ListenerReconciliation(current, $current, candidate, $candidate).reconcile()
  }

  /**
   * @static
   * @param {Node} current
   * @param {ListenerAttributeHandler} $current
   * @param {Node} candidate
   * @param {ListenerAttributeHandler} $candidate
   */
  static listenerReplace(current, $current, candidate, $candidate) {
    new ListenerReconciliation(current, $current, candidate, $candidate)._removeAllCurrentListeners().reconcile()
  }

  /**
   * @static
   * @param {Map<string, Map<string, EventListenerConfig>>} currentEventsListeners
   * @param {Map<string, Map<string, EventListenerConfig>>} candidateEventsListeners
   * @return {boolean}
   */
  static listenerEquals(currentEventsListeners, candidateEventsListeners) {
    let ret = true

    const test = (a, b) => {
      a.forEach((listener, token, map) => {
        if (listener.size && !b.has(token)) {
          ret = false
          return false
        }
        if (listener instanceof Map) {
          let bListeners = b.get(token)
          listener.forEach((value, key, map) => {
            if (!bListeners.has(key)) {
              ret = false
              return false
            }
          })
        }
      })
    }

    test(candidateEventsListeners, currentEventsListeners)

    if (ret) {
      test(currentEventsListeners, candidateEventsListeners)
    }

    return ret
  }

  reconcile() {
    this._traverseTypes()
  }

  /**
   * @private
   */
  _traverseTypes() {

    this.$candidate.eventListeners().forEach((listener, event, map) => {

      if (!this.$current.eventListeners().has(event)) {
        this._addAllListeners(event)
      } else {
        this._updateCurrent(event)
      }
    })

    this.$current.eventListeners().forEach((listener, event, map) => {
      if (!this.$candidate.eventListeners().has(event)) {
        this._removeAllListeners(event)
      }
    })
  }

  _removeAllCurrentListeners() {
    this.$current.eventListeners().forEach((listener, event, map) => {
      this._removeAllListeners(event)
    })
    return this
  }

  /**
   * @private
   * @param {String} event - params of events
   */
  _updateCurrent(event) {

    const currentListenersMap = this.$current.eventListeners().get(event)

    const candidateListenersMap = this.$candidate.eventListeners().get(event)

    currentListenersMap.forEach(
      /**
       *
       * @param {EventListenerConfig} currentListener
       * @param {string} currentToken
       * @param set
       */
      (currentListener, currentToken, set) => {

        let hasEvent = false
        candidateListenersMap.forEach((
          /**
           * @type {EventListenerConfig}
           */
          listener,
          token,
          set
        ) => {

          if (EventListenerConfig.areLike(currentListener, listener)) {
            hasEvent = true
          }
        })

        if (!hasEvent) {
          this._removeEventListener(currentListener.event, currentToken)
        }
      })

    candidateListenersMap.forEach((candidateListener, candidateToken, set) => {

      let hasEvent = false
      currentListenersMap.forEach((
        /**
         * @type {EventListenerConfig}
         */
        listener,
        token,
        set
      ) => {

        if (EventListenerConfig.areLike(candidateListener, listener)) {
          hasEvent = true
        }
      })

      if (!hasEvent) {
        this._addEventListener(candidateListener)
      }

    })
  }

  /**
   * @private
   * @param {String} event - params of events
   */
  _removeAllListeners(event) {
    this.$current.eventListeners().get(event)
      .forEach((listener, token, set) => {
        this._removeEventListener(listener.events, token)
      })
  }

  /**
   * @private
   * @param {String} event - params of events
   */
  _addAllListeners(event) {
    this.$candidate.eventListeners().get(event)
      .forEach((listener, token, set) => {
        this._addEventListener(listener)
      })
  }

  /**
   * @private
   * @param {String} event - params of events
   * @param {String} token of Listener Map entry
   */
  _removeEventListener(event, token) {
    this.$current.off(event, token)
  }

  /**
   * @private
   * @param {EventListenerConfig} listener - params of events
   */
  _addEventListener(listener) {
    this.$current.on(listener)
  }

}


export const listenerReplace = ListenerReconciliation.listenerReplace
export const listenerReconcile = ListenerReconciliation.listenerReconciliation
export const listenerEquals = ListenerReconciliation.listenerEquals
