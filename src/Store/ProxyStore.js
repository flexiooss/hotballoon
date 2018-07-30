'use strict'
import {EventOrderedHandler} from '../Event/EventOrderedHandler'
import {EventListenerOrderedFactory} from '../Event/EventListenerOrderedFactory'
import {assert, isFunction, UID} from 'flexio-jshelpers'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_PROXYSTORE} from '../CLASS_TAG_NAME'
import {StoreInterface} from './StoreInterface'
import {State} from './State'

/**
 * @extends StoreInterface
 * @implements StoreInterface
 */
export class ProxyStore extends StoreInterface {
  /**
   * @constructor
   * @param {String} id
   * @param {Store} store
   * @param {Function} mapper
   */
  constructor(id, store, mapper) {
    super(id)

    assert(store instanceof StoreInterface, '`store` argument should be an instance of StoreInterface')
    assert(isFunction(mapper), '`mapper` argument should be a Function')

    this.debug.color = 'magenta'

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_PROXYSTORE
    })

    Object.defineProperties(this, {
      _EventHandler: {
        enumerable: false,
        configurable: false,
        /**
         * @property {EventOrderedHandler}
         * @name ProxyStore#_EventHandler
         * @protected
         */
        value: Object.seal(new EventOrderedHandler())
      },
      _Store: {
        enumerable: false,
        configurable: false,
        /**
         * @property {Store}
         * @name ProxyStore#_Store
         * @protected
         */
        value: store
      },
      _mapper: {
        enumerable: false,
        configurable: false,
        /**
         * @property {Function}
         * @name ProxyStore#_mapper
         * @protected
         */
        value: mapper
      }
    })
  }

  /**
   *
   * @param {Store} store
   * @param {Function} mapper
   * @return {ProxyStore}
   * @static
   */
  static create(store, mapper) {
    return new this(UID(`proxy_${store.constructor.name}_${store._ID}_`), store, mapper)
  }

  /**
   * @param {EventListenerOrderedParam} eventListenerOrderedParam
   * @return {String} token
   */
  subscribe(eventListenerOrderedParam) {
    this._Store.subscribe(
      EventListenerOrderedFactory.listen(eventListenerOrderedParam.event)
        .callback((eventType, payload) => {
          this._dispatch(
            eventType,
            new State(this._ID, this._mapper(payload.data))
          )
        })
        .priority(20)
        .build(this)
    )
    return this._EventHandler.on(eventListenerOrderedParam)
  }

  /**
   * @returns {State#data} state#data frozen
   */
  data() {
    return this.state().data
  }

  /**
   * @returns {State} state frozen
   */
  state() {
    return new State(this._ID, this._mapper(this._Store.data()))
  }

  /**
   * @private
   * @param {String} eventType
   * @param {Object} payload
   */
  _dispatch(eventType, payload) {
    this._EventHandler.dispatch(eventType, payload)
  }
}
