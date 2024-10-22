import {globalFlexioImport} from "@flexio-oss/js-commons-bundle/global-import-registry/index.js";

/**
 * @abstract
 * @template TYPE
 */
export class AbstractStoreBuilder {
  /**
   * @type {?TYPE.}
   * @protected
   */
  _type = null

  /**
   * @param {TYPE.} type
   * @return {this}
   */
  type(type) {
    this._type = type
    return this
  }

  /**
   * @return {this}
   */
  typeString(){
    this._type = globalFlexioImport.io.flexio.hotballoon.types.StringValue
    return this;
  }
  /**
   * @return {this}
   */
  typeInt(){
    this._type = globalFlexioImport.io.flexio.hotballoon.types.IntValue
    return this;
  }
  /**
   * @return {this}
   */
  typeFloat(){
    this._type = globalFlexioImport.io.flexio.hotballoon.types.FloatValue
    return this;
  }
  /**
   * @return {this}
   */
  typeBool(){
    this._type = globalFlexioImport.io.flexio.hotballoon.types.BoolValue
    return this;
  }
  /**
   * @return {this}
   */
  typeDate(){
    this._type = globalFlexioImport.io.flexio.hotballoon.types.DateValue
    return this;
  }
  /**
   * @return {this}
   */
  typeDateTime(){
    this._type = globalFlexioImport.io.flexio.hotballoon.types.DateTimeValue
    return this;
  }
  /**
   * @return {this}
   */
  typeTime(){
    this._type = globalFlexioImport.io.flexio.hotballoon.types.TimeValue
    return this;
  }
}