import { globalFlexioImport } from '@flexio-oss/js-commons-bundle/global-import-registry/index.js'
import { assertType, isBoolean, isObject, assert, isNumber, isNull, isString } from '@flexio-oss/js-commons-bundle/assert/index.js'
import { deepFreezeSeal } from '@flexio-oss/js-commons-bundle/js-generator-helpers/index.js'

class Layer {
  /**
   * @param {string} id
   * @param {string} collection
   * @param {number} scrollLeft
   * @param {number} scrollTop
   * @param {string} activeElementId
   * @param {boolean} show
   * @private
   */
  constructor(id, collection, scrollLeft, scrollTop, activeElementId, show) {
    /**
     * @private
     */
    this._id = id

    /**
     * @private
     */
    this._collection = collection

    /**
     * @private
     */
    this._scrollLeft = scrollLeft

    /**
     * @private
     */
    this._scrollTop = scrollTop

    /**
     * @private
     */
    this._activeElementId = activeElementId

    /**
     * @private
     */
    this._show = show

    deepFreezeSeal(this)
  }

  /**
   * @returns {string}
   */
  id() {
    return this._id
  }

  /**
   * @returns {string}
   */
  collection() {
    return this._collection
  }

  /**
   * @returns {number}
   */
  scrollLeft() {
    return this._scrollLeft
  }

  /**
   * @returns {number}
   */
  scrollTop() {
    return this._scrollTop
  }

  /**
   * @returns {string}
   */
  activeElementId() {
    return this._activeElementId
  }

  /**
   * @returns {boolean}
   */
  show() {
    return this._show
  }

  /**
   * @param {string} id
   * @returns {Layer}
   */
  withId(id) {
    let builder = LayerBuilder.from(this);
    builder.id(id)
    return builder.build()
  }

  /**
   * @param {string} collection
   * @returns {Layer}
   */
  withCollection(collection) {
    let builder = LayerBuilder.from(this);
    builder.collection(collection)
    return builder.build()
  }

  /**
   * @param {number} scrollLeft
   * @returns {Layer}
   */
  withScrollLeft(scrollLeft) {
    let builder = LayerBuilder.from(this);
    builder.scrollLeft(scrollLeft)
    return builder.build()
  }

  /**
   * @param {number} scrollTop
   * @returns {Layer}
   */
  withScrollTop(scrollTop) {
    let builder = LayerBuilder.from(this);
    builder.scrollTop(scrollTop)
    return builder.build()
  }

  /**
   * @param {string} activeElementId
   * @returns {Layer}
   */
  withActiveElementId(activeElementId) {
    let builder = LayerBuilder.from(this);
    builder.activeElementId(activeElementId)
    return builder.build()
  }

  /**
   * @param {boolean} show
   * @returns {Layer}
   */
  withShow(show) {
    let builder = LayerBuilder.from(this);
    builder.show(show)
    return builder.build()
  }

  /**
   * @returns {LayerBuilder}
   */
  static builder() {
    return new LayerBuilder()
  }

  /**
   * @param {Layer} instance
   * @returns {LayerBuilder}
   */
  static from(instance) {
    return LayerBuilder.from(instance)
  }

  /**
   * @param {Object} jsonObject
   * @returns {LayerBuilder}
   */
  static fromObject(jsonObject) {
    return LayerBuilder.fromObject(jsonObject)
  }

  /**
   * @param {string} json
   * @returns {LayerBuilder}
   */
  static fromJson(json) {
    return LayerBuilder.fromJson(json)
  }

  /**
   * @returns {Object}
   */
  toObject() {
    let jsonObject = {}
    if (!isNull(this._id)) {
      jsonObject['id'] = this._id
    }
    if (!isNull(this._collection)) {
      jsonObject['collection'] = this._collection
    }
    if (!isNull(this._scrollLeft)) {
      jsonObject['scrollLeft'] = this._scrollLeft
    }
    if (!isNull(this._scrollTop)) {
      jsonObject['scrollTop'] = this._scrollTop
    }
    if (!isNull(this._activeElementId)) {
      jsonObject['activeElementId'] = this._activeElementId
    }
    if (!isNull(this._show)) {
      jsonObject['show'] = this._show
    }
    return jsonObject
  }

  /**
   * @returns {Object}
   */
  toJSON() {
    return this.toObject()
  }
}

export { Layer }

class LayerBuilder {
  /**
   * @constructor
   */
  constructor() {
    this._id = null
    this._collection = null
    this._scrollLeft = null
    this._scrollTop = null
    this._activeElementId = null
    this._show = null
  }
  
  /**
   * @param {?string} id
   * @returns {LayerBuilder}
   */
  id(id) {
    if (!isNull(id)) {
      assertType(isString(id), 'id should be a string')
    }
    this._id = id
    return this
  }

  /**
   * @param {?string} collection
   * @returns {LayerBuilder}
   */
  collection(collection) {
    if (!isNull(collection)) {
      assertType(isString(collection), 'collection should be a string')
    }
    this._collection = collection
    return this
  }

  /**
   * @param {?number} scrollLeft
   * @returns {LayerBuilder}
   */
  scrollLeft(scrollLeft) {
    if (!isNull(scrollLeft)) {
      assertType(isNumber(scrollLeft), 'scrollLeft should be a number')
    }
    this._scrollLeft = scrollLeft
    return this
  }

  /**
   * @param {?number} scrollTop
   * @returns {LayerBuilder}
   */
  scrollTop(scrollTop) {
    if (!isNull(scrollTop)) {
      assertType(isNumber(scrollTop), 'scrollTop should be a number')
    }
    this._scrollTop = scrollTop
    return this
  }

  /**
   * @param {?string} activeElementId
   * @returns {LayerBuilder}
   */
  activeElementId(activeElementId) {
    if (!isNull(activeElementId)) {
      assertType(isString(activeElementId), 'activeElementId should be a string')
    }
    this._activeElementId = activeElementId
    return this
  }

  /**
   * @param {?boolean} show
   * @returns {LayerBuilder}
   */
  show(show) {
    if (!isNull(show)) {
      assertType(isBoolean(show), 'show should be a bool')
    }
    this._show = show
    return this
  }

  /**
   * @returns {Layer}
   */
  build() {
    return new Layer(this._id, this._collection, this._scrollLeft, this._scrollTop, this._activeElementId, this._show)
  }

  static getPropertyFromObject( jsonObject, propertyName, normalizedPropertyName ){
    if( jsonObject[propertyName] !== undefined && !isNull( jsonObject[propertyName] )){
      return jsonObject[propertyName];
    }
    else if( jsonObject[normalizedPropertyName] !== undefined && !isNull( jsonObject[normalizedPropertyName] )){
      return jsonObject[normalizedPropertyName];
    }
    else {
      return null;
    }
  }
  /**
   * @param {Object} jsonObject
   * @returns {LayerBuilder}
   */
  static fromObject(jsonObject) {
    assertType(isObject(jsonObject), 'input should be an object')
    let builder = new LayerBuilder()
    let jsonProperty;
    jsonProperty = LayerBuilder.getPropertyFromObject( jsonObject, 'id', 'id' );
    if( jsonProperty !== undefined && !isNull( jsonProperty )){
      builder.id(jsonProperty)
    }
    jsonProperty = LayerBuilder.getPropertyFromObject( jsonObject, 'collection', 'collection' );
    if( jsonProperty !== undefined && !isNull( jsonProperty )){
      builder.collection(jsonProperty)
    }
    jsonProperty = LayerBuilder.getPropertyFromObject( jsonObject, 'scrollLeft', 'scrollLeft' );
    if( jsonProperty !== undefined && !isNull( jsonProperty )){
      builder.scrollLeft(parseFloat(jsonProperty))
    }
    jsonProperty = LayerBuilder.getPropertyFromObject( jsonObject, 'scrollTop', 'scrollTop' );
    if( jsonProperty !== undefined && !isNull( jsonProperty )){
      builder.scrollTop(parseFloat(jsonProperty))
    }
    jsonProperty = LayerBuilder.getPropertyFromObject( jsonObject, 'activeElementId', 'activeElementId' );
    if( jsonProperty !== undefined && !isNull( jsonProperty )){
      builder.activeElementId(jsonProperty)
    }
    jsonProperty = LayerBuilder.getPropertyFromObject( jsonObject, 'show', 'show' );
    if( jsonProperty !== undefined && !isNull( jsonProperty )){
      builder.show(jsonProperty)
    }
    return builder
  }

  /**
   * @param {string} json
   * @returns {LayerBuilder}
   */
  static fromJson(json) {
    assertType(isString(json), 'input should be a string')
    let jsonObject = JSON.parse(json)
    return this.fromObject(jsonObject)
  }

  /**
   * @param {Layer} instance
   * @returns {LayerBuilder}
   */
  static from(instance) {
    assertType(instance instanceof Layer, 'input should be an instance of Layer')
    let builder = new LayerBuilder()
    builder.id(instance.id())
    builder.collection(instance.collection())
    builder.scrollLeft(instance.scrollLeft())
    builder.scrollTop(instance.scrollTop())
    builder.activeElementId(instance.activeElementId())
    builder.show(instance.show())
    return builder
  }
}

export { LayerBuilder }
